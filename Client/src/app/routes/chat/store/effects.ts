import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { ChatService, FlatService } from "../../../services";
import { ChatActions } from ".";

@Injectable()
export class ChatEffects {
    private actions$ = inject(Actions);
    private chatService = inject(ChatService);

    sendMessage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ChatActions.sendMessage),
            mergeMap((action) => {
                return this.chatService.send(action.message).pipe(
                    map((res) => ChatActions.sendMessageSuccess()),
                    catchError((error) => {
                        return of(ChatActions.sendMessageFailure({ error: error.message }));
                    }
                    )
                );
            })
        )
    );
}