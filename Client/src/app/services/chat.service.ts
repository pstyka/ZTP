import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { environment } from "../../environment";
import { Message } from "../models/chat";
import { Store } from "@ngrx/store";
import { AppState } from "../store";
import { decodeJwt } from "../utils";
import { getTokenSelector } from '../auth/store';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket!: WebSocket;
  private token$!: Observable<string | undefined>;
  private userId: string | undefined;
  private messageSubject = new Subject<Message>();

  constructor(
    private store: Store<AppState>,
    private http: HttpClient
  ) {
    this.selectToken();
    this.subscribeToken();
  }

  sendMessage(receiverId: string, content: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const messageData = {
        receiver_id: receiverId,
        content: content
      };
      this.socket.send(JSON.stringify(messageData));
    } else {
      console.error('WebSocket nie jest połączony');
    }
  }

  getMessages(): Observable<Message> {
    return this.messageSubject.asObservable();
  }

  getConversationHistory(userId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.apiUrl}/chat/messages/${userId}`, {
      headers: { 'X-User-ID': this.userId || '' }
    });
  }

  getConversations(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/chat/conversations`, {
      headers: { 'X-User-ID': this.userId || '' }
    });
  }

  closeConnection(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  }

  reconnect(): void {
    this.closeConnection();
    this.connectWebSocket();
  }

  isConnected(): boolean {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  private connectWebSocket(): void {
    if (!this.userId) return;

    const wsUrl = `ws://${environment.usersUrl}${this.userId}`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket połączony');
    };

    this.socket.onclose = (event) => {
      console.warn('WebSocket zamknięty', event);
      setTimeout(() => this.reconnect(), 3000);
    };

    this.socket.onerror = (event) => {
      console.error('WebSocket błąd', event);
    };

    this.socket.onmessage = (event) => {
      try {
        const message: Message = JSON.parse(event.data);
        if (message.error) {
          console.error('Błąd z serwera:', message.error);
        } else {
          this.messageSubject.next(message);
        }
      } catch (e) {
        console.error('Błąd parsowania wiadomości:', e);
      }
    };
  }

  private selectToken() {
    this.token$ = this.store.select(getTokenSelector);
  }

  private subscribeToken() {
    this.token$.subscribe(token => {
      if (token) {
        const decodedToken = decodeJwt(token);
        this.userId = decodedToken.sub;
        console.log(this.userId);
        this.connectWebSocket();
      }
    });
  }
}