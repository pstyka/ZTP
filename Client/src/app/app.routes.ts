import { Routes } from '@angular/router';
import { ForgotPasswordComponent, HomeComponent, LoginComponent, RegisterComponent,  } from './routes/containers';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'forgot-password', component: ForgotPasswordComponent},
];
