import { createAction, props } from '@ngrx/store';
import { LoginDto } from '../../models/auth';
import { RegisterDto } from '../../models/auth/registerDto.model';

const prefix = '[Auth]';


export const login = createAction(
    `${prefix} Login`,
    props<{ login: LoginDto; }>()
);

export const loginSuccess = createAction(
    `${prefix} Login Success`,
    props<{ token: { access_token: string; token_type: string }; }>()
);

export const loginFailure = createAction(
    `${prefix} Login Failure`,
    props<{ error: string; }>()
);

export const register = createAction(
    `${prefix} Register`,
    props<{ register: RegisterDto }>()
);

export const registerSuccess = createAction(
    `${prefix} Register Success`
);

export const registerFailure = createAction(
    `${prefix} Register Failure`,
    props<{ error: string }>()
);

export const logout = createAction(
    `${prefix} Logout`
);

export const setToken = createAction(
    `${prefix} Set token`
);

export const setTokenSuccess = createAction(
    `${prefix} Set token Success`,
    props<{ token: { access_token: string; token_type: string } | null}>()
);

export const setTokenFailure = createAction(
    `${prefix} Set token Failure`,
    props<{ error: string }>()
);