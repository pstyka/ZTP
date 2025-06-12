import { createSelector } from "@ngrx/store";
import { AppState } from "../../store";

export const selectFeature = (state: AppState) => state.authState;

export const getIsLoggedInSelector = createSelector(
    selectFeature, 
    (state) => state.isLoggedIn
);

export const getTokenSelector = createSelector(
    selectFeature, 
    (state) => state.token
);

export const getUserIdSelector = createSelector(
    selectFeature, 
    (state) => state.userId
);
