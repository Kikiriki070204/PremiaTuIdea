import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Campos, EditColabs, Estado, EstadoIdeas, EstatusIdea, Idea, IdeaData, Msg, Puntos } from '../interfaces/idea';
import { Ideas, Imagen } from '../interfaces/ideas';
import { environment } from '../../enviroment/enviroment';
import { NewIdea } from '../interfaces/new-idea';
import { HttpParams } from '@angular/common/http';
import { User } from '../interfaces/user';
import { Actividad, ActividadIdea, Actividades, ActivityData, EditEstado, EditEstado2, EstadoAct, EstadoActividades, newActivity } from '../interfaces/actividad';
import { AreaStats } from '../interfaces/reportes';

@Injectable({
  providedIn: 'root'
})
export class IdeasService {

  constructor(protected http: HttpClient, protected router: Router) { }

  allIdeas(estatus: number | null, page: number = 1): Observable<Ideas> {
    return this.http.get<Ideas>(`${environment.api_url}/ideass/userideasall/` + estatus + `?page=${page}`);
  }


  ideasImp(): Observable<Ideas> {
    return this.http.get<Ideas>(`${environment.api_url}/ideass/userIdeas`);
  }

  ideasImpByUser(id: any): Observable<Ideas> {
    return this.http.get<Ideas>(`${environment.api_url}/ideass/userIdeasImplementadas/` + id);
  }

  newIdea(data: FormData): Observable<Idea> {
    return this.http.post<Idea>(`${environment.api_url}/ideass/create`, data);
  }

  usersIdeas(): Observable<Ideas> {
    return this.http.get<Ideas>(`${environment.api_url}/ideass/ideasAll`)
  }

  ideasByStatus(estatus: number | null, page: number = 1): Observable<Ideas> {
    return this.http.get<Ideas>(`${environment.api_url}/ideass/ideasAll/` + estatus + `?page=${page}`)
  }

  ideasByStatusAndCategory(
    estatus: number | null,
    categoria: number | null,
    page: number = 1,
    area_id?: number | null
  ): Observable<Ideas> {
    let url = `${environment.api_url}/ideass/ideasAllCategoria/${estatus}/${categoria}?page=${page}`;

    if (area_id !== null && area_id !== undefined) {
      url += `&area_id=${area_id}`;
    }

    return this.http.get<Ideas>(url);
  }



  // imageByIdea(idea: number | null): Observable<any>{
  //   return this.http.get<any>(`${environment.api_url}/ideas/images/`+idea,{ responseType: 'blob' })
  // }

  getImage(idea: any): Observable<any> {
    return this.http.get(`${environment.api_url}` + '/ideass/images/' + idea, { responseType: 'blob' });
  }

  ideaData(idea_id: any): Observable<IdeaData> {
    return this.http.get<IdeaData>(`${environment.api_url}/ideass/show/` + idea_id);
  }

  asignarPuntos(data: Puntos): Observable<User> {
    return this.http.put<User>(`${environment.api_url}/ideass/puntos`, data);
  }

  asignarBonos(data: any): Observable<User> {
    return this.http.put<User>(`${environment.api_url}/ideass/bonos`, data);
  }

  estadoIdeas(): Observable<EstadoIdeas> {
    return this.http.get<EstadoIdeas>(`${environment.api_url}/estadoideas/list`);
  }

  deleteIdea(idea: any): Observable<any> {
    return this.http.delete(`${environment.api_url}` + '/ideass/delete/' + idea);
  }

  editarEstado(data: Estado): Observable<Idea> {
    return this.http.put<Idea>(`${environment.api_url}/ideass/update`, data)
  }

  campos(num: any): Observable<Campos> {
    return this.http.get<Campos>(`${environment.api_url}/campos/monetario/` + num)
  }


  editarColaboradores(data: EditColabs): Observable<Msg> {
    return this.http.post<Msg>(`${environment.api_url}/userteam/create`, data);
  }

  //SERVICIOS DE ACTIVIDADES
  actividades(idea: any): Observable<Actividades> {
    return this.http.get<Actividades>(`${environment.api_url}/actividades/ideaActividades/` + idea)
  }

  newActivity(data: newActivity): Observable<Actividad> {
    return this.http.post<Actividad>(`${environment.api_url}/actividades/create`, data);
  }

  actividadData(id_actividad: any): Observable<ActivityData> {
    return this.http.get<ActivityData>(`${environment.api_url}/actividades/show/` + id_actividad)
  }

  getEstadoAct(): Observable<EstadoActividades> {
    return this.http.get<EstadoActividades>(`${environment.api_url}/estadoactividades/list`)
  }

  editarEstadoAct(data: EditEstado | EditEstado2): Observable<Actividad> {
    return this.http.put<Actividad>(`${environment.api_url}/actividades/update`, data)
  }

}
