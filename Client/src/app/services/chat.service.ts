import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subject } from "rxjs";
import { environment } from "../../environment";
import { Message } from "../models/chat";
import { Store } from "@ngrx/store";
import { AppState } from "../store";
import { getTokenSelector } from "../auth/store";
import { decodeJwt } from "../utils";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket!: WebSocket;
  private token!: string | null;
  private userId: string | undefined;
  private messageSubject = new Subject<Message>();

  constructor(
    private store: Store<AppState>
  ) {
    this.token = localStorage.getItem('token');
    if(this.token) {
        const decodedToken = decodeJwt(this.token);
        this.userId = decodedToken.sub;
        this.initializeWebSocket();
    }
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

  private initializeWebSocket(): void {
    const wsUrl = `ws://${environment.usersUrl}${this.userId}`;
    this.socket = new WebSocket(wsUrl);
    console.log(this.socket);
  }
}
