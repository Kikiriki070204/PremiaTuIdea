import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-reportes-proyectos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes-proyectos.component.html',
  styleUrl: './reportes-proyectos.component.css'
})
export class ReportesProyectosComponent {

  categorias = [
    { categoria: 'Ideas de mejora', revision: 2, aceptadas: 1, implementadas: 3, rechazadas: 0, total: 6 },
    { categoria: 'Lean workshops', revision: 2, aceptadas: 1, implementadas: 3, rechazadas: 0, total: 6 },
    { categoria: 'Cambio de nivel', revision: 2, aceptadas: 1, implementadas: 3, rechazadas: 0, total: 6 },
    { categoria: 'Scrap/CI', revision: 2, aceptadas: 1, implementadas: 3, rechazadas: 0, total: 6 },
    { categoria: 'OE', revision: 2, aceptadas: 1, implementadas: 3, rechazadas: 0, total: 6 },
    { categoria: 'Ahorro de energía', revision: 2, aceptadas: 1, implementadas: 3, rechazadas: 0, total: 6 },
  ]

}
