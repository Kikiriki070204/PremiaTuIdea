import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../enviroment/enviroment';
import { Usuarios } from '../interfaces/usuarios';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(protected http: HttpClient) { }

  colaboradores(): Observable<Usuarios>{
    return this.http.get<Usuarios>(`${environment.api_url}/users/colaboradores`);
  }

  allUsers(){}
}
