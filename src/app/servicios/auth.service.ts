import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { PRECONNECT_CHECK_BLOCKLIST } from '@angular/common';
import { environment } from '../../enviroment/enviroment';
import { Profile } from '../interfaces/profile';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(protected http: HttpClient, protected cookie: CookieService) { }

  getToken(): string {
    return localStorage.getItem('access_token') ?? '';
  }

  getId(): string{
    return this.cookie.get('rol_id') ?? '';
  }
  getRol(): string{
    return this.cookie.get('id') ?? '';
  }

  currentUser: User | null = null

  setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  me(): Observable<User> {
    return this.http.post<User>(`${environment.api_url}/auth/me`, undefined)
  }

  meplus(): Observable<Profile>{
    return this.http.get<Profile>(`${environment.api_url}/auth/meplus`)
  }

  logout()
  {
   localStorage.removeItem('access_token')
   this.cookie.delete('rol_id')
   this.cookie.delete('id')
  }

}
