import { createReducer, on } from "@ngrx/store";
import { ChatActions, ChatState } from ".";
import { Conversation, Message } from "../../../models/chat";

export const initialState: ChatState = {
    conversations: [] as Conversation[],
    conversationHistory: [] as Message[]
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
);

