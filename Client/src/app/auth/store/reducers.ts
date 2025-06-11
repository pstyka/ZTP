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
        const accessToken = action.token.access_token;
        const payload = decodeJwt(accessToken);

        return {
            ...state,
            isLoggedIn: true,
            token: accessToken,
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
        if(action.token) {
            const payload = decodeJwt(action.token.access_token);
            
            return {
                ...state,
                isLoggedIn: true,
                token: action.token.access_token,
                userId: payload?.sub
            };
        } else {
            return {
                ...state,
                isLoggedIn: true,
                token: undefined,
                userId: undefined
            };
        }

        
    }),
);

