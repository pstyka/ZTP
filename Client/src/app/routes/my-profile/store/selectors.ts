import { createSelector } from "@ngrx/store";
import { AppState } from "../../../store";

export const selectFeature = (state: AppState) => state.userState;

export const getUserSelector = createSelector(
    selectFeature, 
    (state) => state.user
);