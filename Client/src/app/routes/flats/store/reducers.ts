import { createReducer, on } from "@ngrx/store";
import { FlatActions, FlatState } from "./index";

export const initialState: FlatState = {
    flats: undefined
};

export const reducer = createReducer(
    initialState,
    on(FlatActions.getFlatsSuccess, (state, action) => ({
        ...state,
        flats: action.flats
    })),
);

