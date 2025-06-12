import { createReducer, on } from "@ngrx/store";
import { ChatActions, ChatState } from ".";
import { Conversation } from "../../../models/chat";

export const initialState: ChatState = {
    conversations: [] as Conversation[],
    conversationHistory: undefined
};

export const reducer = createReducer(
    initialState,
    on(ChatActions.getConversationsSuccess, (state, action) => ({
        ...state,
        conversations: action.conversetions
    })),
    on(ChatActions.getConversationHistorySuccess, (state, action) => ({
        ...state,
        conversationHistory: action.conversationHistory
    })),
    // on(FlatActions.getFlatPhotosSuccess, (state, action) => ({
    //     ...state,
    //     flatPhotosUrls: action.urls
    // })),
    // on(FlatActions.getFlatSuccess, (state, action) => ({
    //     ...state,
    //     flat: action.flat
    // }))
);

