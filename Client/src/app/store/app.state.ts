import { ActionReducerMap } from "@ngrx/store";
import { AuthReducer, AuthState } from "../auth/store";
import { UserReducer, UserState } from "../routes/my-profile/store";

export interface AppState {
  authState: AuthState;
  userState: UserState;
}

export const rootReducer: ActionReducerMap<AppState> = {
    authState: AuthReducer.reducer,
    userState: UserReducer.reducer,
}