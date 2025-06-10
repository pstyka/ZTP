import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "../../environment";
import { Message } from "../models/chat";
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Store } from "@ngrx/store";
import { AppState } from "../store";
import { getUserSelector } from "../routes/my-profile/store";
import { getTokenSelector } from "../auth/store";
import { decodeJwt } from "../utils";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private socket$!: WebSocketSubject<any>;
    private token$!: Observable<string | undefined>;
    private userId: string | undefined;

    constructor(private store: Store<AppState>, @Inject(PLATFORM_ID) private platformId: Object) {
        this.selectToken();
        this.subscribeToken();
    }

    sendMessage(message: Message) {
        this.socket$.next(message);
    }

    getMessages(): Observable<any> {
        return this.socket$.asObservable();
    }

    closeConnection() {
        this.socket$.complete();
    }

    private selectToken() {
        this.token$ = this.store.select(getTokenSelector);
    }

    private subscribeToken() {
        this.token$.subscribe(token => {
            if (token && isPlatformBrowser(this.platformId)) {
            var decodedToken = decodeJwt(token);
            this.userId = decodedToken.sub;
            this.initializeWebSocket();
            }
        });
    }

    private initializeWebSocket() {
        const ws = new WebSocket(`ws://${environment.usersUrl}${this.userId}`);
    }
}