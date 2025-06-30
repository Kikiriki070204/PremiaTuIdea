import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { PRECONNECT_CHECK_BLOCKLIST } from '@angular/common';
import { environment } from '../../enviroment/enviroment';
import { Profile } from '../interfaces/profile';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any | null = null;

  constructor(private http: HttpClient) {
    const userData = localStorage.getItem('user');
    if (userData) this.currentUser = JSON.parse(userData);
  }

  setUser(user: any, token: string) {
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', token);
  }

  getUser() {
    return this.currentUser;
  }

  getRoleId(): number | null {
    return this.currentUser?.rol_id || null;
  }

  meplus(): Observable<Profile> {
    return this.http.get<Profile>(`${environment.api_url}/auth/meplus`)
  }

  logout() {
    this.currentUser = null;
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
