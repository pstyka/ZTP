import { Routes } from '@angular/router';
import { ForgotPasswordComponent, LoginComponent, RegisterComponent } from './auth';
import { HomeComponent } from './routes/home/containers';
import { MyProfileComponent } from './routes/my-profile/containers';
import { AddFlatComponent, EditFlatComponent, FlatPreviewComponent } from './routes/flats/containers';
import { ChatPageComponent } from './routes/chat/containers';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'forgot-password', component: ForgotPasswordComponent},
    { path: 'my-profile', component: MyProfileComponent},
    { path: 'flats/add', component: AddFlatComponent },
    { path: 'flats/preview/:id', component: FlatPreviewComponent },
    { path: 'flats/edit/:id', component: EditFlatComponent},
    { path: 'chat', component: ChatPageComponent},
];
