import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Idea } from '../interfaces/idea';
import { Ideas } from '../interfaces/ideas';
import { environment } from '../../enviroment/enviroment';
import { NewIdea } from '../interfaces/new-idea';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IdeasService{

  constructor(protected http: HttpClient, protected router: Router) { }

  allIdeas(): Observable<Ideas>{
    return this.http.get<Ideas>(`${environment.api_url}/ideas/list`);
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

  ideaData(idea_id: number): Observable<Idea>
  {
  return this.http.get<Idea>(`${environment.api_url}/equipos/` + idea_id);
  }
}
