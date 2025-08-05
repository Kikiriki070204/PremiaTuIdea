import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, interval, map, Observable, of, startWith, switchMap } from 'rxjs';
import { environment } from '../../enviroment/enviroment';

@Injectable({
    providedIn: 'root'
})
export class NotificacionesService {

    private hayNoLeidasSubject = new BehaviorSubject<boolean>(false);
    public hayNoLeidas$ = this.hayNoLeidasSubject.asObservable();

    constructor(private http: HttpClient) {
        interval(30000).pipe(
            startWith(0),
            switchMap(() => this.obtenerCantidadNoLeidas()),
            catchError(() => of(0))
        ).subscribe(count => this.hayNoLeidasSubject.next(count > 0));
    }


    obtenerNotificaciones(): Observable<{ notificaciones: Notificacion[] }> {
        return this.http.get<{ notificaciones: Notificacion[] }>(`${environment.api_url}/notificaciones`);
    }

    marcarComoLeidas(): Observable<{}> {
        return this.http.post<{}>(`${environment.api_url}/notificaciones/leidas`, {});
    }

    obtenerCantidadNoLeidas(): Observable<number> {
        return this.http.get<{ notificaciones: Notificacion[] }>(`${environment.api_url}/notificaciones`).pipe(
            map(response => response.notificaciones.length)
        );
    }

}

export interface Notificacion {
    id: number;
    mensaje: string;
    leida: boolean;
    created_at: string;
}
