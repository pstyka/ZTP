import { createReducer, on } from "@ngrx/store";
import { AuthState } from "./auth.state";
import { AuthActions } from ".";
import { decodeJwt } from "../../utils";

export const initialState: AuthState = {
    isLoggedIn: false,
    token: undefined,
    userId: undefined,
    isAdmin: false
};

export const reducer = createReducer(
    initialState,
    on(AuthActions.login, (state) => ({
        ...state,
        isLoggedIn: false,
        token: undefined,
        userId: undefined
    })),
    on(AuthActions.loginSuccess, (state, action) => {
        const payload = decodeJwt(action.token);
        return {
        ...state,
        isLoggedIn: true,
        token: action.token,
        userId: payload?.sub
        };
    }),
    on(AuthActions.loginFailure, (state, action) => ({
        ...state,
        isLoggedIn: false,
        token: undefined
    })),
    on(AuthActions.logout, (state) => ({
        ...state,
        isLoggedIn: false,
        token: undefined
    })),
    on(AuthActions.setTokenSuccess, (state, action) => {
        const payload = decodeJwt(action.token ?? '');
        return {
        ...state,
        isLoggedIn: true,
        token: action.token ?? undefined,
        userId: payload?.sub
        };
    }),
);

