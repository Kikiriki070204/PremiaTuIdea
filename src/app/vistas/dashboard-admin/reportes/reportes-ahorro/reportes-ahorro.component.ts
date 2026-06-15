import { Component, OnInit } from '@angular/core';
import { AhorroArea, AhorroCategoria, AhorroTotal, AhorroTotalCategoria, FechasAhorros, FechasIdeas, FechasPuntos, Historial, IdeasCN, PuntosArea, ReportesIdeas2, ReportesPuntos, Top10User } from '../../../../interfaces/reportes';
import { ReportesService } from '../../../../servicios/reportes.service';
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


  ahorros_categoria_data: AhorroTotalCategoria | null = null
  ahorros_categoria: AhorroCategoria[] | null = null
  total_ahorros_categoria: number = 0
  total_ahorros_categoria_dolares: number = 0
  ahorros_categoria_nombres: string[] = []
  ahorros_categoria_totalByArea: number[] = []

  nombresPersonalizados: Record<string, string> = {
    'ideas': 'Ideas generales',
    'lean': 'Lean workshops',
    'rh': 'Cambio de nivel de técnicos',
    'scrap': 'Scrap/CI',
    'oe': 'OE',
    'energia': 'Ahorro de energía',
  };




  ngOnInit(): void {
    this.initDate()
    this.ahorrosHistoricosPorCategoria()
    this.ahorrosPorCategoriaFechas()
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

  mostrarDatosFiltradosPorFecha() {
    this.cleanCharts()
    this.renderAhorrosFiltrados()
    this.ahorrosPorCategoriaFechas()
  }

  // Fuente de info
  async ahorrosHistoricos() {
    let self = this;
    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.ahorroHistorico().subscribe({
          next: (value: AhorroTotal) => {
            self.ahorros_data = value;
            self.ahorros = value.msg.ahorros_por_area
              .filter(area => area.nombre_area !== 'NULA')
              .map(area => ({
                ...area,
                valor_animado: 0
              }));

            self.total_ahorros = value.msg.total_ahorros;
            self.total_ahorros_dolares = value.msg.total_ahorros_usd;

            value.msg.ahorros_por_area.forEach(area => {
              const label = `${area.nombre_area} ($${area.total_ahorros} / $${area.total_ahorros_dolares} USD)`;
              self.ahorros_nombres.push(label);
              self.ahorros_totalByArea.push(area.total_ahorros);
            });

            const total = this.total_ahorros;
            self.ahorros_totalByArea.forEach(value => {
              self.pxt = (value / total) * 100;
              self.ahorros_percentages.push(this.pxt);
            });

            self.ahorros.forEach(area => {
              this.animarValor(area, 'total_ahorros_dolares', 'valor_animado');
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



  async ahorrosHistoricosPorCategoria() {
    let self = this;
    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.ahorroHistoricoPorCategoria().subscribe({
          next: (value: AhorroTotalCategoria) => {
            this.ahorros_categoria_data = value;

            this.ahorros_categoria = value.msg.ahorros_por_categoria.map(area => ({
              ...area,
              nombre_categoria: this.nombresPersonalizados[area.nombre_categoria?.toLowerCase()] || area.nombre_categoria,
              valor_animado: 0
            }));

            this.total_ahorros_categoria = value.msg.total_ahorros;
            this.total_ahorros_categoria_dolares = value.msg.total_ahorros_usd;

            this.ahorros_categoria.forEach(area => {
              this.animarValor(area, 'total_ahorros_dolares', 'valor_animado');
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

  async ahorrosPorCategoriaFechas() {
    let self = this;
    let fechas: FechasAhorros = {
      fecha_inicio: this.date0 ?? '',
      fecha_fin: this.date1 ?? ''
    };

    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.ahorroHistoricoPorCategoriaFechas(fechas).subscribe({
          next: (value: AhorroTotalCategoria) => {
            self.ahorros_categoria_data = value;
            self.ahorros_categoria = value.msg.ahorros_por_categoria
              .map(area => ({
                ...area,
                valor_animado: 0
              }));

            self.total_ahorros_categoria = value.msg.total_ahorros;
            self.total_ahorros_categoria_dolares = value.msg.total_ahorros_usd;


            self.ahorros_categoria.forEach(area => {
              this.animarValor(area, 'total_ahorros_dolares', 'valor_animado');
            });

          },
          error: (error) => reject(error)
        });
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async ahorrosFiltrados() {
    let self = this;
    let fechas: FechasAhorros = {
      fecha_inicio: this.date0 ?? '',
      fecha_fin: this.date1 ?? ''
    };

    try {
      return new Promise<void>((resolve, reject) => {
        this.reporteService.ahorro(fechas).subscribe({
          next: (value: AhorroTotal) => {
            self.ahorros_data = value;

            self.ahorros_nombres = [];
            self.ahorros_totalByArea = [];
            self.ahorros_percentages = [];

            self.ahorros = value.msg.ahorros_por_area
              .filter(area => area.nombre_area !== 'NULA')
              .map(area => ({
                ...area,
                valor_animado: 0
              }));

            self.total_ahorros = value.msg.total_ahorros;
            self.total_ahorros_dolares = value.msg.total_ahorros_usd;

            self.ahorros.forEach(area => {
              const label = `${area.nombre_area} ($${area.total_ahorros} / $${area.total_ahorros_dolares} USD)`;
              self.ahorros_nombres.push(label);
              self.ahorros_totalByArea.push(area.total_ahorros);
            });

            const total = self.total_ahorros;
            self.ahorros_totalByArea.forEach(value => {
              self.pxt = (value / total) * 100;
              self.ahorros_percentages.push(self.pxt);
            });

            self.ahorros.forEach(area => {
              this.animarValor(area, 'total_ahorros_dolares', 'valor_animado');
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
            'rgba(16,185,129,0.85)','rgba(59,130,246,0.85)','rgba(245,158,11,0.85)',
            'rgba(168,85,247,0.85)','rgba(20,184,166,0.85)','rgba(249,115,22,0.85)',
            'rgba(239,68,68,0.85)','rgba(236,72,153,0.85)','rgba(132,204,22,0.85)',
            'rgba(99,102,241,0.85)',
          ],
          borderColor: [
            'rgba(16,185,129,1)','rgba(59,130,246,1)','rgba(245,158,11,1)',
            'rgba(168,85,247,1)','rgba(20,184,166,1)','rgba(249,115,22,1)',
            'rgba(239,68,68,1)','rgba(236,72,153,1)','rgba(132,204,22,1)',
            'rgba(99,102,241,1)',
          ],
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 100,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { callback: (v: any) => v + '%' }
          },
          x: { grid: { display: false } }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.raw.toFixed(1)}%` } }
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
            'rgba(16,185,129,0.85)','rgba(59,130,246,0.85)','rgba(245,158,11,0.85)',
            'rgba(168,85,247,0.85)','rgba(20,184,166,0.85)','rgba(249,115,22,0.85)',
            'rgba(239,68,68,0.85)','rgba(236,72,153,0.85)','rgba(132,204,22,0.85)',
            'rgba(99,102,241,0.85)',
          ],
          borderColor: [
            'rgba(16,185,129,1)','rgba(59,130,246,1)','rgba(245,158,11,1)',
            'rgba(168,85,247,1)','rgba(20,184,166,1)','rgba(249,115,22,1)',
            'rgba(239,68,68,1)','rgba(236,72,153,1)','rgba(132,204,22,1)',
            'rgba(99,102,241,1)',
          ],
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 100,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { callback: (v: any) => v + '%' }
          },
          x: { grid: { display: false } }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.raw.toFixed(1)}%` } }
        }
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

  animarValor(obj: any, campoFinal: string, campoAnimado: string) {
    const duracion = 1000; // en ms
    const fps = 60;
    const pasos = duracion / (1000 / fps);
    const incremento = obj[campoFinal] / pasos;
    let contador = 0;

    const intervalo = setInterval(() => {
      contador++;
      obj[campoAnimado] += incremento;

      if (contador >= pasos) {
        obj[campoAnimado] = obj[campoFinal];
        clearInterval(intervalo);
      }
    }, 1000 / fps);
  }

}
