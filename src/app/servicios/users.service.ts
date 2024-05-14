import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(protected http: HttpClient) { }

  colaboradores(): Observable<[User]>{
    return this.http.get<[User]>(`${environment.api_url}/users/colaboradores`);
  }

  allUsers(){}
}
