import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';

export interface TerminosImagen {
  id: number;
  url: string;
  orden: number;
}

export interface TerminosSeccion {
  bases_html: string | null;
  premiacion_html: string | null;
  imagenes: TerminosImagen[];
}

@Injectable({ providedIn: 'root' })
export class TerminosService {
  private base = `${environment.api_url}/terminos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<{ secciones: Record<string, TerminosSeccion> }> {
    return this.http.get<any>(this.base);
  }

  update(seccion: string, bases_html: string, premiacion_html: string): Observable<any> {
    return this.http.put(`${this.base}/${seccion}`, { bases_html, premiacion_html });
  }

  uploadImagen(seccion: string, file: File, orden?: number): Observable<TerminosImagen> {
    const fd = new FormData();
    fd.append('imagen', file);
    if (orden !== undefined) fd.append('orden', orden.toString());
    return this.http.post<TerminosImagen>(`${this.base}/${seccion}/imagen`, fd);
  }

  deleteImagen(id: number): Observable<any> {
    return this.http.delete(`${this.base}/imagen/${id}`);
  }
}
