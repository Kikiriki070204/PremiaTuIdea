import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../../app-navbar/app-navbar.component';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ReportesService } from '../../../servicios/reportes.service';
import { AhorroArea, AhorroTotal, FechasAhorros, FechasIdeas, FechasPuntos, Historial, IdeasCN, PuntosArea, ReportesIdeas2, ReportesPuntos, Top10User } from '../../../interfaces/reportes';
import { ReportesIdeas } from '../../../interfaces/reportes';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { IdeasService } from '../../../servicios/ideas.service';
import Swal from 'sweetalert2';
Chart.register(...registerables)

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, RouterOutlet, RouterModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {

  ////AUN QUEDA PENDIENTE LAS GRAFICAS DE IDEAS POR AREA Y AHORRO


  //CALENDARIO
  MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  DAYS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  showDatepicker: boolean = false;
  showDatepicker2: boolean = false;
  datepickerValue: any = '';
  datepickerValue2: any = '';
  month: any = '';
  year: any = '';
  no_of_days: any = [];
  blankdays: any = [];
  days: any = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

  date0: string | null = null
  date1: string | null = null


  //Ideas Contables y No contables


  //Puntos por Area
  puntos_non_data: PuntosArea[] | null = null
  puntos_cont_data: PuntosArea[] | null = null
  total_puntos_uncountable: number = 0
  total_puntos_countable: number = 0
  total_cont_puntos: number[] = []
  total_non_puntos: number[] = []
  puntos_areas_nombres_cont: string[] = []
  puntos_areas_nombres: string[] = []
  non_percentages_puntos: number[] = []
  percentages_puntos: number[] = []

  fecha_inicio: string | null = null
  fecha_fin: string | null = null
  //Top10
  top10: Top10User[] | null = null
  top10_data: Historial | null = null
  top10_nombres: string[] = []
  top10_users_points: number[] = []
  top10_max: number = 0

  // puntos contables y no contables (historicos)
  puntosCountableChart = Chart.getChart('puntosCountable')
  puntosUncountableChart = Chart.getChart('puntosUncountable')
  puntos_max: number = 0
  puntos_max_nocont: number = 0

  // ideas contables y no contables (historicos)
  ideasTotalesChart = Chart.getChart('ideasTotales')
  ideasContablesChart = Chart.getChart('countable')
  ideasNoContablesChart = Chart.getChart('ctx')
  areas_tot_nombres: string[] = []
  areas_tot_ideas: number[] = []
  areas_tot_data: IdeasCN[] | null = null
  tot_percentages: number[] = []
  areas_cont_nombres: string[] = []
  areas_cont_ideas: number[] = []
  areas_non_nombres: string[] = []
  areas_non_ideas: number[] = []
  accountable_percentages: number[] = []
  non_percentages: number[] = []
  areas_non_data: IdeasCN[] | null = null
  areas_cont_data: IdeasCN[] | null = null


  //Ahorros
  ahorrosChart = Chart.getChart('ahorro')
  ahorros: AhorroArea[] | null = null
  ahorros_data: AhorroTotal | null = null
  ahorros_nombres: string[] = []
  ahorros_totalByArea: number[] = []
  ahorros_percentages: number[] = []
  total_ahorros: number = 0

  pxt: number = 0
  ctx = document.getElementById('myChart');
  tab: number = 0

  valorCambio: number = 0;

  constructor(protected reporteService: ReportesService, private router: Router, protected reportesService: ReportesService) { }

  private initialized = false;

  ngOnInit(): void {

    if (!this.initialized) {
      this.initialized = true;
      this.cargarDatosIniciales();
    }

  }
  cargarDatosIniciales() {
    this.reportesService.tipoCambio().subscribe((valor) => {
      this.valorCambio = valor.valor
    });
  }

  actualizarTipoCambio() {
    const data = {
      valor: this.valorCambio
    };
    this.reportesService.actualizarTipoCambio(data).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Valor actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'bg-blue-800 text-white hover:bg-blue-900 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out',
          },
          buttonsStyling: false
        })
      }, error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el valor, ingresa datos válidos',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'bg-red-600 text-white hover:bg-red-700 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out',
          },
          buttonsStyling: false
        })
      }
    });
  }

  irPuntos() {
    this.router.navigateByUrl('admin/reportes-admin/puntos')
  }

}
