import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipo } from '../interfaces/equipo';
import { UsuarioEquipo } from '../interfaces/usuario-equipo';
import { environment } from '../../enviroment/enviroment';
import { EquipoIdea } from '../interfaces/equipo-idea';
import { HttpParams } from '@angular/common/http';
import { RequestEquipo } from '../interfaces/request-equipo';
@Injectable({
  providedIn: 'root'
})
export class EquiposService {

  constructor(protected http: HttpClient) { }
  //equipos
  equipo(data: EquipoIdea): Observable<Equipo>
  { let params = new HttpParams().set('id_idea', data.id_idea);

  return this.http.get<Equipo>(`${environment.api_url}/equipos/equipoIdea`, { params });
  }

  //User_equipos
  agregar(data: RequestEquipo): Observable<UsuarioEquipo>{
    return this.http.post<UsuarioEquipo>(`${environment.api_url}/userteam/create`, data)
  }
}
