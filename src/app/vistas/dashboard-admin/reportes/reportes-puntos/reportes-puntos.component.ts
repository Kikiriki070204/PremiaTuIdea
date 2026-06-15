import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AhorroArea, AhorroTotal, FechasAhorros, FechasIdeas, FechasPuntos, Historial, IdeasCN, PuntosArea, ReportesIdeas2, ReportesPuntos, Top10User } from '../../../../interfaces/reportes';
import { Chart, registerables } from 'chart.js';
import { ReportesService } from '../../../../servicios/reportes.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

Chart.register(...registerables)


@Component({
  selector: 'app-reportes-puntos',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './reportes-puntos.component.html',
  styleUrl: './reportes-puntos.component.css'
})
export class ReportesPuntosComponent implements OnInit {


  // Calendario
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

  // Puntos por Area
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
  puntosCountableChart = Chart.getChart('puntosContables')
  puntosUncountableChart = Chart.getChart('puntosNoContables')
  puntos_max: number = 0
  puntos_max_nocont: number = 0

  pxt: number = 0

  constructor(protected reporteService: ReportesService, private router: Router) { }

  ngOnInit(): void {
    this.renderTop10Historicos()
    this.renderPuntosContablesHistoricos()
    this.renderPuntosNoContablesHistoricos()
  }

  goBack() {
    this.router.navigate(["/admin/reportes-admin"]);
  }

  mostrarDatosPorFechas() {
    this.cleanCharts()
    this.renderTop10Filtrados()
    this.renderPuntosContablesFiltrados()
    this.renderPuntosNoContablesFiltrados()
  }

  mostrarDatosHistoricos() {
    this.cleanCharts()
    this.renderTop10Historicos()
    this.renderPuntosContablesHistoricos()
    this.renderPuntosNoContablesHistoricos()
  }

  cleanCharts() {
    const existingChartHistorial = Chart.getChart('top10');
    if (existingChartHistorial) {
      existingChartHistorial.destroy();
      this.top10 = null
      this.top10_data = null
      this.top10_nombres = []
      this.top10_users_points = []
      this.top10_max = 0

    }
    const existingChartPuntosAc = Chart.getChart('puntosContables');
    if (existingChartPuntosAc) {
      existingChartPuntosAc.destroy();
      this.puntos_cont_data = null
      this.total_puntos_countable = 0
      this.total_cont_puntos = []
      this.puntos_areas_nombres_cont = []
      this.percentages_puntos = []

    }
    const existingChartPuntosUn = Chart.getChart('puntosNoContables');
    if (existingChartPuntosUn) {
      existingChartPuntosUn.destroy();
      this.puntos_non_data = null
      this.total_puntos_uncountable = 0
      this.total_non_puntos = []
      this.puntos_areas_nombres = []
      this.non_percentages_puntos = []
    }
  }

  // Fuente de información Top10

