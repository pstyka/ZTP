import { Routes } from '@angular/router';
import { HomeComponent,  } from './routes/containers';
import { ForgotPasswordComponent, LoginComponent, RegisterComponent } from './auth';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'forgot-password', component: ForgotPasswordComponent},
];
