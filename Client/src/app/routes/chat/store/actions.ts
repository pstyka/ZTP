import { createAction, props } from "@ngrx/store";
import { Conversation, Message } from "../../../models/chat";

const prefix = '[Chat]';

// export const sendMessage = createAction(
//     `${prefix} Send Message`,
//     props<{ message: Message }>()
// );

// export const sendMessageSuccess = createAction(
//     `${prefix} Send Message Success`
// );

// export const sendMessageFailure = createAction(
//     `${prefix} Send Message Failure`,
//     props<{ error: string }>()
// );

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