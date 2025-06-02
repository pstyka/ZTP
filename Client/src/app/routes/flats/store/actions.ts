import { createAction, props } from "@ngrx/store";
import { Flat } from "../../../models/flat";

const prefix = '[Flat]';

export const addFlat = createAction(
    `${prefix} Add Flat`,
    props<{ flat: Flat }>()
);

export const addFlatSuccess = createAction(
    `${prefix} Add Flat Success`
);

export const addFlatFailure = createAction(
    `${prefix} Add Flat Failure`,
    props<{ error: string }>()
);