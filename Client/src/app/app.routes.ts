import { Routes } from '@angular/router';
import { ForgotPasswordComponent, LoginComponent, RegisterComponent } from './auth';
import { HomeComponent } from './routes/home/containers';
import { MyProfileComponent } from './routes/my-profile/containers';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'forgot-password', component: ForgotPasswordComponent},
    { path: 'my-profile', component: MyProfileComponent}
];
