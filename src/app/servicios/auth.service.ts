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
  private userInfoSubject = new BehaviorSubject<Profile | null>(null);
  public userInfo$ = this.userInfoSubject.asObservable();

  constructor(protected http: HttpClient, protected cookie: CookieService) { }

  getToken(): string {
    return localStorage.getItem('access_token') ?? '';
  }

  getId(): string {
    console.log(this.cookie.get('id'))
    return this.cookie.get('id') ?? '';
  }
  getRol(): string {
    console.log(this.cookie.get('rol_id'))
    return this.cookie.get('rol_id') ?? '';
  }

  currentUser: Profile | null = null

  setCurrentUser(user: Profile): void {
    this.currentUser = user;
  }

  getCurrentUser(): Profile | null {
    return this.currentUser;
  }

  me(): Observable<User> {
    return this.http.post<User>(`${environment.api_url}/auth/me`, undefined)
  }




  meplus(): Observable<Profile> {
    return this.http.get<Profile>(`${environment.api_url}/auth/meplus`)
  }



  logout() {
    localStorage.removeItem('access_token')
    this.cookie.delete('rol_id', '/', 'localhost', false, 'Lax')
    this.cookie.delete('id', '/', 'localhost', false, 'Lax')
    this.cookie.deleteAll()
  }

}
