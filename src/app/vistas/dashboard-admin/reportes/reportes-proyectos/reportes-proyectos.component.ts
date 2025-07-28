import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../../../servicios/reportes.service';
import { FormsModule } from '@angular/forms';
import { IdeasVsUsuarios, ParticipacionEmpleados } from '../../../../interfaces/reportes';

@Component({
  selector: 'app-reportes-proyectos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes-proyectos.component.html',
  styleUrl: './reportes-proyectos.component.css'
})
export class ReportesProyectosComponent implements OnInit {

  categorias: CategoriaCard[] = [];
  date0: string | null = null;
  date1: string | null = null;

  reporte?: ParticipacionEmpleados;

  reporteEmpleados?: IdeasVsUsuarios;



  constructor(private reportesService: ReportesService) { }

  ngOnInit(): void {
    this.getIdeasCategoriasHistoricas()
    this.filtrarParticipacion()
    this.filtrarIdeasVsUsuarios()

  }

  mostrarDatosFiltrados() {
    this.getIdeasCategoriasHistoricasFiltradas()
    this.filtrarParticipacion()
    this.filtrarIdeasVsUsuarios()
  }

  getIdeasCategoriasHistoricas() {
    this.reportesService.getIdeasPorCategoria().subscribe({
      next: ({ ideas_por_categoria }) => {
        this.categorias = ideas_por_categoria.map(cat => {
          const mapByName = (name: string) =>
            cat.estatus.find(e => e.nombre_estatus?.toLowerCase() === name.toLowerCase())?.total_por_estatus ?? 0;

          return {
            nombre: cat.nombre_categoria,
            revision: mapByName('Revision'),
            aceptadas: mapByName('Aceptada'),
            implementadas: mapByName('Implementada'),
            rechazadas: mapByName('Rechazada'),
            total: cat.total_ideas,
          };
        });
      },
      error: err => {

        console.error(err);
      }
    });
  }

  getIdeasCategoriasHistoricasFiltradas() {
    if (!this.date0 || !this.date1) {
      return;
    }


    this.categorias = [];

    this.reportesService.getIdeasPorCategoriaFechas(this.date0, this.date1)
      .subscribe({
        next: ({ ideas_por_categoria }) => {
          this.categorias = ideas_por_categoria.map((cat: any) => {
            const mapByName = (name: string) =>
              cat.estatus.find((e: any) => e.nombre_estatus?.toLowerCase() === name.toLowerCase())?.total_por_estatus ?? 0;

            return {
              nombre: cat.nombre_categoria,
              revision: mapByName('Revision'),
              aceptadas: mapByName('Aceptada'),
              implementadas: mapByName('Implementada'),
              rechazadas: mapByName('Rechazada'),
              total: cat.total_ideas,
            };
          });

        },
        error: err => {

          console.error(err);
        }
      });
  }

  filtrarParticipacion(): void {

    const body: any = {};
    if (this.date0 && this.date1) {
      body.fecha_inicio = this.date0;
      body.fecha_fin = this.date1;
    }

    this.reporte = undefined;

    this.reportesService.getParticipacionEmpleados(body)
      .subscribe({
        next: (data) => {
          this.reporte = data;
        },
        error: (err) => {
          console.error(err);

        }
      });
  }

  filtrarIdeasVsUsuarios(): void {
    const body: any = {};

    if (this.date0 && this.date1) {
      body.fecha_inicio = this.date0;
      body.fecha_fin = this.date1;
    }

    this.reporte = undefined;

    this.reportesService.getIdeasVsUsuarios(body).subscribe({
      next: (data) => {
        this.reporteEmpleados = data;
      },
      error: (err) => {

        console.error(err);
      }
    });
  }
}

interface CategoriaCard {
  nombre: string;
  revision: number;
  aceptadas: number;
  implementadas: number;
  rechazadas: number;
  total: number;
}