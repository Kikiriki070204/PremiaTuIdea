import { Component, OnInit } from '@angular/core';
import { AhorroArea, AhorroTotal, FechasAhorros, FechasIdeas, FechasPuntos, Historial, IdeasCN, PuntosArea, ReportesIdeas2, ReportesPuntos, Top10User } from '../../../interfaces/reportes';
import { ReportesService } from '../../../servicios/reportes.service';
import { Chart, registerables } from 'chart.js';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
Chart.register(...registerables)

@Component({
  selector: 'app-reportes-ahorro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './reportes-ahorro.component.html',
  styleUrl: './reportes-ahorro.component.css'
})
export class ReportesAhorroComponent implements OnInit {
  constructor(private reporteService: ReportesService) { }
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

  ahorrosChart = Chart.getChart('ahorro')
  ahorros: AhorroArea[] | null = null
  ahorros_data: AhorroTotal | null = null
  ahorros_nombres: string[] = []
  ahorros_totalByArea: number[] = []
  ahorros_percentages: number[] = []
  total_ahorros: number = 0
  total_ahorros_dolares: number = 0
  USD: string = 'USD'
  pxt: number = 0

  ngOnInit(): void {
    this.initDate()
    this.renderAhorrosHistoricos()
  }

  mostrarDatosHistoricos() {
    this.cleanCharts()
    this.renderAhorrosHistoricos()
  }

  mostrarDatosFiltrados() {
    this.cleanCharts()
    this.renderAhorrosFiltrados()
  }

  cleanCharts() {
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

  // Fuente de info
  async ahorrosHistoricos() {
    let self = this
    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.ahorroHistorico().subscribe({
          next: (value: AhorroTotal) => {
            self.ahorros_data = value
            self.ahorros = value.msg.ahorros_por_area
            self.total_ahorros = value.msg.total_ahorros
            self.total_ahorros_dolares = value.msg.total_ahorros_dolares
            value.msg.ahorros_por_area.forEach(area => {
              const label = `${area.nombre_area} ($${area.total_ahorros} / $${area.total_ahorros_dolares} USD)`
              self.ahorros_nombres.push(label)
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

  async ahorrosFiltrados() {
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
            self.total_ahorros_dolares = value.msg.total_ahorros_dolares
            value.msg.ahorros_por_area.forEach(area => {
              const label = `${area.nombre_area} ($${area.total_ahorros} / $${area.total_ahorros_dolares} USD)`
              self.ahorros_nombres.push(label)
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

  async renderAhorrosHistoricos() {
    await this.ahorrosHistoricos()

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

  async renderAhorrosFiltrados() {
    await this.ahorrosFiltrados()

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
        responsive: true
      }
    });
  }

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
