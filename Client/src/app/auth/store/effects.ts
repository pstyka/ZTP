import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { AuthActions } from ".";
import { AuthService, NotificationService } from "../../services";
import { Router } from "@angular/router";


@Injectable()
export class AuthEffects {
    private actions$ = inject(Actions);
    private authService = inject(AuthService);
    private notificationService = inject(NotificationService);
    private router = inject(Router);

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            mergeMap((action) => {
                return this.authService.login(action.login).pipe(
                    map((token) => AuthActions.loginSuccess({ token })),
                    catchError((error) => {
                        this.notificationService.error("Wrong email or password.");
                        return of(AuthActions.loginFailure({ error: error.message }));
                    }
                    )
                );
            })
        )
    );

    onLoginSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
            ofType(AuthActions.loginSuccess),
            map((token) => {
                localStorage.setItem('auth_token', JSON.stringify(token.token));
                this.router.navigate(['']);
            })
            ),
        { dispatch: false }
    );

    register$ = createEffect(() => 
        this.actions$.pipe(
            ofType(AuthActions.register),
            mergeMap((action) => {
                return this.authService.register(action.register).pipe(
                    map(() => AuthActions.registerSuccess()),
                    catchError((error) => 
                        of(AuthActions.registerFailure({ error: error.message }))
                    )
                );
            })
        )
    );

    onRegisterSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
            ofType(AuthActions.registerSuccess),
            map(() => {
                this.notificationService.success('Account has been created.');
            })
            ),
        { dispatch: false }
    );

    onLogout$ = createEffect(
        () =>
            this.actions$.pipe(
            ofType(AuthActions.logout),
            map(() => {
                this.notificationService.success('Logout success.');
            })
            ),
        { dispatch: false }
    );
}