import { createAction } from "@ngrx/store";

const prefix = '[Chat]';

export const sendMessage = createAction(
    `${prefix} Send Message`,
);