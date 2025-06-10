import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { environment } from "../../environment";
import { Message } from "../models/chat";
import { select, Store } from "@ngrx/store";
import { AppState } from "../store";
import { decodeJwt } from "../utils";
import { getTokenSelector } from '../auth/store';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket!: WebSocket;
  private token$!: Observable<string | undefined>;
  private userId: string | undefined;
  private messageSubject = new Subject<Message>();

  constructor(
    private store: Store<AppState>
  ) {
    this.selectToken();
    this.subscribeToken();
  }

  sendMessage(message: Message): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  getMessages(): Observable<Message> {
    return this.messageSubject.asObservable();
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


  private connectWebSocket(): void {
    console.log("Start connecting");
    const wsUrl = `ws://${environment.usersUrl}${this.userId}`;
    this.socket = new WebSocket(wsUrl);
    console.log(this.socket);

    this.socket.onopen = () => {
        console.log('WebSocket OPEN');
    };

    this.socket.onclose = (event) => {
        console.warn('WebSocket CLOSED', event);
    };

    this.socket.onerror = (event) => {
        console.error('WebSocket ERROR', event);
    };

    this.socket.onmessage = (event) => {
        console.log(event);
        const message: Message = JSON.parse(event.data);
        this.messageSubject.next(message);
    };
  }

  private selectToken() {
    this.token$ = this.store.select(getTokenSelector);
  }

  private subscribeToken() {
    this.token$.subscribe(token => {
        if(token) {
            const decodedToken = decodeJwt(token);
            this.userId = decodedToken.sub;
            this.connectWebSocket();
        }
    });
  }
}