  async top10Historico() {
    let self = this
    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.top10historico().subscribe({
          next: (value: Historial) => {
            self.top10_data = value
            value.historial.forEach(
              user => {
                self.top10_nombres.push(user.nombre)
                self.top10_users_points.push(user.total_puntos)
              })
            const PuntosMax = Math.max(...this.top10_users_points)
            this.top10_max = PuntosMax
            console.log(this.top10_users_points)
            resolve();
          },
          error: (error) => reject(error)
        });
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async top10Filtrado() {
    let self = this
    console.log(this.date0);
    console.log(this.date1);
    let fechas: FechasPuntos = {
      fecha_inicio: this.date0 ?? '',
      fecha_fin: this.date1 ?? ''
    }
    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.top10(fechas).subscribe({
          next: (value: Historial) => {
            self.top10_data = value
            value.historial.forEach(
              user => {
                self.top10_nombres.push(user.nombre)
                self.top10_users_points.push(user.total_puntos)
              })
            const PuntosMax = Math.max(...this.top10_users_points)
            this.top10_max = PuntosMax
            console.log(this.top10_users_points)
            resolve();
          },
          error: (error) => reject(error)
        });
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async puntosContablesHistoricos() {
    let self = this
    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.puntosContablesHistoricos().subscribe({
          next: (value: ReportesPuntos) => {

            self.puntos_cont_data = value.msg.puntos_por_area
            self.puntos_max = value.msg.total_puntos
            self.total_puntos_countable = value.msg.total_puntos
            value.msg.puntos_por_area.forEach(
              area => {
                self.puntos_areas_nombres_cont.push(area.nombre_area + " (" + area.total_puntos + " puntos)")
                self.total_cont_puntos.push(area.total_puntos)
              }
            )
            this.total_cont_puntos.forEach(value => {
              self.pxt = (value * 100) / this.total_puntos_countable
              self.percentages_puntos.push(this.pxt)
            });
            resolve();
          },
          error: (error) => reject(error)
        });
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async puntosContablesFiltrados() {
    let self = this
    let fechas: FechasPuntos = {
      fecha_inicio: this.date0 ?? '',
      fecha_fin: this.date1 ?? ''
    }
    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.puntosContables(fechas).subscribe({
          next: (value: ReportesPuntos) => {

            self.puntos_cont_data = value.msg.puntos_por_area
            self.total_puntos_countable = value.msg.total_puntos
            value.msg.puntos_por_area.forEach(
              area => {
                self.puntos_areas_nombres_cont.push(area.nombre_area + " (" + area.total_puntos + " puntos)")
                self.total_cont_puntos.push(area.total_puntos)
              }
            )
            this.total_cont_puntos.forEach(value => {
              self.pxt = (value * 100) / this.total_puntos_countable
              self.percentages_puntos.push(this.pxt)
            });
            resolve();
          },
          error: (error) => reject(error)
        });
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async puntosNoContablesHistoricos() {
    let self = this
    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.puntosNoContablesHistoricos().subscribe({
          next: (value: ReportesPuntos) => {

            self.puntos_non_data = value.msg.puntos_por_area
            self.total_puntos_uncountable = value.msg.total_puntos
            value.msg.puntos_por_area.forEach(
              area => {
                self.puntos_areas_nombres.push(area.nombre_area + " (" + area.total_puntos + " puntos)")
                self.total_non_puntos.push(area.total_puntos)
              }
            )
            this.total_non_puntos.forEach(value => {
              self.pxt = (value * 100) / this.total_puntos_uncountable
              self.non_percentages_puntos.push(this.pxt)
            });
            resolve();
          },
          error: (error) => reject(error)
        });
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async puntosNoContablesFiltrados() {
    let self = this
    let fechas: FechasPuntos = {
      fecha_inicio: this.date0 ?? '',
      fecha_fin: this.date1 ?? ''
    }
    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.puntosNoContables(fechas).subscribe({
          next: (value: ReportesPuntos) => {

            self.puntos_non_data = value.msg.puntos_por_area
            console.log(self.puntos_non_data)
            self.total_puntos_uncountable = value.msg.total_puntos
            value.msg.puntos_por_area.forEach(
              area => {
                self.puntos_areas_nombres.push(area.nombre_area + " (" + area.total_puntos + " puntos)")
                self.total_non_puntos.push(area.total_puntos)
              }
            )
            this.total_non_puntos.forEach(value => {
              self.pxt = (value * 100) / this.total_puntos_uncountable
              self.non_percentages_puntos.push(this.pxt)
            });
            resolve();
          },
          error: (error) => reject(error)
        });
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Renders Filtrados
  async renderTop10Filtrados() {
    await this.top10Filtrado()
    const myChart = new Chart("top10", {
      type: 'bar',
      data: {
        labels: this.top10_nombres,
        datasets: [{
          label: '# of assigned points',
          data: this.top10_users_points,
          backgroundColor: [
            'rgba(59,130,246,0.85)','rgba(239,68,68,0.85)','rgba(16,185,129,0.85)',
            'rgba(245,158,11,0.85)','rgba(168,85,247,0.85)','rgba(20,184,166,0.85)',
            'rgba(249,115,22,0.85)','rgba(236,72,153,0.85)','rgba(132,204,22,0.85)',
            'rgba(99,102,241,0.85)',
          ],
          borderColor: [
            'rgba(59,130,246,1)','rgba(239,68,68,1)','rgba(16,185,129,1)',
            'rgba(245,158,11,1)','rgba(168,85,247,1)','rgba(20,184,166,1)',
            'rgba(249,115,22,1)','rgba(236,72,153,1)','rgba(132,204,22,1)',
            'rgba(99,102,241,1)',
          ],
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          y: { grid: { display: false } }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  async renderPuntosContablesFiltrados() {
    await this.puntosContablesFiltrados()

    const myChart = new Chart("puntosContables", {
      type: 'bar',
      data: {
        labels: this.puntos_areas_nombres_cont,
        datasets: [{
          label: '% of Ideas',
          data: this.percentages_puntos,
          backgroundColor: [
            'rgba(59,130,246,0.85)','rgba(239,68,68,0.85)','rgba(16,185,129,0.85)',
            'rgba(245,158,11,0.85)','rgba(168,85,247,0.85)','rgba(20,184,166,0.85)',
            'rgba(249,115,22,0.85)','rgba(236,72,153,0.85)','rgba(132,204,22,0.85)',
            'rgba(99,102,241,0.85)',
          ],
          borderColor: [
            'rgba(59,130,246,1)','rgba(239,68,68,1)','rgba(16,185,129,1)',
            'rgba(245,158,11,1)','rgba(168,85,247,1)','rgba(20,184,166,1)',
            'rgba(249,115,22,1)','rgba(236,72,153,1)','rgba(132,204,22,1)',
            'rgba(99,102,241,1)',
          ],
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true, min: 0, max: 100,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { callback: (v: any) => v + '%' }
          },
          x: { grid: { display: false } }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx: any) => ` ${(ctx.raw as number).toFixed(1)}%` } }
        }
      }
    });
  }

  async renderPuntosNoContablesFiltrados() {
    await this.puntosNoContablesFiltrados()

    const myChart = new Chart("puntosNoContables", {
      type: 'bar',
      data: {
        labels: this.puntos_areas_nombres,
        datasets: [{
          label: '% of Ideas',
          data: this.non_percentages_puntos,
          backgroundColor: [
            'rgba(59,130,246,0.85)','rgba(239,68,68,0.85)','rgba(16,185,129,0.85)',
            'rgba(245,158,11,0.85)','rgba(168,85,247,0.85)','rgba(20,184,166,0.85)',
            'rgba(249,115,22,0.85)','rgba(236,72,153,0.85)','rgba(132,204,22,0.85)',
            'rgba(99,102,241,0.85)',
          ],
          borderColor: [
            'rgba(59,130,246,1)','rgba(239,68,68,1)','rgba(16,185,129,1)',
            'rgba(245,158,11,1)','rgba(168,85,247,1)','rgba(20,184,166,1)',
            'rgba(249,115,22,1)','rgba(236,72,153,1)','rgba(132,204,22,1)',
            'rgba(99,102,241,1)',
          ],
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true, min: 0, max: 100,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { callback: (v: any) => v + '%' }
          },
          x: { grid: { display: false } }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx: any) => ` ${(ctx.raw as number).toFixed(1)}%` } }
        }
      }
    });
  }

  // Renders Historicos
  async renderTop10Historicos() {
    await this.top10Historico()
    const myChart = new Chart("top10", {
      type: 'bar',
      data: {
        labels: this.top10_nombres,
        datasets: [{
          label: '# of assigned points',
          data: this.top10_users_points,
          backgroundColor: [
            'rgba(59,130,246,0.85)','rgba(239,68,68,0.85)','rgba(16,185,129,0.85)',
            'rgba(245,158,11,0.85)','rgba(168,85,247,0.85)','rgba(20,184,166,0.85)',
            'rgba(249,115,22,0.85)','rgba(236,72,153,0.85)','rgba(132,204,22,0.85)',
            'rgba(99,102,241,0.85)',
          ],
          borderColor: [
            'rgba(59,130,246,1)','rgba(239,68,68,1)','rgba(16,185,129,1)',
            'rgba(245,158,11,1)','rgba(168,85,247,1)','rgba(20,184,166,1)',
            'rgba(249,115,22,1)','rgba(236,72,153,1)','rgba(132,204,22,1)',
            'rgba(99,102,241,1)',
          ],
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          y: { grid: { display: false } }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  async renderPuntosContablesHistoricos() {
    await this.puntosContablesHistoricos()

    if (this.puntosCountableChart) {
      this.puntosCountableChart.destroy();
    }

    const myChart = new Chart("puntosContables", {
      type: 'bar',
      data: {
        labels: this.puntos_areas_nombres_cont,
        datasets: [{
          label: '% of Ideas',
          data: this.percentages_puntos,
          backgroundColor: [
            'rgba(59,130,246,0.85)','rgba(239,68,68,0.85)','rgba(16,185,129,0.85)',
            'rgba(245,158,11,0.85)','rgba(168,85,247,0.85)','rgba(20,184,166,0.85)',
            'rgba(249,115,22,0.85)','rgba(236,72,153,0.85)','rgba(132,204,22,0.85)',
            'rgba(99,102,241,0.85)',
          ],
          borderColor: [
            'rgba(59,130,246,1)','rgba(239,68,68,1)','rgba(16,185,129,1)',
            'rgba(245,158,11,1)','rgba(168,85,247,1)','rgba(20,184,166,1)',
            'rgba(249,115,22,1)','rgba(236,72,153,1)','rgba(132,204,22,1)',
            'rgba(99,102,241,1)',
          ],
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true, min: 0, max: 100,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { callback: (v: any) => v + '%' }
          },
          x: { grid: { display: false } }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx: any) => ` ${(ctx.raw as number).toFixed(1)}%` } }
        }
      }
    });
  }

  async renderPuntosNoContablesHistoricos() {
    await this.puntosNoContablesHistoricos()

    if (this.puntosUncountableChart) {
      this.puntosUncountableChart.destroy();
    }

    const myChart = new Chart("puntosNoContables", {
      type: 'bar',
      data: {
        labels: this.puntos_areas_nombres,
        datasets: [{
          label: '% of Ideas',
          data: this.non_percentages_puntos,
          backgroundColor: [
            'rgba(59,130,246,0.85)','rgba(239,68,68,0.85)','rgba(16,185,129,0.85)',
            'rgba(245,158,11,0.85)','rgba(168,85,247,0.85)','rgba(20,184,166,0.85)',
            'rgba(249,115,22,0.85)','rgba(236,72,153,0.85)','rgba(132,204,22,0.85)',
            'rgba(99,102,241,0.85)',
          ],
          borderColor: [
            'rgba(59,130,246,1)','rgba(239,68,68,1)','rgba(16,185,129,1)',
            'rgba(245,158,11,1)','rgba(168,85,247,1)','rgba(20,184,166,1)',
            'rgba(249,115,22,1)','rgba(236,72,153,1)','rgba(132,204,22,1)',
            'rgba(99,102,241,1)',
          ],
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true, min: 0, max: 100,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { callback: (v: any) => v + '%' }
          },
          x: { grid: { display: false } }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx: any) => ` ${(ctx.raw as number).toFixed(1)}%` } }
        }
      }
    });
  }

  //CALENDARIO

  //hola, este calendario NO es de mi propiedad, lo saqué por completo de la sig. página:
  //https://stackblitz.com/edit/angular-tailwind-datepicker?file=src%2Fapp%2Fapp.component.ts

  initDate() {
    let today = new Date();
    this.month = today.getMonth();
    this.year = today.getFullYear();
    this.datepickerValue = new Date(this.year, this.month, today.getDate()).toDateString();
    this.getNoOfDays()
  }

  changeMonth(direction: number) {
    this.month += direction;
    if (this.month > 11) {
      this.month = 0;
      this.year++;
    } else if (this.month < 0) {
      this.month = 11;
      this.year--;
    }
    this.getNoOfDays();
  }

  changeYear(direction: number) {
    this.year += direction;
    this.getNoOfDays();
  }

  isToday(date: any) {
    const today = new Date();
    const d = new Date(this.year, this.month, date);
    return today.toDateString() === d.toDateString() ? true : false;
  }

  getDateValue(date: any) {
    let selectedDate = new Date(this.year, this.month, date);
    this.datepickerValue = selectedDate.toDateString();
    // this.$refs.date.value = selectedDate.getFullYear() +"-"+ ('0'+ selectedDate.getMonth()).slice(-2) +"-"+ ('0' + selectedDate.getDate()).slice(-2);
    // console.log(this.$refs.date.value);
    let formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    this.fecha_inicio = formattedDate

    console.log(this.fecha_inicio)
    this.showDatepicker = false;
  }

  getDateValue2(date: any) {
    let selectedDate = new Date(this.year, this.month, date);
    this.datepickerValue2 = selectedDate.toDateString();
    // this.$refs.date.value = selectedDate.getFullYear() +"-"+ ('0'+ selectedDate.getMonth()).slice(-2) +"-"+ ('0' + selectedDate.getDate()).slice(-2);
    // console.log(this.$refs.date.value);
    let formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    this.fecha_fin = formattedDate

    console.log(this.fecha_fin)
    this.showDatepicker2 = false;
  }

  getNoOfDays() {
    let daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

    // find where to start calendar day of week
    let dayOfWeek = new Date(this.year, this.month).getDay();
    let blankdaysArray = [];
    for (var i = 1; i <= dayOfWeek; i++) {
      blankdaysArray.push(i);
    }

    let daysArray = [];
    for (var i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    this.blankdays = blankdaysArray;
    this.no_of_days = daysArray;
  }

}
