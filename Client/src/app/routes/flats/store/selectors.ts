import { createSelector } from "@ngrx/store";
import { AppState } from "../../../store";

export const selectFeature = (state: AppState) => state.flatState;

export const getFlatsSelector = createSelector(
    selectFeature, 
    (state) => state.flats
);

export const getFlatPhotosUrlsSelector = createSelector(
    selectFeature, 
    (state) => state.flatPhotosUrls
);

export const getFlatSelector = createSelector(
    selectFeature,
    (state) => state.flat
);

export const getFlatsByOwnerIdSelector = createSelector(
    selectFeature, 
    (state) => state.ownerFlats
);