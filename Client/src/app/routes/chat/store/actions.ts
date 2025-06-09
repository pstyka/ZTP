import { createAction, props } from "@ngrx/store";
import { Message } from "../../../models/chat";

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