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
    props<{ token: string; }>()
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