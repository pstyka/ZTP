import { createAction, props } from "@ngrx/store";
import { Conversation, Message } from "../../../models/chat";

const prefix = '[Chat]';

export const sendMessage = createAction(
    `${prefix} Send Message`,
    props<{ message: Message }>()
);

export const sendMessageSuccess = createAction(
    `${prefix} Send Message Success`
);

export const sendMessageFailure = createAction(
    `${prefix} Send Message Failure`,
    props<{ error: string }>()
);

export const getConversations = createAction(
    `${prefix} Get Conversations`
);

export const getConversationsSuccess = createAction(
    `${prefix} Get Conversations Success`,
    props<{ conversetions: Conversation[] }>()
);

export const getConversationsFailure = createAction(
    `${prefix} Get Conversations Failure`,
    props<{ error: string }>()
);

export const getConversationHistory = createAction(
    `${prefix} Get Conversation History`,
    props<{ userId: string }>()
);

export const getConversationHistorySuccess = createAction(
    `${prefix} Get Conversation History Success`,
    props<{ conversationHistory: any }>()
);

export const getConversationHistoryFailure = createAction(
    `${prefix} Get Conversation History Failure`,
    props<{ error: string }>()
);