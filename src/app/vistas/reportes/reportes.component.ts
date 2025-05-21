import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ReportesService } from '../../servicios/reportes.service';
import { AhorroArea, AhorroTotal, FechasAhorros, FechasIdeas, FechasPuntos, Historial, IdeasCN, PuntosArea, ReportesIdeas2, ReportesPuntos, Top10User } from '../../interfaces/reportes';
import { ReportesIdeas } from '../../interfaces/reportes';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { RouterLink } from '@angular/router';
Chart.register(...registerables)

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [AppNavbarComponent, NgFor, ReactiveFormsModule, FormsModule, NgIf, NgClass, RouterLink],
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

  constructor(protected reporteService: ReportesService) { }

  ngOnInit(): void {
    this.initDate()
    this.renderTop10Historico()
    this.renderPuntosContablesHistoricos()
    this.renderPuntosNoContablesHistoricos()
  }



  goBack() {
    window.history.back();
  }


  renderHistorialsByDate() {
    this.cleanCharts()
    this.renderHistorial()
    this.renderPuntosContables()
    this.renderPuntosNoContables()
  }

  renderIdeasByDate() {
    this.cleanCharts()
    this.renderIdeasTotales()
    this.renderAccountable()
    this.renderNotAccountable()
  }

  renderSavingsByDate() {
    this.cleanCharts()
    this.renderAhorros()
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
    const existingChartPuntosAc = Chart.getChart('puntosCountable');
    if (existingChartPuntosAc) {
      existingChartPuntosAc.destroy();
      this.puntos_cont_data = null
      this.total_puntos_countable = 0
      this.total_cont_puntos = []
      this.puntos_areas_nombres_cont = []
      this.percentages_puntos = []

    }
    const existingChartPuntosUn = Chart.getChart('puntosUncountable');
    if (existingChartPuntosUn) {
      existingChartPuntosUn.destroy();
      this.puntos_non_data = null
      this.total_puntos_uncountable = 0
      this.total_non_puntos = []
      this.puntos_areas_nombres = []
      this.non_percentages_puntos = []
    }
    const existingChartIdeasTotales = Chart.getChart('ideasTotales');
    if (existingChartIdeasTotales) {
      existingChartIdeasTotales.destroy();
      this.areas_tot_data = null
      this.areas_tot_nombres = []
      this.areas_tot_ideas = []
      this.tot_percentages = []
    }
    const existingChartIdeasAc = Chart.getChart('countable');
    if (existingChartIdeasAc) {
      existingChartIdeasAc.destroy();
      this.areas_cont_data = null
      this.areas_cont_nombres = []
      this.areas_cont_ideas = []
      this.accountable_percentages = []
    }
    const existingChartIdeasUn = Chart.getChart('ctx');
    if (existingChartIdeasUn) {
      existingChartIdeasUn.destroy();
      this.areas_non_data = null
      this.areas_non_nombres = []
      this.areas_non_ideas = []
      this.non_percentages = []
    }

    const existingChartAhorro = Chart.getChart('ahorro');
    if (existingChartAhorro) {
      existingChartAhorro.destroy();
      this.ahorros_data = null
      this.total_ahorros = 0
      this.ahorros_nombres = []
      this.ahorros_totalByArea = []
      this.ahorros_percentages = []
    }

  }

  // Mostrar datos historicos de nuevo
  mostrarDatosHistoricos() {
    if (this.tab === 0) {
      this.cleanCharts()
      this.renderTop10Historico()
      this.renderPuntosContablesHistoricos()
      this.renderPuntosNoContablesHistoricos()
    }
    else if (this.tab === 1) {
      this.cleanCharts()
      this.renderIdeasTotalesHistoricas()
      this.renderIdeasContablesHistoricas()
      this.renderIdeasNoContablesHistoricas()

    } else if (this.tab == 2) {
      this.cleanCharts()
      this.renderAhorrosHistorico()
    }
  }



  // Filtrar por fechas
  mostrarDatosPorFechas() {
    if (this.tab === 0) {
      this.cleanCharts()
      this.renderHistorial()
      this.renderPuntosContables()
      this.renderPuntosNoContables()
    }
    else if (this.tab === 1) {
      this.cleanCharts()
      this.renderIdeasTotales()
      this.renderAccountable()
      this.renderNotAccountable()
    }
    else if (this.tab === 2) {
      this.cleanCharts()
      this.renderAhorros()
    }
  }
  //TOP 10 USUARIOS CON MAS PUNTOS (HISTORICO)
  async top10historico() {
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

  async renderTop10Historico() {

    await this.top10historico()
    const myChart = new Chart("top10", {
      type: 'bar',
      data: {
        labels: this.top10_nombres,
        datasets: [{
          label: '# of assigned points',
          data: this.top10_users_points,
          backgroundColor: [
            'rgba(35, 52, 188, 1)', //dark turquoise
            'rgba(176, 21, 63, 1)', //aqumarine
            'rgba(29, 232, 50, 1)', //turquoise 29, 232, 50
            'rgba(235, 235, 28, 1)', //steel blue
            'rgba(294, 97, 7, 1)', //deep sky blue 0, 191, 255
            'rgba(33, 147, 8, 1)', //navy blue 29, 232, 50
            'rgba(0, 191, 255, 1)', //blue
            'rgba(213, 14, 192, 1)', //royal blue
            'rgba(231, 207, 7, 1)', //dark slate
            'rgba(185, 178, 122, 1)' //storm blue
          ],
          borderColor: [
            'rgba(35, 52, 188, 0.4)', //dark turquoise
            'rgba(176, 21, 63, 0.4)',  //aqumarine 241, 65, 34
            'rgba(29, 232, 50, 0.4)', //turquoise
            'rgba(235, 235, 28, 0.4)', //steel blue
            'rgba(294, 97, 7, 0.4)', //deep sky blue
            'rgba(33, 147, 8, 0.4)', //navy blue
            'rgba(0, 191, 255, 0.4)', //blue
            'rgba(213, 14, 192, 0.4)', //royal blue
            'rgba(231, 207, 7, 0.4)', //dark slate
            'rgba(185, 178, 122, 0.4)' //storm blue
          ],
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: this.top10_max
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  //TOP 10 USUARIOS CON MAS PUNTOS (FILTRADO)
  async historial() {
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

  async renderHistorial() {

    await this.historial()
    const myChart = new Chart("top10", {
      type: 'bar',
      data: {
        labels: this.top10_nombres,
        datasets: [{
          label: '# of assigned points',
          data: this.top10_users_points,
          backgroundColor: [
            'rgba(35, 52, 188, 1)', //dark turquoise
            'rgba(176, 21, 63, 1)', //aqumarine
            'rgba(29, 232, 50, 1)', //turquoise 29, 232, 50
            'rgba(235, 235, 28, 1)', //steel blue
            'rgba(294, 97, 7, 1)', //deep sky blue 0, 191, 255
            'rgba(33, 147, 8, 1)', //navy blue 29, 232, 50
            'rgba(0, 191, 255, 1)', //blue
            'rgba(213, 14, 192, 1)', //royal blue
            'rgba(231, 207, 7, 1)', //dark slate
            'rgba(185, 178, 122, 1)' //storm blue
          ],
          borderColor: [
            'rgba(35, 52, 188, 0.4)', //dark turquoise
            'rgba(176, 21, 63, 0.4)',  //aqumarine 241, 65, 34
            'rgba(29, 232, 50, 0.4)', //turquoise
            'rgba(235, 235, 28, 0.4)', //steel blue
            'rgba(294, 97, 7, 0.4)', //deep sky blue
            'rgba(33, 147, 8, 0.4)', //navy blue
            'rgba(0, 191, 255, 0.4)', //blue
            'rgba(213, 14, 192, 0.4)', //royal blue
            'rgba(231, 207, 7, 0.4)', //dark slate
            'rgba(185, 178, 122, 0.4)' //storm blue
          ],
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: this.top10_max
          }
        },
        maintainAspectRatio: false,
        responsive: true
      }
    });
  }

  //PUNTOS POR AREA CONTABLES (HISTORICOS)
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

  async renderPuntosContablesHistoricos() {
    await this.puntosContablesHistoricos()

    if (this.puntosCountableChart) {
      this.puntosCountableChart.destroy();
    }

    const myChart = new Chart("puntosCountable", {
      type: 'bar',
      data: {
        labels: this.puntos_areas_nombres_cont,
        datasets: [{
          label: '% of Ideas',
          data: this.percentages_puntos,
          backgroundColor: [
            'rgba(35, 52, 188, 1)', //dark turquoise
            'rgba(176, 21, 63, 1)', //aqumarine
            'rgba(29, 232, 50, 1)', //turquoise 29, 232, 50
            'rgba(235, 235, 28, 1)', //steel blue
            'rgba(294, 97, 7, 1)', //deep sky blue 0, 191, 255
            'rgba(33, 147, 8, 1)', //navy blue 29, 232, 50
            'rgba(0, 191, 255, 1)', //blue
            'rgba(213, 14, 192, 1)', //royal blue
            'rgba(231, 207, 7, 1)', //dark slate
            'rgba(185, 178, 122, 1)' //storm blue
          ],
          borderColor: [
            'rgba(35, 52, 188, 0.4)', //dark turquoise
            'rgba(176, 21, 63, 0.4)',  //aqumarine 241, 65, 34
            'rgba(29, 232, 50, 0.4)', //turquoise
            'rgba(235, 235, 28, 0.4)', //steel blue
            'rgba(294, 97, 7, 0.4)', //deep sky blue
            'rgba(33, 147, 8, 0.4)', //navy blue
            'rgba(0, 191, 255, 0.4)', //blue
            'rgba(213, 14, 192, 0.4)', //royal blue
            'rgba(231, 207, 7, 0.4)', //dark slate
            'rgba(185, 178, 122, 0.4)' //storm blue
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 100
          },

        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
  //PUNTOS POR AREA NO CONTABLES (HISTORICOS)
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

  async renderPuntosNoContablesHistoricos() {
    await this.puntosNoContablesHistoricos()

    if (this.puntosUncountableChart) {
      this.puntosUncountableChart.destroy();
    }

    const myChart = new Chart("puntosUncountable", {
      type: 'bar',
      data: {
        labels: this.puntos_areas_nombres,
        datasets: [{
          label: '% of Ideas',
          data: this.non_percentages_puntos,
          backgroundColor: [
            'rgba(35, 52, 188, 1)', //dark turquoise
            'rgba(176, 21, 63, 1)', //aqumarine
            'rgba(29, 232, 50, 1)', //turquoise 29, 232, 50
            'rgba(235, 235, 28, 1)', //steel blue
            'rgba(294, 97, 7, 1)', //deep sky blue 0, 191, 255
            'rgba(33, 147, 8, 1)', //navy blue 29, 232, 50
            'rgba(0, 191, 255, 1)', //blue
            'rgba(213, 14, 192, 1)', //royal blue
            'rgba(231, 207, 7, 1)', //dark slate
            'rgba(185, 178, 122, 1)' //storm blue
          ],
          borderColor: [
            'rgba(35, 52, 188, 0.4)', //dark turquoise
            'rgba(176, 21, 63, 0.4)',  //aqumarine 241, 65, 34
            'rgba(29, 232, 50, 0.4)', //turquoise
            'rgba(235, 235, 28, 0.4)', //steel blue
            'rgba(294, 97, 7, 0.4)', //deep sky blue
            'rgba(33, 147, 8, 0.4)', //navy blue
            'rgba(0, 191, 255, 0.4)', //blue
            'rgba(213, 14, 192, 0.4)', //royal blue
            'rgba(231, 207, 7, 0.4)', //dark slate
            'rgba(185, 178, 122, 0.4)' //storm blue
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 100
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  //PUNTOS POR AREA CONTABLES Y NO CONTABLES (FILTRADOS)
  async puntosContables() {
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

  async puntosNoContables() {
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


  async renderPuntosContables() {
    await this.puntosContables()

    const myChart = new Chart("puntosCountable", {
      type: 'bar',
      data: {
        labels: this.puntos_areas_nombres_cont,
        datasets: [{
          label: '% of Ideas',
          data: this.percentages_puntos,
          backgroundColor: [
            'rgba(35, 52, 188, 1)', //dark turquoise
            'rgba(176, 21, 63, 1)', //aqumarine
            'rgba(29, 232, 50, 1)', //turquoise 29, 232, 50
            'rgba(235, 235, 28, 1)', //steel blue
            'rgba(294, 97, 7, 1)', //deep sky blue 0, 191, 255
            'rgba(33, 147, 8, 1)', //navy blue 29, 232, 50
            'rgba(0, 191, 255, 1)', //blue
            'rgba(213, 14, 192, 1)', //royal blue
            'rgba(231, 207, 7, 1)', //dark slate
            'rgba(185, 178, 122, 1)' //storm blue
          ],
          borderColor: [
            'rgba(35, 52, 188, 0.4)', //dark turquoise
            'rgba(176, 21, 63, 0.4)',  //aqumarine 241, 65, 34
            'rgba(29, 232, 50, 0.4)', //turquoise
            'rgba(235, 235, 28, 0.4)', //steel blue
            'rgba(294, 97, 7, 0.4)', //deep sky blue
            'rgba(33, 147, 8, 0.4)', //navy blue
            'rgba(0, 191, 255, 0.4)', //blue
            'rgba(213, 14, 192, 0.4)', //royal blue
            'rgba(231, 207, 7, 0.4)', //dark slate
            'rgba(185, 178, 122, 0.4)' //storm blue
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 100
          }
        }
      }
    });
  }


  async renderPuntosNoContables() {
    await this.puntosNoContables()

    const myChart = new Chart("puntosUncountable", {
      type: 'bar',
      data: {
        labels: this.puntos_areas_nombres,
        datasets: [{
          label: '% of Ideas',
          data: this.non_percentages_puntos,
          backgroundColor: [
            'rgba(35, 52, 188, 1)', //dark turquoise
            'rgba(176, 21, 63, 1)', //aqumarine
            'rgba(29, 232, 50, 1)', //turquoise 29, 232, 50
            'rgba(235, 235, 28, 1)', //steel blue
            'rgba(294, 97, 7, 1)', //deep sky blue 0, 191, 255
            'rgba(33, 147, 8, 1)', //navy blue 29, 232, 50
            'rgba(0, 191, 255, 1)', //blue
            'rgba(213, 14, 192, 1)', //royal blue
            'rgba(231, 207, 7, 1)', //dark slate
            'rgba(185, 178, 122, 1)' //storm blue
          ],
          borderColor: [
            'rgba(35, 52, 188, 0.4)', //dark turquoise
            'rgba(176, 21, 63, 0.4)',  //aqumarine 241, 65, 34
            'rgba(29, 232, 50, 0.4)', //turquoise
            'rgba(235, 235, 28, 0.4)', //steel blue
            'rgba(294, 97, 7, 0.4)', //deep sky blue
            'rgba(33, 147, 8, 0.4)', //navy blue
            'rgba(0, 191, 255, 0.4)', //blue
            'rgba(213, 14, 192, 0.4)', //royal blue
            'rgba(231, 207, 7, 0.4)', //dark slate
            'rgba(185, 178, 122, 0.4)' //storm blue
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 100
          }
        }
      }
    });
  }





  //IDEAS POR AREA (FILTRADAS)
  async ideasTotales() {
    let self = this
    let fechas: FechasIdeas = {
      fecha_inicio: this.date0 ?? '',
      fecha_fin: this.date1 ?? ''
    }
    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.ideasTotales(fechas).subscribe({
          next: (value: ReportesIdeas2) => {
            self.areas_tot_data = value.ideas_por_area
            console.log(self.areas_tot_data)
            value.ideas_por_area.forEach(
              area => {
                self.areas_tot_nombres.push(area.nombre_area + " (" + area.total_ideas + " ideas)")
                self.areas_tot_ideas.push(area.total_ideas)
              })
            const totalIdeas = this.areas_tot_ideas.reduce((acc, value) => acc + value, 0);
            this.areas_tot_ideas.forEach(value => {
              self.pxt = (value / totalIdeas) * 100
              self.tot_percentages.push(this.pxt)
            });
            resolve();
          },
          error: (error) => reject(error)
        });
      });
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async ideasContables() {
    let self = this
    let fechas: FechasIdeas = {
      fecha_inicio: this.date0 ?? '',
      fecha_fin: this.date1 ?? ''
    }
    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.ideasContables(fechas).subscribe({
          next: (value: ReportesIdeas2) => {
            self.areas_cont_data = value.ideas_por_area
            console.log(self.areas_cont_data)
            value.ideas_por_area.forEach(
              area => {
                self.areas_cont_nombres.push(area.nombre_area + " (" + area.total_ideas + " ideas)")
                self.areas_cont_ideas.push(area.total_ideas)
              })
            const totalIdeas = this.areas_cont_ideas.reduce((acc, value) => acc + value, 0);
            this.areas_cont_ideas.forEach(value => {
              self.pxt = (value / totalIdeas) * 100
              self.accountable_percentages.push(this.pxt)
            });
            resolve();
          },
          error: (error) => reject(error)
        });
      });
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async ideasNoContables() {
    let self = this
    let fechas: FechasIdeas = {
      fecha_inicio: this.date0 ?? '',
      fecha_fin: this.date1 ?? ''
    }
    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.ideasNoContables(fechas).subscribe({
          next: (value: ReportesIdeas) => {

            self.areas_non_data = value.msg.ideas_por_area
            console.log(self.areas_non_data)
            value.msg.ideas_por_area.forEach(
              area => {
                self.areas_non_nombres.push(area.nombre_area + " (" + area.total_ideas + " ideas)")
                self.areas_non_ideas.push(area.total_ideas)
              }
            )
            const totalIdeas = this.areas_non_ideas.reduce((acc, value) => acc + value, 0);
            this.areas_non_ideas.forEach(value => {
              self.pxt = (value / totalIdeas) * 100
              self.non_percentages.push(this.pxt)
            });
            resolve();
          },
          error: (error) => reject(error)
        });
      });
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async renderIdeasTotales() {
    await this.ideasTotales()

    if (this.ideasTotalesChart) {
      this.ideasTotalesChart.destroy();
    }

    const myChart = new Chart("ideasTotales", {
      type: 'bar',
      data: {
        labels: this.areas_tot_nombres,
        datasets: [{
          label: '% of Ideas',
          data: this.tot_percentages,
          backgroundColor: [
            'rgba(35, 52, 188, 1)', //dark turquoise
            'rgba(176, 21, 63, 1)', //aqumarine
            'rgba(29, 232, 50, 1)', //turquoise 29, 232, 50
            'rgba(235, 235, 28, 1)', //steel blue
            'rgba(294, 97, 7, 1)', //deep sky blue 0, 191, 255
            'rgba(33, 147, 8, 1)', //navy blue 29, 232, 50
            'rgba(0, 191, 255, 1)', //blue
            'rgba(213, 14, 192, 1)', //royal blue
            'rgba(231, 207, 7, 1)', //dark slate
            'rgba(185, 178, 122, 1)' //storm blue
          ],
          borderColor: [
            'rgba(35, 52, 188, 0.4)', //dark turquoise
            'rgba(176, 21, 63, 0.4)',  //aqumarine 241, 65, 34
            'rgba(29, 232, 50, 0.4)', //turquoise
            'rgba(235, 235, 28, 0.4)', //steel blue
            'rgba(294, 97, 7, 0.4)', //deep sky blue
            'rgba(33, 147, 8, 0.4)', //navy blue
            'rgba(0, 191, 255, 0.4)', //blue
            'rgba(213, 14, 192, 0.4)', //royal blue
            'rgba(231, 207, 7, 0.4)', //dark slate
            'rgba(185, 178, 122, 0.4)' //storm blue
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 100
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  async renderAccountable() {
    await this.ideasContables()

    if (this.ideasContablesChart) {
      this.ideasContablesChart.destroy();
    }

    const myChart = new Chart("countable", {
      type: 'bar',
      data: {
        labels: this.areas_cont_nombres,
        datasets: [{
          label: '% of Ideas',
          data: this.accountable_percentages,
          backgroundColor: [
            'rgba(35, 52, 188, 1)', //dark turquoise
            'rgba(176, 21, 63, 1)', //aqumarine
            'rgba(29, 232, 50, 1)', //turquoise 29, 232, 50
            'rgba(235, 235, 28, 1)', //steel blue
            'rgba(294, 97, 7, 1)', //deep sky blue 0, 191, 255
            'rgba(33, 147, 8, 1)', //navy blue 29, 232, 50
            'rgba(0, 191, 255, 1)', //blue
            'rgba(213, 14, 192, 1)', //royal blue
            'rgba(231, 207, 7, 1)', //dark slate
            'rgba(185, 178, 122, 1)' //storm blue
          ],
          borderColor: [
            'rgba(35, 52, 188, 0.4)', //dark turquoise
            'rgba(176, 21, 63, 0.4)',  //aqumarine 241, 65, 34
            'rgba(29, 232, 50, 0.4)', //turquoise
            'rgba(235, 235, 28, 0.4)', //steel blue
            'rgba(294, 97, 7, 0.4)', //deep sky blue
            'rgba(33, 147, 8, 0.4)', //navy blue
            'rgba(0, 191, 255, 0.4)', //blue
            'rgba(213, 14, 192, 0.4)', //royal blue
            'rgba(231, 207, 7, 0.4)', //dark slate
            'rgba(185, 178, 122, 0.4)' //storm blue
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 100
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  async renderNotAccountable() {
    await this.ideasNoContables()

    if (this.ideasNoContablesChart) {
      this.ideasNoContablesChart.destroy();
    }

    const myChart = new Chart("ctx", {
      type: 'bar',
      data: {
        labels: this.areas_non_nombres,
        datasets: [{
          label: '% of Ideas',
          data: this.non_percentages,
          backgroundColor: [
            'rgba(35, 52, 188, 1)', //dark turquoise
            'rgba(176, 21, 63, 1)', //aqumarine
            'rgba(29, 232, 50, 1)', //turquoise 29, 232, 50
            'rgba(235, 235, 28, 1)', //steel blue
            'rgba(294, 97, 7, 1)', //deep sky blue 0, 191, 255
            'rgba(33, 147, 8, 1)', //navy blue 29, 232, 50
            'rgba(0, 191, 255, 1)', //blue
            'rgba(213, 14, 192, 1)', //royal blue
            'rgba(231, 207, 7, 1)', //dark slate
            'rgba(185, 178, 122, 1)' //storm blue
          ],
          borderColor: [
            'rgba(35, 52, 188, 0.4)', //dark turquoise
            'rgba(176, 21, 63, 0.4)',  //aqumarine 241, 65, 34
            'rgba(29, 232, 50, 0.4)', //turquoise
            'rgba(235, 235, 28, 0.4)', //steel blue
            'rgba(294, 97, 7, 0.4)', //deep sky blue
            'rgba(33, 147, 8, 0.4)', //navy blue
            'rgba(0, 191, 255, 0.4)', //blue
            'rgba(213, 14, 192, 0.4)', //royal blue
            'rgba(231, 207, 7, 0.4)', //dark slate
            'rgba(185, 178, 122, 0.4)' //storm blue
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 100
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // IDEAS POR AREA (HISTORICAS)
  async ideasTotalesHistoricas() {
    let self = this
    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.ideasTotalesHistoricas().subscribe({
          next: (value: ReportesIdeas2) => {
            self.areas_tot_data = value.ideas_por_area
            console.log(self.areas_tot_data)
            value.ideas_por_area.forEach(
              area => {
                self.areas_tot_nombres.push(area.nombre_area + " (" + area.total_ideas + " ideas)")
                self.areas_tot_ideas.push(area.total_ideas)
              })
            const totalIdeas = this.areas_tot_ideas.reduce((acc, value) => acc + value, 0);
            this.areas_tot_ideas.forEach(value => {
              self.pxt = (value / totalIdeas) * 100
              self.tot_percentages.push(this.pxt)
            });
            resolve();
          },
          error: (error) => reject(error)
        });
      });
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async ideasContablesHistoricas() {
    let self = this
    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.ideasContablesHistoricas().subscribe({
          next: (value: ReportesIdeas2) => {
            self.areas_cont_data = value.ideas_por_area
            console.log(self.areas_cont_data)
            value.ideas_por_area.forEach(
              area => {
                self.areas_cont_nombres.push(area.nombre_area + " (" + area.total_ideas + " ideas)")
                self.areas_cont_ideas.push(area.total_ideas)
              })
            const totalIdeas = this.areas_cont_ideas.reduce((acc, value) => acc + value, 0);
            this.areas_cont_ideas.forEach(value => {
              self.pxt = (value / totalIdeas) * 100
              self.accountable_percentages.push(this.pxt)
            });
            resolve();
          },
          error: (error) => reject(error)
        });
      });
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async ideasNoContablesHistoricas() {
    let self = this

    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.ideasNoContablesHistoricas().subscribe({
          next: (value: ReportesIdeas) => {

            self.areas_non_data = value.msg.ideas_por_area
            console.log(self.areas_non_data)
            value.msg.ideas_por_area.forEach(
              area => {
                self.areas_non_nombres.push(area.nombre_area + " (" + area.total_ideas + " ideas)")
                self.areas_non_ideas.push(area.total_ideas)
              }
            )
            const totalIdeas = this.areas_non_ideas.reduce((acc, value) => acc + value, 0);
            this.areas_non_ideas.forEach(value => {
              self.pxt = (value / totalIdeas) * 100
              self.non_percentages.push(this.pxt)
            });
            resolve();
          },
          error: (error) => reject(error)
        });
      });
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async renderIdeasTotalesHistoricas() {
    await this.ideasTotalesHistoricas()

    if (this.ideasTotalesChart) {
      this.ideasTotalesChart.destroy();
    }

    const myChart = new Chart("ideasTotales", {
      type: 'bar',
      data: {
        labels: this.areas_tot_nombres,
        datasets: [{
          label: '% of Ideas',
          data: this.tot_percentages,
          backgroundColor: [
            'rgba(35, 52, 188, 1)', //dark turquoise
            'rgba(176, 21, 63, 1)', //aqumarine
            'rgba(29, 232, 50, 1)', //turquoise 29, 232, 50
            'rgba(235, 235, 28, 1)', //steel blue
            'rgba(294, 97, 7, 1)', //deep sky blue 0, 191, 255
            'rgba(33, 147, 8, 1)', //navy blue 29, 232, 50
            'rgba(0, 191, 255, 1)', //blue
            'rgba(213, 14, 192, 1)', //royal blue
            'rgba(231, 207, 7, 1)', //dark slate
            'rgba(185, 178, 122, 1)' //storm blue
          ],
          borderColor: [
            'rgba(35, 52, 188, 0.4)', //dark turquoise
            'rgba(176, 21, 63, 0.4)',  //aqumarine 241, 65, 34
            'rgba(29, 232, 50, 0.4)', //turquoise
            'rgba(235, 235, 28, 0.4)', //steel blue
            'rgba(294, 97, 7, 0.4)', //deep sky blue
            'rgba(33, 147, 8, 0.4)', //navy blue
            'rgba(0, 191, 255, 0.4)', //blue
            'rgba(213, 14, 192, 0.4)', //royal blue
            'rgba(231, 207, 7, 0.4)', //dark slate
            'rgba(185, 178, 122, 0.4)' //storm blue
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 100
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  async renderIdeasContablesHistoricas() {
    await this.ideasContablesHistoricas()

    if (this.ideasContablesChart) {
      this.ideasContablesChart.destroy();
    }

    const myChart = new Chart("countable", {
      type: 'bar',
      data: {
        labels: this.areas_cont_nombres,
        datasets: [{
          label: '% of Ideas',
          data: this.accountable_percentages,
          backgroundColor: [
            'rgba(35, 52, 188, 1)', //dark turquoise
            'rgba(176, 21, 63, 1)', //aqumarine
            'rgba(29, 232, 50, 1)', //turquoise 29, 232, 50
            'rgba(235, 235, 28, 1)', //steel blue
            'rgba(294, 97, 7, 1)', //deep sky blue 0, 191, 255
            'rgba(33, 147, 8, 1)', //navy blue 29, 232, 50
            'rgba(0, 191, 255, 1)', //blue
            'rgba(213, 14, 192, 1)', //royal blue
            'rgba(231, 207, 7, 1)', //dark slate
            'rgba(185, 178, 122, 1)' //storm blue
          ],
          borderColor: [
            'rgba(35, 52, 188, 0.4)', //dark turquoise
            'rgba(176, 21, 63, 0.4)',  //aqumarine 241, 65, 34
            'rgba(29, 232, 50, 0.4)', //turquoise
            'rgba(235, 235, 28, 0.4)', //steel blue
            'rgba(294, 97, 7, 0.4)', //deep sky blue
            'rgba(33, 147, 8, 0.4)', //navy blue
            'rgba(0, 191, 255, 0.4)', //blue
            'rgba(213, 14, 192, 0.4)', //royal blue
            'rgba(231, 207, 7, 0.4)', //dark slate
            'rgba(185, 178, 122, 0.4)' //storm blue
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 100
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  async renderIdeasNoContablesHistoricas() {
    await this.ideasNoContablesHistoricas()

    if (this.ideasNoContablesChart) {
      this.ideasNoContablesChart.destroy();
    }

    const myChart = new Chart("ctx", {
      type: 'bar',
      data: {
        labels: this.areas_non_nombres,
        datasets: [{
          label: '% of Ideas',
          data: this.non_percentages,
          backgroundColor: [
            'rgba(35, 52, 188, 1)', //dark turquoise
            'rgba(176, 21, 63, 1)', //aqumarine
            'rgba(29, 232, 50, 1)', //turquoise 29, 232, 50
            'rgba(235, 235, 28, 1)', //steel blue
            'rgba(294, 97, 7, 1)', //deep sky blue 0, 191, 255
            'rgba(33, 147, 8, 1)', //navy blue 29, 232, 50
            'rgba(0, 191, 255, 1)', //blue
            'rgba(213, 14, 192, 1)', //royal blue
            'rgba(231, 207, 7, 1)', //dark slate
            'rgba(185, 178, 122, 1)' //storm blue
          ],
          borderColor: [
            'rgba(35, 52, 188, 0.4)', //dark turquoise
            'rgba(176, 21, 63, 0.4)',  //aqumarine 241, 65, 34
            'rgba(29, 232, 50, 0.4)', //turquoise
            'rgba(235, 235, 28, 0.4)', //steel blue
            'rgba(294, 97, 7, 0.4)', //deep sky blue
            'rgba(33, 147, 8, 0.4)', //navy blue
            'rgba(0, 191, 255, 0.4)', //blue
            'rgba(213, 14, 192, 0.4)', //royal blue
            'rgba(231, 207, 7, 0.4)', //dark slate
            'rgba(185, 178, 122, 0.4)' //storm blue
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 100
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }


  //AHORRO POR AREA (FILTRADO)

  async ahorroTotalHistorico() {

    let self = this
    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.ahorroHistorico().subscribe({
          next: (value: AhorroTotal) => {
            self.ahorros_data = value
            self.ahorros = value.msg.ahorros_por_area
            self.total_ahorros = value.msg.total_ahorros
            value.msg.ahorros_por_area.forEach(
              area => {
                self.ahorros_nombres.push(area.nombre_area + " ($" + area.total_ahorros + ")")
                self.ahorros_totalByArea.push(area.total_ahorros)
              })
            const total = this.total_ahorros
            self.ahorros_totalByArea.forEach(value => {
              self.pxt = (value / total) * 100
              self.ahorros_percentages.push(this.pxt)
            });
            resolve();
          },
          error: (error) => reject(error)
        });
      });
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }


  }

  async renderAhorrosHistorico() {
    await this.ahorroTotalHistorico()

    if (this.ahorrosChart) {
      this.ahorrosChart.destroy();
    }

    const myChart = new Chart("ahorro", {
      type: 'bar',
      data: {
        labels: this.ahorros_nombres,
        datasets: [{
          label: '% de ahorro',
          data: this.ahorros_percentages,
          backgroundColor: [
            'rgba(35, 52, 188, 1)', //dark turquoise
            'rgba(176, 21, 63, 1)', //aqumarine
            'rgba(29, 232, 50, 1)', //turquoise 29, 232, 50
            'rgba(235, 235, 28, 1)', //steel blue
            'rgba(294, 97, 7, 1)', //deep sky blue 0, 191, 255
            'rgba(33, 147, 8, 1)', //navy blue 29, 232, 50
            'rgba(0, 191, 255, 1)', //blue
            'rgba(213, 14, 192, 1)', //royal blue
            'rgba(231, 207, 7, 1)', //dark slate
            'rgba(185, 178, 122, 1)' //storm blue
          ],
          borderColor: [
            'rgba(35, 52, 188, 0.4)', //dark turquoise
            'rgba(176, 21, 63, 0.4)',  //aqumarine 241, 65, 34
            'rgba(29, 232, 50, 0.4)', //turquoise
            'rgba(235, 235, 28, 0.4)', //steel blue
            'rgba(294, 97, 7, 0.4)', //deep sky blue
            'rgba(33, 147, 8, 0.4)', //navy blue
            'rgba(0, 191, 255, 0.4)', //blue
            'rgba(213, 14, 192, 0.4)', //royal blue
            'rgba(231, 207, 7, 0.4)', //dark slate
            'rgba(185, 178, 122, 0.4)' //storm blue
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 100
          }
        }
      }
    });
  }

  async ahorroTotal() {
    let self = this
    let fechas: FechasAhorros = {
      fecha_inicio: this.date0 ?? '',
      fecha_fin: this.date1 ?? ''
    }
    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.ahorro(fechas).subscribe({
          next: (value: AhorroTotal) => {
            self.ahorros_data = value
            self.ahorros = value.msg.ahorros_por_area
            self.total_ahorros = value.msg.total_ahorros
            value.msg.ahorros_por_area.forEach(
              area => {
                self.ahorros_nombres.push(area.nombre_area + " ($" + area.total_ahorros + ")")
                self.ahorros_totalByArea.push(area.total_ahorros)
              })
            const total = this.total_ahorros
            self.ahorros_totalByArea.forEach(value => {
              self.pxt = (value / total) * 100
              self.ahorros_percentages.push(this.pxt)
            });
            resolve();
          },
          error: (error) => reject(error)
        });
      });
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }


  }

  async renderAhorros() {
    await this.ahorroTotal()

    const myChart = new Chart("ahorro", {
      type: 'bar',
      data: {
        labels: this.ahorros_nombres,
        datasets: [{
          label: '% de ahorro',
          data: this.ahorros_percentages,
          backgroundColor: [
            'rgba(35, 52, 188, 1)', //dark turquoise
            'rgba(176, 21, 63, 1)', //aqumarine
            'rgba(29, 232, 50, 1)', //turquoise 29, 232, 50
            'rgba(235, 235, 28, 1)', //steel blue
            'rgba(294, 97, 7, 1)', //deep sky blue 0, 191, 255
            'rgba(33, 147, 8, 1)', //navy blue 29, 232, 50
            'rgba(0, 191, 255, 1)', //blue
            'rgba(213, 14, 192, 1)', //royal blue
            'rgba(231, 207, 7, 1)', //dark slate
            'rgba(185, 178, 122, 1)' //storm blue
          ],
          borderColor: [
            'rgba(35, 52, 188, 0.4)', //dark turquoise
            'rgba(176, 21, 63, 0.4)',  //aqumarine 241, 65, 34
            'rgba(29, 232, 50, 0.4)', //turquoise
            'rgba(235, 235, 28, 0.4)', //steel blue
            'rgba(294, 97, 7, 0.4)', //deep sky blue
            'rgba(33, 147, 8, 0.4)', //navy blue
            'rgba(0, 191, 255, 0.4)', //blue
            'rgba(213, 14, 192, 0.4)', //royal blue
            'rgba(231, 207, 7, 0.4)', //dark slate
            'rgba(185, 178, 122, 0.4)' //storm blue
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 100
          }
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

  puntosClick() {
    this.tab = 0
    this.cleanCharts()
    this.renderTop10Historico()
    this.renderPuntosContablesHistoricos()
    this.renderPuntosNoContablesHistoricos()
  }

  ideasClick() {
    this.tab = 1
    this.cleanCharts()
    this.renderIdeasTotalesHistoricas()
    this.renderIdeasContablesHistoricas()
    this.renderIdeasNoContablesHistoricas()
  }

  ahorrosClick() {
    this.tab = 2
    this.cleanCharts()
    this.renderAhorrosHistorico()
  }
}
