import { createAction, props } from "@ngrx/store";
import { Flat } from "../../../models/flat";

const prefix = '[Flat]';

export const addFlat = createAction(
    `${prefix} Add Flat`,
    props<{ flat: Flat }>()
);

export const addFlatSuccess = createAction(
    `${prefix} Add Flat Success`,
    props<{ id: string }>()
);

export const addFlatFailure = createAction(
    `${prefix} Add Flat Failure`,
    props<{ error: string }>()
);

export const addFlatPhotos = createAction(
    `${prefix} Add Flat Photos`,
    props<{ id: string, photos: File[] }>()
);

export const addFlatPhotosSuccess = createAction(
    `${prefix} Add Flat Photos Success`
);

export const addFlatPhotosFailure = createAction(
    `${prefix} Add Flat Failure`,
    props<{ error: string }>()
);

export const getFlats = createAction(
    `${prefix} Get Flats`
);

export const getFlatsSuccess = createAction(
    `${prefix} Get Flats Success`,
    props<{ flats: Flat[] }>()
);

export const getFlatsFailure = createAction(
    `${prefix} Get Flats Failure`,
    props<{ error: string }>()
);