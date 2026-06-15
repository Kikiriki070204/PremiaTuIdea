import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';
import { CarruselResponse } from '../interfaces/carrusel';

@Injectable({ providedIn: 'root' })
export class CarruselService {

  constructor(private http: HttpClient) {}

  list(): Observable<CarruselResponse> {
    return this.http.get<CarruselResponse>(`${environment.api_url}/carrusel/list`);
  }

  adminList(): Observable<CarruselResponse> {
    return this.http.get<CarruselResponse>(`${environment.api_url}/carrusel/admin`);
  }

  imageUrl(id: number): string {
    return `${environment.api_url}/carrusel/image/${id}`;
  }

  upload(file: File): Observable<any> {
    const form = new FormData();
    form.append('imagen', file);
    return this.http.post(`${environment.api_url}/carrusel/store`, form);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.api_url}/carrusel/delete/${id}`);
  }
}
