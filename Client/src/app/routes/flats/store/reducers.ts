import { createReducer, on } from "@ngrx/store";
import { FlatState } from "./index";

export const initialState: FlatState = {
    
};

export const reducer = createReducer(
    initialState,
    // on(UserActions.getMeSuccess, (state, action) => ({
    //     ...state,
    //     user: action.user
    // })),
);

