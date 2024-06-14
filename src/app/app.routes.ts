import { Routes } from '@angular/router';
import { authenticateGuard } from './guards/authenticate.guard';
import { ChartsComponent } from './charts/charts.component';
//Ya hay lazy load
// Ya hay un guard!
export const routes: Routes = 
[
    {path: '', loadComponent:() => import('./vistas/index/index.component').then(m=> m.IndexComponent)},
    //Rutas de usuario
    {path: 'activar', loadComponent:() => import('./vistas/activate/activate.component').then(m=> m.ActivateComponent)},
    {path: 'login', loadComponent:() => import('./vistas/login/login.component').then(m=> m.LoginComponent)},
    {path: 'dashboard', loadComponent:() => import('./vistas/dashboard/dashboard.component').then(m=> m.DashboardComponent), canActivate:[authenticateGuard]},
    {path: 'myProfile', loadComponent:() => import('./vistas/profile/profile.component').then(m=> m.ProfileComponent), canActivate:[authenticateGuard]},
    {path: 'usuarios', loadComponent:() => import('./vistas/usuarios/usuarios.component').then(m=> m.UsuariosComponent), canActivate:[authenticateGuard]},
    {path: 'usuarios/:id', loadComponent:() => import('./vistas/user-data/user-data.component').then(m=> m.UserDataComponent), canActivate:[authenticateGuard]},
    {path: 'newUser', loadComponent:() => import('./vistas/new-user/new-user.component').then(m=> m.NewUserComponent), canActivate:[authenticateGuard]},
    //Rutas de ideas
    {path: 'ideas', loadComponent:() => import('./vistas/ideas/ideas.component').then(m=> m.IdeasComponent), canActivate:[authenticateGuard]},
    {path:'ideas/:id',loadComponent:() => import('./vistas/idea-data/idea-data.component').then(m=> m.IdeaDataComponent), canActivate:[authenticateGuard]},
    {path:'idea/:id', loadComponent:() => import('./vistas/idea-data-g/idea-data-g.component').then(m=> m.IdeaDataGComponent), canActivate:[authenticateGuard]},
    {path: 'newIdea', loadComponent:() => import('./vistas/new-idea/new-idea.component').then(m=> m.NewIdeaComponent), canActivate:[authenticateGuard]},
    //Rutas de equipo
    {path: 'newIdea/add/:id', loadComponent:() => import('./vistas/equipo/equipo.component').then(m=> m.EquipoComponent), canActivate:[authenticateGuard]},
    //Rutas de productos
    {path:'productos', loadComponent:() => import('./vistas/productos/productos.component').then(m=> m.ProductosComponent), canActivate:[authenticateGuard]},
    {path: 'newProduct', loadComponent:() => import('./vistas/new-producto/new-producto.component').then(m=> m.NewProductoComponent), canActivate:[authenticateGuard]},
    {path: 'productos/:id', loadComponent:() => import('./vistas/producto-data/producto-data.component').then(m=> m.ProductoDataComponent), canActivate:[authenticateGuard]},
    {path: 'premios',loadComponent:() => import('./vistas/premios/premios.component').then(m=> m.PremiosComponent), canActivate:[authenticateGuard]},
    {path: 'premios/:id',loadComponent:() => import('./vistas/premio-data/premio-data.component').then(m=> m.PremioDataComponent), canActivate:[authenticateGuard]},
    //Actividades
    {path: 'newActivity/:id', loadComponent:() => import('./vistas/new-activity/new-activity.component').then(m=> m.NewActivityComponent), canActivate:[authenticateGuard]},
    {path: 'actividad/:id', loadComponent:() => import('./vistas/actividad-data/actividad-data.component').then(m=> m.ActividadDataComponent), canActivate:[authenticateGuard]},
    //reportes
    {path:'reportes',loadComponent:() => import('./vistas/reportes/reportes.component').then(m=> m.ReportesComponent), canActivate:[authenticateGuard]},
    //wildcard
    {path: '**', loadComponent:() => import('./vistas/not-found/not-found.component').then(m=> m.NotFoundComponent)},
];
