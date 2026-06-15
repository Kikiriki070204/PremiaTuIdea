import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../enviroment/enviroment';
import { Profile } from '../interfaces/profile';

const SESSION_MS = 60 * 60 * 1000; // 1 hora

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any | null = null;
  private sessionTimer: any = null;

  constructor(private http: HttpClient, private router: Router) {
    const userData = localStorage.getItem('user');
    if (userData) this.currentUser = JSON.parse(userData);
    this.initSessionTimer();
  }

  private initSessionTimer(): void {
    const loginTime = localStorage.getItem('login_time');
    if (!loginTime || !localStorage.getItem('access_token')) return;

    const elapsed = Date.now() - parseInt(loginTime, 10);
    const remaining = SESSION_MS - elapsed;

    if (remaining <= 0) {
      this.logout();
      setTimeout(() => this.router.navigate(['/login']), 0);
    } else {
      this.scheduleLogout(remaining);
    }
  }

  private scheduleLogout(ms: number): void {
    if (this.sessionTimer) clearTimeout(this.sessionTimer);
    this.sessionTimer = setTimeout(() => {
      this.logout();
      this.router.navigate(['/login']);
    }, ms);
  }

  setUser(user: any, token: string): void {
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', token);
    localStorage.setItem('login_time', String(Date.now()));
    this.scheduleLogout(SESSION_MS);
  }

  getUser(): any {
    return this.currentUser;
  }

  getRoleId(): number | null {
    return this.currentUser?.rol_id || null;
  }

  meplus(): Observable<Profile> {
    return this.http.get<Profile>(`${environment.api_url}/auth/meplus`);
  }

  logout(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
    this.currentUser = null;
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  actualizarContraseña(data: any): Observable<any> {
    return this.http.post(`${environment.api_url}/users/updatePassword`, data);
  }
}
