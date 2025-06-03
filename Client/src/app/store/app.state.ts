import { ActionReducerMap } from "@ngrx/store";
import { AuthReducer, AuthState } from "../auth/store";
import { UserReducer, UserState } from "../routes/my-profile/store";
import { FlatReducer, FlatState } from "../routes/flats/store";

export interface AppState {
  authState: AuthState;
  userState: UserState;
  flatState: FlatState;
}

export const rootReducer: ActionReducerMap<AppState> = {
    authState: AuthReducer.reducer,
    userState: UserReducer.reducer,
    flatState: FlatReducer.reducer,
}