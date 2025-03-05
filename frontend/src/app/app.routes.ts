import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { UsersListComponent } from './admin-components/users-list/users-list.component';
import { RhListComponent } from './admin-components/rh-list/rh-list.component';
import { ProfilComponent } from './components/profil/profil.component';
import { AddRhComponent } from './admin-components/add-rh/add-rh.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, 
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutUsComponent },
    { path: 'users-list', component: UsersListComponent },
    { path: 'rh-list', component: RhListComponent },
    { path: 'profile', component: ProfilComponent },
    { path: 'add-rh', component: AddRhComponent }
  ];
