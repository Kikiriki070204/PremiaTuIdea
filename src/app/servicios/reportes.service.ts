import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AhorroArea, AhorroTotal, FechasAhorros, FechasIdeas, FechasPuntos, Historial, ReportesIdeas, ReportesIdeas2, ReportesPuntos } from '../interfaces/reportes';
import { environment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(protected http: HttpClient, protected router: Router) { }

  ideasContables(fechas: FechasIdeas): Observable<ReportesIdeas2>{
    return this.http.post<ReportesIdeas2>(`${environment.api_url}/ideass/ideascontables`, fechas)
  }
  ideasNoContables(fechas: FechasIdeas): Observable<ReportesIdeas>{
    return this.http.post<ReportesIdeas>(`${environment.api_url}/ideass/ideasnocontables`, fechas)
  }

  puntosContables(fechas: FechasPuntos): Observable<ReportesPuntos>{
    return this.http.post<ReportesPuntos>(`${environment.api_url}/ideass/puntoscontables`, fechas)
  }

  puntosNoContables(fechas: FechasPuntos): Observable<ReportesPuntos>{
    return this.http.post<ReportesPuntos>(`${environment.api_url}/ideass/ahorronocontable`, fechas)
  }

  top10(fechas: FechasPuntos): Observable<Historial>{
    return this.http.post<Historial>(`${environment.api_url}/historial/list`, fechas)
  }
  //Falta ahorro, debo hacer la interfaz 
  ahorro(fechas: FechasAhorros): Observable<AhorroTotal>{
    return this.http.post<AhorroTotal>(`${environment.api_url}/ideass/ahorrocontable`, fechas)
  }
  
}
