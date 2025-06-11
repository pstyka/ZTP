import { createReducer, on } from "@ngrx/store";
import { ChatActions, ChatState } from ".";
import { Conversation } from "../../../models/chat";

export const initialState: ChatState = {
    conversations: [] as Conversation[]
};

export const reducer = createReducer(
    initialState,
    on(ChatActions.getConversationsSuccess, (state, action) => ({
        ...state,
        conversations: action.conversetions
    })),
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

