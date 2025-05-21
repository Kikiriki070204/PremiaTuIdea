import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportesService } from '../../../servicios/reportes.service';
import { AhorroArea, AhorroTotal, FechasAhorros, FechasIdeas, FechasPuntos, Historial, IdeasCN, PuntosArea, ReportesIdeas, ReportesIdeas2, ReportesPuntos, Top10User } from '../../../interfaces/reportes';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables)


@Component({
  selector: 'app-reportes-ideas',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './reportes-ideas.component.html',
  styleUrl: './reportes-ideas.component.css'
})
export class ReportesIdeasComponent implements OnInit {
  constructor(private reporteService: ReportesService) { }

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
  fecha_inicio: string | null = null
  fecha_fin: string | null = null

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

  // ideas contables y no contables (historicos)
  ideasTotalesChart = Chart.getChart('ideasTotales')
  ideasContablesChart = Chart.getChart('ideasContables')
  ideasNoContablesChart = Chart.getChart('ideasNoContables')
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

  pxt: number = 0

  ngOnInit(): void {
    this.initDate()
    this.mostrarDatosHistoricos()
  }
  mostrarDatosHistoricos() {
    this.cleanCharts()
    this.renderIdeasTotalesHistoricas()
    this.renderIdeasContablesHistoricas()
    this.renderIdeasNoContablesHistoricas()
  }

  mostrarDatosFiltrados() {
    this.cleanCharts()
    this.renderIdeasTotalesFiltradas()
    this.renderIdeasContablesFiltradas()
    this.renderIdeasNoContablesFiltradas()
  }

  // Limpiar gráficas
  cleanCharts() {
    const existingChartIdeasTotales = Chart.getChart('ideasTotales');
    if (existingChartIdeasTotales) {
      existingChartIdeasTotales.destroy();
      this.areas_tot_data = null
      this.areas_tot_nombres = []
      this.areas_tot_ideas = []
      this.tot_percentages = []
    }
    const existingChartIdeasAc = Chart.getChart('ideasContables');
    if (existingChartIdeasAc) {
      existingChartIdeasAc.destroy();
      this.areas_cont_data = null
      this.areas_cont_nombres = []
      this.areas_cont_ideas = []
      this.accountable_percentages = []
    }
    const existingChartIdeasUn = Chart.getChart('ideasNoContables');
    if (existingChartIdeasUn) {
      existingChartIdeasUn.destroy();
      this.areas_non_data = null
      this.areas_non_nombres = []
      this.areas_non_ideas = []
      this.non_percentages = []
    }
  }

  // Fuente de info 
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

  async ideasTotalesFiltradas() {
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

  async ideasContablesFiltradas() {
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

  async ideasNoContablesFiltradas() {
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

  // gráficas

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
  async renderIdeasTotalesFiltradas() {
    await this.ideasTotalesFiltradas()

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

    const myChart = new Chart("ideasContables", {
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

  async renderIdeasContablesFiltradas() {
    await this.ideasContablesFiltradas()

    if (this.ideasContablesChart) {
      this.ideasContablesChart.destroy();
    }

    const myChart = new Chart("ideasContables", {
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

    const myChart = new Chart("ideasNoContables", {
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

  async renderIdeasNoContablesFiltradas() {
    await this.ideasNoContablesFiltradas()

    if (this.ideasNoContablesChart) {
      this.ideasNoContablesChart.destroy();
    }

    const myChart = new Chart("ideasNoContables", {
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
