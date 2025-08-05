import { Component, OnInit } from '@angular/core';
import { Notificacion, NotificacionesService } from '../../servicios/notificaciones.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.css'
})
export class NotificacionesComponent implements OnInit {
  notificaciones: Notificacion[] = [];

  constructor(protected notiService: NotificacionesService) { }

  ngOnInit(): void {
    this.getNotificaciones();
  }

  getNotificaciones() {
    this.notiService.obtenerNotificaciones().subscribe({
      next: res => {
        this.notificaciones = res.notificaciones;

        if (this.notificaciones.length > 0) {
          this.notiService.marcarComoLeidas().subscribe();
        }
      },
      error: err => console.error('Error al cargar notificaciones', err)
    });
  }
}
