import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Estado, EstadoIdeas, EstatusIdea, Idea, IdeaData, Puntos } from '../interfaces/idea';
import { Ideas } from '../interfaces/ideas';
import { environment } from '../../enviroment/enviroment';
import { NewIdea } from '../interfaces/new-idea';
import { HttpParams } from '@angular/common/http';
import { User } from '../interfaces/user';
import { Actividad, Actividades } from '../interfaces/actividad';

@Injectable({
  providedIn: 'root'
})
export class IdeasService{

  constructor(protected http: HttpClient, protected router: Router) { }

  allIdeas(): Observable<Ideas>{
    return this.http.get<Ideas>(`${environment.api_url}/ideas/userideasall`);
  }

  ideasImp(): Observable<Ideas>{
    return this.http.get<Ideas>(`${environment.api_url}/ideas/userIdeas`);
  }

  newIdea(data: NewIdea): Observable<Idea>{
    return this.http.post<Idea>(`${environment.api_url}/ideas/create`,data);
  }

  usersIdeas(): Observable<Ideas>{
    return this.http.get<Ideas>(`${environment.api_url}/ideas/ideasAll`)
  }

  ideasByStatus(estatus: number | null ): Observable<Ideas>{
    return this.http.get<Ideas>(`${environment.api_url}/ideas/ideasAll/`+ estatus)
  }

  ideaData(idea_id: any): Observable<IdeaData>
  {
  return this.http.get<IdeaData>(`${environment.api_url}/ideas/show/` + idea_id);
  }

  asignarPuntos(data: Puntos ): Observable<User>
  {
    return this.http.put<User>(`${environment.api_url}/ideas/puntos`, data);
  }

  estadoIdeas(): Observable<EstadoIdeas>{
    return this.http.get<EstadoIdeas>(`${environment.api_url}/estadoideas/list`);
  }

  editarEstado(data: Estado): Observable<Idea>
  {
    return this.http.put<Idea>(`${environment.api_url}/ideas/update`, data)
  }

  actividades(idea: any): Observable<Actividades>
  {
    return this.http.get<Actividades>(`${environment.api_url}/actividades/ideaActividades/`+ idea)
  }
}
