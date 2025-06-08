import { createReducer, on } from "@ngrx/store";
import { FlatActions, FlatState } from "./index";

export const initialState: FlatState = {
    flat: undefined,
    flats: undefined,
    flatPhotosUrls: undefined,
};

export const reducer = createReducer(
    initialState,
    on(FlatActions.getFlats, (state, action) => ({
        ...state,
        flats: undefined
    })),
    on(FlatActions.getFlatsSuccess, (state, action) => ({
        ...state,
        flats: action.flats
    })),
    on(FlatActions.getFlatPhotosSuccess, (state, action) => ({
        ...state,
        flatPhotosUrls: action.urls
    })),
    on(FlatActions.getFlatSuccess, (state, action) => ({
        ...state,
        flat: action.flat
    }))
);

