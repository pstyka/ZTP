import { createAction, props } from "@ngrx/store";
import { User } from "../../../models/user";

const prefix = '[User]';

export const getMe = createAction(
    `${prefix} Get Me`
);

export const getMeSuccess = createAction(
    `${prefix} Get Me Success`,
    props<{ user: User }>()
);

export const getMeFailure = createAction(
    `${prefix} Get Me Failure`,
    props<{ error: string }>()
);