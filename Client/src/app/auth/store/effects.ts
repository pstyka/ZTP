import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { AuthActions } from ".";
import { AuthService } from "../../services";


@Injectable()
export class AuthEffects {
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            mergeMap((action) => {
                return this.authService.login(action.login).pipe(
                    map((token) => AuthActions.loginSuccess({ token })),
                    catchError((error) => {
                        if (error.status === 401)
                            console.log(error);
                            // this.authService.setLoginDataValid(false);
                        return of(AuthActions.loginFailure({ error: error.message }));
                    }
                    )
                );
            })
        )
    );

    constructor(private actions$: Actions,
        private authService: AuthService,
        // private router: Router,
        // private usersService: UsersService,
        // private notificationsService: NotificationsService
    ) { }

}