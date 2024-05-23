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
import { UserDataComponent } from './vistas/user-data/user-data.component';
import { NewUserComponent } from './vistas/new-user/new-user.component';
import { NewProductoComponent } from './vistas/new-producto/new-producto.component';
import { NewActivityComponent } from './vistas/new-activity/new-activity.component';
import { ActividadDataComponent } from './vistas/actividad-data/actividad-data.component';

//hay que hacer el lazy load PENDIENTE
//TAMBIEN FALTA CREAR UN GUARD
export const routes: Routes = 
[
    {path: '', component: IndexComponent},
    //Rutas de usuario
    {path: 'activar', component: ActivateComponent},
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'myProfile', component: ProfileComponent},
    {path: 'usuarios', component: UsuariosComponent},
    {path: 'usuarios/:id', component:UserDataComponent},
    {path: 'newUser', component:NewUserComponent},
    //Rutas de ideas
    {path: 'ideas', component: IdeasComponent},
    {path:'ideas/:id',component: IdeaDataComponent},
    {path: 'newIdea', component: NewIdeaComponent},
    //Rutas de equipo
    {path: 'newIdea/add/:id', component: EquipoComponent},
    //Rutas de productos
    {path:'premios', component: PremiosComponent},
    {path:'ejemplo', component:ExampleComponent},
    {path: 'newProduct', component: NewProductoComponent},
    //Actividades
    {path: 'newActivity/:id', component: NewActivityComponent},
    {path: 'actividad/:id', component: ActividadDataComponent},
    //wildcard
    {path: '**', component: NotFoundComponent},
];
