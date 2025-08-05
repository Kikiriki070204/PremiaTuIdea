import { Routes } from '@angular/router';
import { authenticateGuard } from './guards/authenticate.guard';

import { ChartsComponent } from './charts/charts.component';
import { authAdminGuard } from './guards/admin.guard';
import { sesionActivaGuard } from './guards/sesionActiva.guard';
//Ya hay lazy load
// Ya hay un guard!
export const routes: Routes =
    [
        { path: '', loadComponent: () => import('./vistas/index/index.component').then(m => m.IndexComponent) },
        //Rutas de usuario
        //{ path: 'activar', loadComponent: () => import('./vistas/activate/activate.component').then(m => m.ActivateComponent) },
        { path: 'login', loadComponent: () => import('./vistas/login/login.component').then(m => m.LoginComponent), canActivate: [sesionActivaGuard] },
        { path: 'register', loadComponent: () => import('./vistas/register/register.component').then(m => m.RegisterComponent), canActivate: [sesionActivaGuard] },
        { path: 'dashboard', loadComponent: () => import('./vistas/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authenticateGuard] },
        { path: 'myProfile', loadComponent: () => import('./vistas/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authenticateGuard] },
        { path: 'usuarios', loadComponent: () => import('./vistas/usuarios/usuarios.component').then(m => m.UsuariosComponent), canActivate: [authenticateGuard] },
        { path: 'newUser', loadComponent: () => import('./vistas/dashboard-admin/usuarios-admin/new-user/new-user.component').then(m => m.NewUserComponent), canActivate: [authenticateGuard] },
        { path: 'notificaciones', loadComponent: () => import('./vistas/notificaciones/notificaciones.component').then(m => m.NotificacionesComponent), canActivate: [authenticateGuard] },
        //Rutas de ideas
        {
            path: 'ideas',
            loadComponent: () => import('./vistas/ideas/ideas.component').then(m => m.IdeasComponent),
            canActivate: [authenticateGuard],
            children: [
                { path: 'revision', loadComponent: () => import('./vistas/ideas/ideas-revision/ideas-revision.component').then(m => m.IdeasRevisionComponent) },
                { path: 'aceptadas', loadComponent: () => import('./vistas/ideas/ideas-aceptadas/ideas-aceptadas.component').then(m => m.IdeasAceptadasComponent) },
                { path: 'implementadas', loadComponent: () => import('./vistas/ideas/ideas-implementadas/ideas-implementadas.component').then(m => m.IdeasImplementadasComponent) },
                { path: 'rechazadas', loadComponent: () => import('./vistas/ideas/ideas-rechazadas/ideas-rechazadas.component').then(m => m.IdeasRechazadasComponent) }
            ]
        },
        { path: 'ideas/:id', loadComponent: () => import('./vistas/dashboard-admin/ideas-admin/idea-data/idea-data.component').then(m => m.IdeaDataComponent), canActivate: [authenticateGuard] },
        { path: 'idea/:id', loadComponent: () => import('./vistas/idea-data-g/idea-data-g.component').then(m => m.IdeaDataGComponent), canActivate: [authenticateGuard] },
        { path: 'newIdea/:id', loadComponent: () => import('./vistas/new-idea/new-idea.component').then(m => m.NewIdeaComponent), canActivate: [authenticateGuard] },
        { path: 'categoriaIdea', loadComponent: () => import('./vistas/categoria-idea/categoria-idea.component').then(m => m.CategoriaIdeaComponent), canActivate: [authenticateGuard] },
        //Rutas de equipo
        { path: 'newIdea/add/:id', loadComponent: () => import('./vistas/equipo/equipo.component').then(m => m.EquipoComponent), canActivate: [authenticateGuard] },
        //Rutas de productos
        { path: 'productos', loadComponent: () => import('./vistas/productos/productos.component').then(m => m.ProductosComponent), canActivate: [authenticateGuard] },
        { path: 'premios', loadComponent: () => import('./vistas/premios/premios.component').then(m => m.PremiosComponent), canActivate: [authenticateGuard] },
        //Actividades
        { path: 'newActivity/:id', loadComponent: () => import('./vistas/dashboard-admin/ideas-admin/new-activity/new-activity.component').then(m => m.NewActivityComponent), canActivate: [authenticateGuard] },
        { path: 'actividad/:id', loadComponent: () => import('./vistas/dashboard-admin/ideas-admin/actividad-data/actividad-data.component').then(m => m.ActividadDataComponent), canActivate: [authenticateGuard] },
        //reportes
        {
            path: 'reportes',
            loadComponent: () => import('./vistas/dashboard-admin/reportes/reportes.component').then(m => m.ReportesComponent),
            canActivate: [authenticateGuard],
            children: [
                { path: 'puntos', loadComponent: () => import('./vistas/dashboard-admin/reportes/reportes-puntos/reportes-puntos.component').then(m => m.ReportesPuntosComponent) },
                { path: 'ideas', loadComponent: () => import('./vistas/dashboard-admin/reportes/reportes-ideas/reportes-ideas.component').then(m => m.ReportesIdeasComponent) },
                { path: 'ahorro', loadComponent: () => import('./vistas/dashboard-admin/reportes/reportes-ahorro/reportes-ahorro.component').then(m => m.ReportesAhorroComponent) },
            ]
        },
        { path: 'chart', component: ChartsComponent },
        {
            path: 'terminos-condiciones',
            loadComponent: () => import('./vistas/terminos-condiciones/terminos-condiciones.component').then(m => m.TerminosCondicionesComponent),
            canActivate: [authenticateGuard]
        },

        // Dashboard Administrativo
        {
            path: 'admin',
            loadComponent: () => import('./vistas/dashboard-admin/dashboard-admin.component').then(m => m.DashboardAdminComponent),
            canActivate: [authAdminGuard],
            data: { hideNavbar: true },
            children: [
                {
                    path: '',
                    redirectTo: 'reportes-admin',
                    pathMatch: 'full'
                },
                // reportes
                {
                    path: 'reportes-admin', loadComponent: () => import('./vistas/dashboard-admin/reportes/reportes.component').then(m => m.ReportesComponent),
                    canActivate: [authAdminGuard],
                    data: { hideNavbar: true },
                    children: [

                        {
                            path: '',
                            redirectTo: 'puntos',
                            pathMatch: 'full'
                        },
                        {
                            path: 'puntos', loadComponent: () => import('./vistas/dashboard-admin/reportes/reportes-puntos/reportes-puntos.component').then(m => m.ReportesPuntosComponent),
                            data: { hideNavbar: true },
                            canActivate: [authAdminGuard],
                        },
                        {
                            path: 'bonos', loadComponent: () => import('./vistas/dashboard-admin/reportes/reportes-bonos/reportes-bonos.component').then(m => m.ReportesBonosComponent),
                            data: { hideNavbar: true },
                            canActivate: [authAdminGuard],
                        },
                        {
                            path: 'ideas', loadComponent: () => import('./vistas/dashboard-admin/reportes/reportes-ideas/reportes-ideas.component').then(m => m.ReportesIdeasComponent),
                            data: { hideNavbar: true },
                            canActivate: [authAdminGuard],
                        },
                        {
                            path: 'proyectos', loadComponent: () => import('./vistas/dashboard-admin/reportes/reportes-proyectos/reportes-proyectos.component').then(m => m.ReportesProyectosComponent),
                            data: { hideNavbar: true },
                            canActivate: [authAdminGuard],

                        },
                        {
                            path: 'ahorro', loadComponent: () => import('./vistas/dashboard-admin/reportes/reportes-ahorro/reportes-ahorro.component').then(m => m.ReportesAhorroComponent),
                            data: { hideNavbar: true },
                            canActivate: [authAdminGuard],
                        },
                        {
                            path: 'premios', loadComponent: () => import('./vistas/dashboard-admin/reportes/reportes-premios/reportes-premios.component').then(m => m.ReportesPremiosComponent),
                            data: { hideNavbar: true },
                            canActivate: [authAdminGuard],
                        },
                    ]
                },

                // ideas
                {
                    path: 'ideas-admin', loadComponent: () => import('./vistas/dashboard-admin/ideas-admin/ideas-admin.component').then(m => m.IdeasAdminComponent),
                    canActivate: [authAdminGuard],
                    data: { hideNavbar: true },
                    children: [
                        {
                            path: '',
                            redirectTo: 'revision',
                            pathMatch: 'full'
                        },
                        {
                            path: 'revision', loadComponent: () => import('./vistas/dashboard-admin/ideas-admin/ideas-revision-admin/ideas-revision-admin.component').then(m => m.IdeasRevisionAdminComponent),
                            data: { hideNavbar: true },
                            canActivate: [authAdminGuard],
                        },
                        {
                            path: 'aceptadas', loadComponent: () => import('./vistas/dashboard-admin/ideas-admin/ideas-aceptadas-admin/ideas-aceptadas-admin.component').then(m => m.IdeasAceptadasAdminComponent),
                            data: { hideNavbar: true },
                            canActivate: [authAdminGuard],
                        },
                        {
                            path: 'implementadas', loadComponent: () => import('./vistas/dashboard-admin/ideas-admin/ideas-implementadas-admin/ideas-implementadas-admin.component').then(m => m.IdeasImplementadasAdminComponent),
                            data: { hideNavbar: true },
                            canActivate: [authAdminGuard],
                        },
                        {
                            path: 'rechazadas', loadComponent: () => import('./vistas/dashboard-admin/ideas-admin/ideas-rechazadas-admin/ideas-rechazadas-admin.component').then(m => m.IdeasRechazadasAdminComponent),
                            data: { hideNavbar: true },
                            canActivate: [authAdminGuard],
                        },
                    ]
                },
                {
                    path: 'ideas/:id', loadComponent: () => import('./vistas/dashboard-admin/ideas-admin/idea-data/idea-data.component').then(m => m.IdeaDataComponent),
                    data: { hideNavbar: true },
                    canActivate: [authAdminGuard],
                },
                // ideas actividades
                {
                    path: 'nueva-actividad/:id', loadComponent: () => import('./vistas/dashboard-admin/ideas-admin/new-activity/new-activity.component').then(m => m.NewActivityComponent),
                    data: { hideNavbar: true },
                    canActivate: [authAdminGuard],
                },
                {
                    path: 'actividad/:id', loadComponent: () => import('./vistas/dashboard-admin/ideas-admin/actividad-data/actividad-data.component').then(m => m.ActividadDataComponent),
                    data: { hideNavbar: true },
                    canActivate: [authAdminGuard],
                },



                // premios
                {
                    path: 'premios-admin', loadComponent: () => import('./vistas/dashboard-admin/premios-admin/premios-admin.component').then(m => m.PremiosAdminComponent),
                    data: { hideNavbar: true },
                    canActivate: [authAdminGuard],

                },
                {
                    path: 'premios/:id', loadComponent: () => import('./vistas/dashboard-admin/premios-admin/premio-data/premio-data.component').then(m => m.PremioDataComponent),
                    data: { hideNavbar: true },
                    canActivate: [authAdminGuard],

                },

                // usuarios
                {
                    path: 'usuarios-admin', loadComponent: () => import('./vistas/dashboard-admin/usuarios-admin/usuarios-admin.component').then(m => m.UsuariosAdminComponent),
                    data: { hideNavbar: true },
                    canActivate: [authAdminGuard],
                },
                {
                    path: 'nuevo-usuario', loadComponent: () => import('./vistas/dashboard-admin/usuarios-admin/new-user/new-user.component').then(m => m.NewUserComponent),
                    data: { hideNavbar: true },
                    canActivate: [authenticateGuard]
                },
                {
                    path: 'usuario/:id', loadComponent: () => import('./vistas/dashboard-admin/usuarios-admin/user-data/user-data.component').then(m => m.UserDataComponent),
                    data: { hideNavbar: true },
                    canActivate: [authenticateGuard]
                },

                // productos 
                {
                    path: 'productos-admin', loadComponent: () => import('./vistas/dashboard-admin/productos-admin/productos-admin.component').then(m => m.ProductosAdminComponent),
                    data: { hideNavbar: true },
                    canActivate: [authAdminGuard],
                },
                {
                    path: 'productos/:id', loadComponent: () => import('./vistas/dashboard-admin/productos-admin/producto-data/producto-data.component').then(m => m.ProductoDataComponent),
                    data: { hideNavbar: true },
                    canActivate: [authAdminGuard],
                },
                {
                    path: 'nuevo-producto', loadComponent: () => import('./vistas/dashboard-admin/productos-admin/new-producto/new-producto.component').then(m => m.NewProductoComponent),
                    data: { hideNavbar: true },
                    canActivate: [authAdminGuard],
                },



                // bonos
                {
                    path: 'bonos-admin', loadComponent: () => import('./vistas/dashboard-admin/bonos-admin/bonos-admin.component').then(m => m.BonosAdminComponent),
                    data: { hideNavbar: true },
                    canActivate: [authAdminGuard],
                }
            ]
        },
        //wildcard
        {
            path: '**', loadComponent: () => import('./vistas/not-found/not-found.component').then(m => m.NotFoundComponent),
            data: { hideNavbar: true }
        },
    ];
