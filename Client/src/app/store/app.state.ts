import { ActionReducerMap } from "@ngrx/store";
import { AuthReducer, AuthState } from "../auth/store";

export interface AppState {
  authState: AuthState;
}

export const rootReducer: ActionReducerMap<AppState> = {
    authState: AuthReducer.reducer,
}