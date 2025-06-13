import { createAction, props } from "@ngrx/store";
import { Flat, FlatFilters } from "../../../models/flat";

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

export const getSearchFlats = createAction(
    `${prefix} Get Search Flats`,
    props<{ filters: FlatFilters }>()
);

export const getSearchFlatsSuccess = createAction(
    `${prefix} Get Search Flats Success`,
    props<{ flats: Flat[] }>()
);

export const getSearchFlatsFailure = createAction(
    `${prefix} Get Search Flats Failure`,
    props<{ error: string }>()
);

export const getFlatPhotos = createAction(
    `${prefix} Get Flat Photos`,
    props<{ id: string }>()
);

export const getFlatPhotosSuccess = createAction(
    `${prefix} Get Flat Photos Success`,
    props<{ urls: string[] }>()
);

export const getFlatPhotosFailure = createAction(
    `${prefix} Get Flat Photos Failure`,
    props<{ error: string }>()
);

export const getFlat = createAction(
    `${prefix} Get Flat`,
    props<{ id: string }>()
);

export const getFlatSuccess = createAction(
    `${prefix} Get Flat Success`,
    props<{ flat: Flat }>()
);

export const getFlatFailure = createAction(
    `${prefix} Get Flats Failure`,
    props<{ error: string }>()
);

export const getFlatsByOwnerId = createAction(
    `${prefix} Get Flats By Owner Id`,
    props<{ ownerId: string }>()
);

export const getFlatsByOwnerIdSuccess = createAction(
    `${prefix} Get Flats By Owner Id Success`,
    props<{ flats: Flat[] }>()
);

export const getFlatsByOwnerIdFailure = createAction(
    `${prefix} Get Flats By Owner Id Failure`,
    props<{ error: string }>()
);

export const deleteFlat = createAction(
    `${prefix} Delete Flat`,
    props<{ id: string }>()
);

export const deleteFlatSuccess = createAction(
    `${prefix} Delete Flat Success`
);

export const deleteFlatFailure = createAction(
    `${prefix} Delete Flat Failure`,
    props<{ error: string }>()
);