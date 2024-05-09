import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(protected http: HttpClient) { }

  getToken(): string {
    return localStorage.getItem('token') ?? '';
  }

  currentUser: User | null = null

  setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  me(): Observable<User> {
    return this.http.post<User>("http://10.214.226.103:8000/api/me", undefined)
  }

  logout()
  {
    localStorage.removeItem('token')
  }

}
