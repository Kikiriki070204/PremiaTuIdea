import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Idea } from '../interfaces/idea';
import { Ideas } from '../interfaces/ideas';
import { environment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class IdeasService {

  constructor(protected http: HttpClient, protected router: Router) { }

  allIdeas(): Observable<Ideas>{
    return this.http.get<Ideas>(`${environment.api_url}/ideas/list`);
  }

  ideasImp(){

  }

  idea(){

  }
}
