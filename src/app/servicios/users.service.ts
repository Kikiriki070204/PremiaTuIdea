import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';
import { Usuarios } from '../interfaces/usuarios';
import { Productos } from '../interfaces/productos';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(protected http: HttpClient) { }

  colaboradores(): Observable<Usuarios>{
    return this.http.get<Usuarios>(`${environment.api_url}/users/colaboradores`);
  }

  allUsers(){}

  premiosDisponibles(): Observable<Productos>{
    return this.http.get<Productos>(`${environment.api_url}/productos/list`);
  }
}
