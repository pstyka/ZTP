import { createReducer, on } from "@ngrx/store";
import { UserState } from "./user.state";
import { UserActions } from "./index";

export const initialState: UserState = {
    user: undefined,
};

export const reducer = createReducer(
    initialState,
    on(UserActions.getMeSuccess, (state, action) => ({
        ...state,
        user: action.user
    })),
);

