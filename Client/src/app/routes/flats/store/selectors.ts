import { createSelector } from "@ngrx/store";
import { AppState } from "../../../store";

export const selectFeature = (state: AppState) => state.flatState;

export const getFlatsSelector = createSelector(
    selectFeature, 
    (state) => state.flats
);