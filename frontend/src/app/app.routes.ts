import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { UsersListComponent } from './admin-components/users-list/users-list.component';
import { RhListComponent } from './admin-components/rh-list/rh-list.component';
import { ProfilComponent } from './components/profil/profil.component';
import { AddRhComponent } from './admin-components/add-rh/add-rh.component';
import { UpdateJobComponent } from './components/update-job/update-job.component';
import { UpdateUserComponent } from './admin-components/update-user/update-user.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { PostulComponent } from './components/postul/postul.component';
import { RelevantCandidaturesComponent } from './components/relevant-candidatures/relevant-candidatures.component';
import { MyCandidaturesComponent } from './components/my-candidatures/my-candidatures.component';
import { AllCandidaturesComponent } from './components/all-candidatures/all-candidatures.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, 
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutUsComponent },
    { path: 'users-list', component: UsersListComponent },
    { path: 'rh-list', component: RhListComponent },
    { path: 'profile', component: ProfilComponent },
    { path: 'add-rh', component: AddRhComponent },
    { path: 'update-user/:id', component: UpdateUserComponent },
    { path: 'update-password', component: UpdatePasswordComponent },
    { path: 'update-job/:id', component: UpdateJobComponent },
    { path: 'postul-page/:id', component: PostulComponent },
    { path: 'candidatures/rh-candidatures/offer/:id/relevant', component: RelevantCandidaturesComponent },
    { path: 'candidatures/offer/:id', component: RelevantCandidaturesComponent },
    { path: 'my-candidatures', component: MyCandidaturesComponent },
    { path: 'all-candidatures', component: AllCandidaturesComponent },
    { path: 'dashboard', component: DashboardComponent }




  ];
