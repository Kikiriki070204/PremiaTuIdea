import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';
import { Usuarios } from '../interfaces/usuarios';
import { Productos } from '../interfaces/productos';
import { AreaId, NewUser, UserName, UsersList, User, NoLocation } from '../interfaces/user';
import { Areas, Departamentos, Locaciones, Roles } from '../interfaces/activar';
import { Canjear, EditarEstadoP, EditarProducto, EstadosPremios, Premios, Producto, ProductoData, ProductoId, UsuarioPremio, UsuarioPremio2 } from '../interfaces/producto';
import { Profile, UpdateUser } from '../interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(protected http: HttpClient) { }

  colaboradores(): Observable<Usuarios> {
    return this.http.get<Usuarios>(`${environment.api_url}/users/colaboradores`);
  }

  setetarContraseña(data: any): Observable<any> {
    return this.http.post(`${environment.api_url}/users/updatePasswordAdmin`, data);
  }

  //Aqui va la lista de usuarios con la consulta de nombres, por eso se usa la interfaz UsersList y no Usuarios
  allUsers(page: number = 1): Observable<UsersList> {
    return this.http.get<UsersList>(`${environment.api_url}/users/usuariosAll?page=${page}`);
  }

  updateUser(data: UpdateUser): Observable<User> {
    return this.http.put<User>(`${environment.api_url}/users/update`, data);
  }

  premiosDisponibles(page: number = 1): Observable<Productos> {
    return this.http.get<Productos>(`${environment.api_url}/productos/list?page=${page}`);
  }

  premiosDisponiblesAsc(page: number = 1): Observable<Productos> {
    return this.http.get<Productos>(`${environment.api_url}/productos/list/asc?page=${page}`);
  }

  premiosDisponiblesDsc(page: number = 1): Observable<Productos> {
    return this.http.get<Productos>(`${environment.api_url}/productos/list/dsc?page=${page}`);
  }
  usersByName(data: UserName): Observable<UsersList> {
    return this.http.post<UsersList>(`${environment.api_url}/users/nombre`, data);
  }

  newUser(data: any | NoLocation): Observable<User> {
    return this.http.post<User>(`${environment.api_url}/users/create`, data);
  }

  register(data: any | NoLocation): Observable<User> {
    return this.http.post<User>(`${environment.api_url}/auth/register`, data);
  }

  userData(id: any): Observable<Profile> {
    return this.http.get<Profile>(`${environment.api_url}/users/show/` + id);
  }


  allRoles(): Observable<Roles> {
    return this.http.get<Roles>(`${environment.api_url}/roles/list`);
  }

  allDeps(): Observable<Departamentos> {
    return this.http.get<Departamentos>(`${environment.api_url}/departamentos/list`);
  }

  allAreas(): Observable<Areas> {
    return this.http.get<Areas>(`${environment.api_url}/areas/list`);
  }

  locByArea(data: AreaId): Observable<Locaciones> {
    return this.http.post<Locaciones>(`${environment.api_url}/locaciones/area`, data);
  }

  //CANJEAR PUNTOS Y SERVICIOS DE PREMIOS
  canjearProducto(data: Canjear): Observable<UsuarioPremio> {
    return this.http.post<UsuarioPremio>(`${environment.api_url}/productos/canjear`, data)
  }

  premiosCanjeados(): Observable<Premios> {
    return this.http.get<Premios>(`${environment.api_url}/usuariopremios/list`)
  }

  premiosCanjeadosAdmin(page: number): Observable<Premios> {
    return this.http.get<Premios>(`${environment.api_url}/usuariopremios/list/admin?page=${page}`)
  }

  usuarioPremioData(id: any): Observable<UsuarioPremio2> {
    return this.http.get<UsuarioPremio2>(`${environment.api_url}/usuariopremios/show/` + id)
  }

  estadosPremios(): Observable<EstadosPremios> {
    return this.http.get<EstadosPremios>(`${environment.api_url}/estado/list`)
  }
  editarEstado(data: EditarEstadoP): Observable<UsuarioPremio> {
    return this.http.put<UsuarioPremio>(`${environment.api_url}/usuariopremios/update`, data);
  }

  productoData(id: any): Observable<ProductoData> {
    return this.http.get<ProductoData>(`${environment.api_url}/productos/show/` + id)
  }

  editarProducto(data: FormData): Observable<ProductoData> {
    return this.http.post<ProductoData>(`${environment.api_url}/productos/update`, data);
  }

}
