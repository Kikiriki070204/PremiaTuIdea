import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../interfaces/login';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(protected http: HttpClient) { }

  login(data: Login): Observable<User>{
    return this.http.post<User>(`${environment.api_url}/auth/login`, data);
  }
}
