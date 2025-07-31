import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http: HttpClient) { }

  getImagenProducto(id: number): Observable<Blob> {
    return this.http.get(`${environment.api_url}/productos/images/${id}`, {
      responseType: 'blob'
    });
  }

  getImageUrl(ruta: string): string {
    return `${environment.api_url_images}/storage/` + ruta.replace('public/', '')
  }

}
