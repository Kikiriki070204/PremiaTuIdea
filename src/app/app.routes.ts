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
import { UsuariosComponent } from './vistas/usuarios/usuarios.component';
import { ExampleComponent } from './example/example.component';
import { IdeaDataComponent } from './vistas/idea-data/idea-data.component';

export const routes: Routes = 
[
    {path: '', component: IndexComponent},
    //Rutas de usuario
    {path: 'activar', component: ActivateComponent},
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'myProfile', component: ProfileComponent},
    {path: 'usuarios', component: UsuariosComponent},
    //Rutas de ideas
    {path: 'ideas', component: IdeasComponent},
    {path:'ideas/:id',component: IdeaDataComponent},
    {path: 'newIdea', component: NewIdeaComponent},
    //Rutas de equipo
    {path: 'newIdea/add/:id', component: EquipoComponent},
    //Rutas de productos
    {path:'premios', component: PremiosComponent},
    {path:'ejemplo', component:ExampleComponent},
    //wildcard
    {path: '**', component: NotFoundComponent},
];
