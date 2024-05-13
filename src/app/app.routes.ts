import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { ActivateComponent} from './activate/activate.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { IdeasComponent } from './ideas/ideas.component';

export const routes: Routes = 
[
    {path: '', component: IndexComponent},
    {path:'navbar', component: AppNavbarComponent},
    {path: 'activar', component: ActivateComponent},
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'myProfile', component: ProfileComponent},
    {path: 'misIdeas', component: IdeasComponent},
    {path: '**', component: NotFoundComponent}
];
