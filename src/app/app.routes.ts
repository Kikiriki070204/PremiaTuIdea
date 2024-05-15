import { Routes } from '@angular/router';
import { IndexComponent } from './vistas/index/index.component';
import { AppNavbarComponent } from './vistas/app-navbar/app-navbar.component';
import { ActivateComponent} from './vistas/activate/activate.component';
import { LoginComponent } from './vistas/login/login.component';
import { NotFoundComponent } from './vistas/not-found/not-found.component';
import { DashboardComponent } from './vistas/dashboard/dashboard.component';
import { ProfileComponent } from './vistas/profile/profile.component';
import { IdeasComponent } from './vistas/ideas/ideas.component';
import { NewIdeaComponent } from './vistas/new-idea/new-idea.component';
import { EquipoComponent } from './vistas/equipo/equipo.component';
import { PremiosComponent } from './vistas/premios/premios.component';

export const routes: Routes = 
[
    {path: '', component: IndexComponent},
    //Rutas de usuario
    {path: 'activar', component: ActivateComponent},
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'myProfile', component: ProfileComponent},
    //Rutas de ideas
    {path: 'misIdeas', component: IdeasComponent},
    {path: 'newIdea', component: NewIdeaComponent},
    //Rutas de equipo
    {path: 'newIdea/add/:id', component: EquipoComponent},
    {path: '**', component: NotFoundComponent},
    //Rutas de productos
    {path:'premios', component: PremiosComponent}
];
