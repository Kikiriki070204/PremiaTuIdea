import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Historial, ReportesIdeas, ReportesPuntos } from '../interfaces/reportes';
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

  puntosContables(): Observable<ReportesPuntos>{
    return this.http.get<ReportesPuntos>(`${environment.api_url}/ideass/puntoscontalbes`)
  }

  puntosNoContables(): Observable<ReportesPuntos>{
    return this.http.get<ReportesPuntos>(`${environment.api_url}/ideass/ahorronocontable`)
  }

  top10(): Observable<Historial>{
    return this.http.get<Historial>(`${environment.api_url}/historial/list`)
  }
  //Falta ahorro, debo hacer la interfaz 
  
}
