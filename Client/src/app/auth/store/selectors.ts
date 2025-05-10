import { AppState } from "../../store";

export const selectFeature = (state: AppState) => state.authState;

// export const getIsLoggedInSelector = createSelector(
//     selectFeature, 
//     (state) => state.isLoggedIn
// );

// export const getUsernameSelector = createSelector(
//     selectFeature, 
//     (state) => state.username
// );

// export const getUserIdSelector = createSelector(
//     selectFeature,
//     (state) => state.userId
// );

// export const getIsAdminSelector = createSelector(
//     selectFeature,
//     (state) => state.isAdmin
// )

// export const getLoggedUserClaimsSelector = createSelector(
//     selectFeature,
//     (state) => state.claims
// );

// export const getRolesIdsSelector = createSelector(
//     selectFeature,
//     (state) => state.rolesIds
// );

// export const getUserGroupsIdsSelector = createSelector(
//     selectFeature,
//     (state) => state.userGroupsIds
// );
