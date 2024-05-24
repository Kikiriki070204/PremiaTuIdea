import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';
import { Usuarios } from '../interfaces/usuarios';
import { Productos } from '../interfaces/productos';
import { AreaId, NewUser, UserName, UsersList, User, NoLocation } from '../interfaces/user';
import { Areas, Departamentos, Locaciones, Roles } from '../interfaces/activar';
import { Canjear, EditarEstadoP, EstadosPremios, Premios, ProductoId, UsuarioPremio, UsuarioPremio2 } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(protected http: HttpClient) { }

  colaboradores(): Observable<Usuarios>{
    return this.http.get<Usuarios>(`${environment.api_url}/users/colaboradores`);
  }

  //Aqui va la lista de usuarios con la consulta de nombres, por eso se usa la interfaz UsersList y no Usuarios
  allUsers(): Observable<UsersList>{
    return this.http.get<UsersList>(`${environment.api_url}/users/colaboradores`);
  }

  premiosDisponibles(): Observable<Productos>{
    return this.http.get<Productos>(`${environment.api_url}/productos/list`);
  }
  usersByName(data: UserName): Observable<UsersList>{
    return this.http.post<UsersList>(`${environment.api_url}/users/nombre`,data);
  }

  newUsert(data: NewUser | NoLocation): Observable<User>{
    return this.http.post<User>(`${environment.api_url}/users/create`,data);
  }


  allRoles(): Observable<Roles>{
    return this.http.get<Roles>(`${environment.api_url}/roles/list`);
  }

  allDeps(): Observable<Departamentos>{
    return this.http.get<Departamentos>(`${environment.api_url}/departamentos/list`);
  }

  allAreas(): Observable<Areas>{
    return this.http.get<Areas>(`${environment.api_url}/areas/list`);
  }

  locByArea(data: AreaId): Observable<Locaciones>{
    return this.http.post<Locaciones>(`${environment.api_url}/locaciones/area`, data);
  }

  //CANJEAR PUNTOS Y SERVICIOS DE PREMIOS
  canjearProducto(data: Canjear): Observable<UsuarioPremio>{
    return this.http.post<UsuarioPremio>(`${environment.api_url}/productos/canjear`, data)
  }

  premiosCanjeados(): Observable<Premios>{
    return this.http.get<Premios>(`${environment.api_url}/usuariopremios/list`)
  }

  usuarioPremioData(id: any): Observable<UsuarioPremio2>{
    return this.http.get<UsuarioPremio2>(`${environment.api_url}/usuariopremios/show/`+ id)
  }

  estadosPremios(): Observable<EstadosPremios>{
    return this.http.get<EstadosPremios>(`${environment.api_url}/estado/list`)
  }
  editarEstado(data: EditarEstadoP): Observable<UsuarioPremio>
  {
    return this.http.put<UsuarioPremio>(`${environment.api_url}/usuariopremios/update`,data);
  }
}
