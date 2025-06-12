import { createSelector } from "@ngrx/store";
import { AppState } from "../../../store";

export const selectFeature = (state: AppState) => state.chatState;

export const getConversationsSelector = createSelector(
    selectFeature, 
    (state) => state.conversations
);

export const getConversationHistorySelector = createSelector(
    selectFeature, 
    (state) => state.conversationHistory
);

// export const getFlatSelector = createSelector(
//     selectFeature,
//     (state) => state.flat
// );