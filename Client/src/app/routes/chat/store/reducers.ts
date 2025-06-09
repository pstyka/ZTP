import { createReducer, on } from "@ngrx/store";
import { ChatState } from ".";

export const initialState: ChatState = {
};

export const reducer = createReducer(
    initialState,
    // on(FlatActions.getFlats, (state, action) => ({
    //     ...state,
    //     flats: undefined
    // })),
    // on(FlatActions.getFlatsSuccess, (state, action) => ({
    //     ...state,
    //     flats: action.flats
    // })),
    // on(FlatActions.getFlatPhotosSuccess, (state, action) => ({
    //     ...state,
    //     flatPhotosUrls: action.urls
    // })),
    // on(FlatActions.getFlatSuccess, (state, action) => ({
    //     ...state,
    //     flat: action.flat
    // }))
);

