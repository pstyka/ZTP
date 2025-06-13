import { createReducer, on } from "@ngrx/store";
import { FlatActions, FlatState } from "./index";

export const initialState: FlatState = {
    flat: undefined,
    flats: [],
    flatPhotosUrls: undefined,
    ownerFlats: []
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
    })),
    on(FlatActions.getFlatsByOwnerIdSuccess, (state, action) => ({
        ...state,
        ownerFlats: action.flats
    }))
);

