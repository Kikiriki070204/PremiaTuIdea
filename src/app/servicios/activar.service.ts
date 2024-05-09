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
    return this.http.put<User>('http://127.0.0.1:8000/api/auth/register', data);
    //checa si jala bien con el post, si no hay q cambiar en api y aqui a put
  }


}
