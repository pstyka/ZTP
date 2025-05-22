import { createReducer, on } from "@ngrx/store";
import { AuthState } from "./auth.state";
import { AuthActions } from ".";

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
        token: undefined
    })),
    on(AuthActions.loginSuccess, (state, action) => ({
        ...state,
        isLoggedIn: true,
        token: action.token
    })),
    // on(AuthActions.loginSuccess, (state, action) => {
    //     var decodedToken = jwtDecode(action.token) as DecodedToken;
    //     return {
    //         ...state,
    //         isLoggedIn: true,
    //         token: action.token,
    //         username: decodedToken.username,
    //         claims: decodedToken.claims,
    //         exp: decodedToken.exp,
    //         userId: decodedToken.userId,
    //         // isAdmin: decodedToken.isAdmin === Claim.TRUE_VALUE,
    //         rolesIds: decodedToken.rolesIds,
    //         userGroupsIds: decodedToken.userGroupsIds
    //     };
    // }),
    on(AuthActions.loginFailure, (state, action) => ({
        ...state,
        isLoggedIn: false,
        token: undefined
    })),
    on(AuthActions.logout, (state) => ({
        ...state,
        isLoggedIn: false,
        token: undefined
    }))
);

