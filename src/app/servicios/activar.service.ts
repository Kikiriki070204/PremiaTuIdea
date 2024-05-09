import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { Activar } from '../interfaces/activar';

@Injectable({
  providedIn: 'root'
})
export class ActivarService {

  constructor(protected http: HttpClient) { }

  activar(data: Activar): Observable<User>{
    return this.http.put<User>('http://10.214.226.103:8000/api/password', data);
  }


}
