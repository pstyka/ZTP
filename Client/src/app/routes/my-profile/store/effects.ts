import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { UserService } from "../../../services";
import { UserActions } from ".";

@Injectable()
export class UserEffects {
    private actions$ = inject(Actions);
    private userService = inject(UserService);

    getMe$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.getMe),
            mergeMap((action) => {
                return this.userService.getMe().pipe(
                    map((user) => UserActions.getMeSuccess({ user })),
                    catchError((error) => {
                        return of(UserActions.getMeFailure({ error: error.message }));
                    }
                    )
                );
            })
        )
    );

}