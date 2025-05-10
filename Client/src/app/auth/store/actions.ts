import { createAction, props } from '@ngrx/store';
import { LoginDto } from '../../models/auth';

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
