import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { ChatService, FlatService } from "../../../services";
import { ChatActions } from ".";

@Injectable()
export class ChatEffects {
    private actions$ = inject(Actions);
    private chatService = inject(ChatService);

    getConversations$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ChatActions.getConversations),
            mergeMap((action) => {
                return this.chatService.getConversations().pipe(
                    map((res) => ChatActions.getConversationsSuccess({ conversetions: res })),
                    catchError((error) => {
                        return of(ChatActions.getConversationsFailure({ error: error.message }));
                    }
                    )
                );
            })
        )
    );

    getConversationHistory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ChatActions.getConversationHistory),
            mergeMap((action) => {
                return this.chatService.getConversationHistory(action.userId).pipe(
                    map((res) => ChatActions.getConversationHistorySuccess({ conversationHistory: res })),
                    catchError((error) => {
                        return of(ChatActions.getConversationHistoryFailure({ error: error.message }));
                    }
                    )
                );
            })
        )
    );
}