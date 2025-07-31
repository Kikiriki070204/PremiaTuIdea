import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AhorroArea, AhorroTotal, AhorroTotalCategoria, AreaStats, CategoriaStats, FechasAhorros, FechasIdeas, FechasPuntos, Historial, IdeasVsUsuarios, ParticipacionEmpleados, ReportesIdeas, ReportesIdeas2, ReportesPuntos } from '../interfaces/reportes';
import { environment } from '../../enviroment/enviroment.prod';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(protected http: HttpClient, protected router: Router) { }

  // TIPO DE CAMBIO
  tipoCambio(): Observable<any> {
    return this.http.get<any>(`${environment.api_url}/ideass/tipoCambio`);
  }

  actualizarTipoCambio(data: any): Observable<any> {
    return this.http.put<any>(`${environment.api_url}/ideass/tipoCambio`, data);
  }

  // IDEAS CONTABLES Y NO CONTABLES (FILTRADOS)
  ideasTotales(fechas: FechasIdeas): Observable<ReportesIdeas2> {
    return this.http.post<ReportesIdeas2>(`${environment.api_url}/ideass/ideastotales`, fechas)
  }
  ideasContables(fechas: FechasIdeas): Observable<ReportesIdeas2> {
    return this.http.post<ReportesIdeas2>(`${environment.api_url}/ideass/ideascontables`, fechas)
  }
  ideasNoContables(fechas: FechasIdeas): Observable<ReportesIdeas> {
    return this.http.post<ReportesIdeas>(`${environment.api_url}/ideass/ideasnocontables`, fechas)
  }

  // IDEAS CONTABLES Y NO CONTABLES (HISTORICOS)
  ideasTotalesHistoricas(): Observable<ReportesIdeas2> {
    return this.http.get<ReportesIdeas2>(`${environment.api_url}/ideass/ideasTotalesHistoricas`)
  }
  ideasContablesHistoricas(): Observable<ReportesIdeas2> {
    return this.http.get<ReportesIdeas2>(`${environment.api_url}/ideass/ideasContablesHistoricas`)
  }
  ideasNoContablesHistoricas(): Observable<ReportesIdeas> {
    return this.http.get<ReportesIdeas>(`${environment.api_url}/ideass/ideasNoContablesHistoricas`)


  }

  getIdeasHistoricasEstatusArea(): Observable<AreaStats[]> {
    return this.http.get<AreaStats[]>(`${environment.api_url}/ideass/ideasHistoricasEstatusArea`);
  }

  getIdeasHistoricasEstatusAreaFechas(fecha_inicio: string, fecha_fin: string): Observable<any> {
    return this.http.post<any>(`${environment.api_url}/ideass/ideasHistoricasEstatusArea`, {
      fecha_inicio,
      fecha_fin
    });
  }

  getIdeasPorCategoria(): Observable<{ total_ideas: number; ideas_por_categoria: CategoriaStats[] }> {
    return this.http.get<{ total_ideas: number; ideas_por_categoria: CategoriaStats[] }>(
      `${environment.api_url}/ideass/ideasHistoricasEstatusCategoria`
    );
  }

  getIdeasPorCategoriaFechas(fecha_inicio: string, fecha_fin: string): Observable<any> {
    return this.http.post<any>(`${environment.api_url}/ideass/ideasHistoricasEstatusCategoria`, {
      fecha_inicio,
      fecha_fin
    });
  }

  // Reportaje de empleados

  getIdeasVsUsuarios(body: any = {}): Observable<IdeasVsUsuarios> {
    return this.http.post<IdeasVsUsuarios>(
      `${environment.api_url}/ideass/reporteTrimestral`,
      body
    );
  }

  getParticipacionEmpleados(body: any): Observable<ParticipacionEmpleados> {
    return this.http.post<ParticipacionEmpleados>(
      `${environment.api_url}/ideass/reporteMensual`, body
    );
  }

  // PUNTOS CONTABLES Y NO CONTABLES (FILTRADOS)
  puntosContables(fechas: FechasPuntos): Observable<ReportesPuntos> {
    return this.http.post<ReportesPuntos>(`${environment.api_url}/ideass/puntoscontables`, fechas)
  }

  puntosNoContables(fechas: FechasPuntos): Observable<ReportesPuntos> {
    return this.http.post<ReportesPuntos>(`${environment.api_url}/ideass/puntosnocontables`, fechas)
  }
  // PUNTOS CONTABLES Y NO CONTABLES (HISTORICOS)
  puntosContablesHistoricos(): Observable<ReportesPuntos> {
    return this.http.get<ReportesPuntos>(`${environment.api_url}/ideass/puntosContablesHistoricos`)
  }

  puntosNoContablesHistoricos(): Observable<ReportesPuntos> {
    return this.http.get<ReportesPuntos>(`${environment.api_url}/ideass/puntosNoContablesHistoricos`)
  }

  //TOP 10 FILTRADO
  top10(fechas: FechasPuntos): Observable<Historial> {
    return this.http.post<Historial>(`${environment.api_url}/historial/list`, fechas)
  }

  //TOP 10 HISTORICO

  top10historico(): Observable<Historial> {
    return this.http.get<Historial>(`${environment.api_url}/ideass/top10`)
  }
  //AHORRO TOTAL POR AREA
  ahorro(fechas: FechasAhorros): Observable<AhorroTotal> {
    return this.http.post<AhorroTotal>(`${environment.api_url}/ideass/ahorrocontable`, fechas)
  }

  ahorroHistorico(): Observable<AhorroTotal> {
    return this.http.get<AhorroTotal>(`${environment.api_url}/ideass/ahorroHistorico`)
  }

  ahorroHistoricoPorCategoria(): Observable<AhorroTotalCategoria> {
    return this.http.get<AhorroTotalCategoria>(`${environment.api_url}/ideass/ahorroHistoricoCategoria`)
  }

  ahorroHistoricoPorCategoriaFechas(fechas: FechasAhorros): Observable<AhorroTotalCategoria> {
    return this.http.post<AhorroTotalCategoria>(`${environment.api_url}/ideass/ahorroHistoricoCategoriaFechas`, fechas)
  }

  // PREMIOS
  getResumenPremios(): Observable<any> {
    return this.http.get<any>(`${environment.api_url}/estado/resumenPremios`)
  }

  getTopProductosEntregados(): Observable<any> {
    return this.http.get<any>(`${environment.api_url}/estado/top10ProductosEntregados`)
  }

  // BONOS

  getUsuariosBonos(fechaInicio?: string | null, fechaFin?: string | null): Observable<any> {

    const params: any = {};
    if (fechaInicio && fechaFin) {
      params.fecha_inicio = fechaInicio;
      params.fecha_fin = fechaFin;
    }


    return this.http.get<any>(`${environment.api_url}/usuariosBonos`, { params });
  }

}
