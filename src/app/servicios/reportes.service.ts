import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ReportesIdeas } from '../interfaces/reportes';
import { environment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(protected http: HttpClient, protected router: Router) { }

  ideasContables(): Observable<ReportesIdeas>{
    return this.http.get<ReportesIdeas>(`${environment.api_url}/ideass/ideascontables`)
  }
  ideasNoContables(): Observable<ReportesIdeas>{
    return this.http.get<ReportesIdeas>(`${environment.api_url}/ideass/ideasnocontables`)
  }
  
}
