import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ReportesService } from '../../servicios/reportes.service';
import { AhorroArea, AhorroTotal, FechasAhorros, FechasIdeas, FechasPuntos, Historial, IdeasCN, PuntosArea, ReportesIdeas2, ReportesPuntos, Top10User } from '../../interfaces/reportes';
import { ReportesIdeas } from '../../interfaces/reportes';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
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

  constructor(protected reporteService: ReportesService) { }

  ngOnInit(): void {
    this.initDate()

  }



  renderHistorialsByDate() {
    this.cleanCharts()

  }

  renderIdeasByDate() {
    this.cleanCharts()

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

    }
    else if (this.tab === 1) {
      this.cleanCharts()


    } else if (this.tab == 2) {
      this.cleanCharts()
      this.renderAhorrosHistorico()
    }
  }



  // Filtrar por fechas
  mostrarDatosPorFechas() {
    if (this.tab === 0) {
      this.cleanCharts()

    }
    else if (this.tab === 1) {
      this.cleanCharts()

    }
    else if (this.tab === 2) {
      this.cleanCharts()
      this.renderAhorros()
    }
  }
  //TOP 10 USUARIOS CON MAS PUNTOS (HISTORICO)


  //TOP 10 USUARIOS CON MAS PUNTOS (FILTRADO)


  //PUNTOS POR AREA CONTABLES (HISTORICOS)

  //PUNTOS POR AREA NO CONTABLES (HISTORICOS)


  //PUNTOS POR AREA CONTABLES Y NO CONTABLES (FILTRADOS)

  //IDEAS POR AREA (FILTRADAS)


  // IDEAS POR AREA (HISTORICAS)



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
        },
        maintainAspectRatio: false,
        responsive: true
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

  }

  ideasClick() {
    this.tab = 1
    this.cleanCharts()

  }

  ahorrosClick() {
    this.tab = 2
    this.cleanCharts()
    this.renderAhorrosHistorico()
  }
}
