import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ReportesService } from '../../servicios/reportes.service';
import { AhorroArea, AhorroTotal, FechasAhorros, FechasIdeas, FechasPuntos, Historial, IdeasCN, PuntosArea, ReportesIdeas2, ReportesPuntos, Top10User } from '../../interfaces/reportes';
import { ReportesIdeas } from '../../interfaces/reportes';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';
Chart.register(...registerables)

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [AppNavbarComponent, NgFor, ReactiveFormsModule, FormsModule, NgIf, NgClass],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit{

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

  date0:string | null = null
  date1:string | null = null

  areas_cont_nombres: string[] = []
  areas_cont_ideas: number[] = []
  areas_non_nombres: string[] = []
  areas_non_ideas: number[] = []
  accountable_percentages: number[] = []
  non_percentages: number[] = []

  //Ideas Contables y No contables
  areas_non_data: IdeasCN[] | null = null
  areas_cont_data: IdeasCN[] | null = null

  //Puntos por Area
  puntos_non_data: PuntosArea[] | null = null
  puntos_cont_data: PuntosArea[] | null = null
  total_puntos_unacountable: number = 0
  total_puntos_countable: number = 0
  total_cont_puntos: number[] = []
  total_non_puntos: number[] = []
  puntos_areas_nombres_cont: string[] = []
  puntos_areas_nombres: string[] = []
  non_percentages_puntos: number[] = []
  percentages_puntos: number[] = []

  fecha_inicio: string|null = null
  fecha_fin: string|null = null
  //Top10
  top10: Top10User[] | null = null
  top10_data: Historial | null = null
  top10_nombres: string[] = []
  top10_users_points: number[] = []
  top10_max: number = 0

  //Ahorros
  ahorros: AhorroArea[] | null = null
  ahorros_data: AhorroTotal | null = null
  ahorros_nombres: string[] = []
  ahorros_totalByArea: number[] = []
  ahorros_percentages: number[] = []
  total_ahorros: number = 0

  pxt: number = 0
  ctx = document.getElementById('myChart');
  tab: number = 0
  constructor(protected reporteService: ReportesService){}

  ngOnInit(): void {
  this.initDate()
  }
    

  renderHistorialsByDate()
  {
    this.cleanCharts()
    this.renderHistorial()
    this.renderPuntosContables()
    this.renderPuntosNoContables()
  }

  renderIdeasByDate()
  {
    this.cleanCharts()
    this.renderAccountable()
    this.renderNotAccountable()
  }
  
  renderSavingsByDate()
  {
    this.cleanCharts()
    this.renderAhorros()
  }

  //TOP 10 USUARIOS CON MAS PUNTOS 
  async historial(){
    let self = this
    console.log(this.date0);
    console.log(this.date1);
    let fechas: FechasPuntos = {
      fecha_inicio: this.date0 ?? '',
      fecha_fin: this.date1 ?? ''
    }
  try{
     return new Promise<void>((resolve, reject) => {
      this.reporteService.top10(fechas).subscribe({
        next: (value: Historial) => {
          self.top10_data = value
        value.historial.forEach(
          user =>{
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

  async renderHistorial()
  {

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
      }
        
      }
  });
  }

  cleanCharts()
  {
    const existingChartHistorial = Chart.getChart('top10');
    if (existingChartHistorial) {
        existingChartHistorial.destroy();
        this.top10 = null
        this.top10_data =null
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
        this.total_puntos_unacountable = 0
        this.total_non_puntos = []
        this.puntos_areas_nombres = []
        this.non_percentages_puntos = []
    }
  }
  
  //PUNTOS POR AREA (contables y no contables)
  async puntosContables(){
    let self = this
    let fechas: FechasPuntos = {
      fecha_inicio: this.date0 ?? '',
      fecha_fin: this.date1 ?? ''
    }
try{
  return new Promise<void>((resolve, reject) => {
    this.reporteService.puntosContables(fechas).subscribe({
      next: (value: ReportesPuntos) => {
        
      self.puntos_cont_data = value.msg.puntos_por_area
      self.total_puntos_countable = value.msg.total_puntos
      value.msg.puntos_por_area.forEach(
        area =>{
          self.puntos_areas_nombres_cont.push(area.nombre_area + " ("+area.total_puntos+" puntos)")
          self.total_cont_puntos.push(area.total_puntos)
        }
      )
      this.total_cont_puntos.forEach(value => {
        self.pxt = (value *100)/ this.total_puntos_countable
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

async puntosNoContables(){
  let self = this
  let fechas: FechasPuntos = {
    fecha_inicio: this.date0 ?? '',
    fecha_fin: this.date1 ?? ''
  }
try{
  return new Promise<void>((resolve, reject) => {
    this.reporteService.puntosNoContables(fechas).subscribe({
      next: (value: ReportesPuntos) => {
        
      self.puntos_non_data = value.msg.puntos_por_area
      console.log(self.puntos_non_data)
      self.total_puntos_unacountable = value.msg.total_puntos
      value.msg.puntos_por_area.forEach(
        area =>{
          self.puntos_areas_nombres.push(area.nombre_area + " ("+area.total_puntos+" puntos)")
          self.total_non_puntos.push(area.total_puntos)
        }
      )
      this.total_non_puntos.forEach(value => {
        self.pxt = (value *100)/ this.total_puntos_unacountable
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


async renderPuntosContables()
    {
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


async renderPuntosNoContables()
    {
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


  //AHORRO POR AREA


  //IDEAS POR AREA  (contables y no contables)
  async ideasContables() {
    let self = this
    let fechas: FechasIdeas = {
      fecha_inicio: this.date0 ?? '',
      fecha_fin: this.date1 ?? ''
    }
    try{
    return new Promise<void>((resolve, reject) => {
      this.reporteService.ideasContables(fechas).subscribe({
        next: (value: ReportesIdeas2) => {
          self.areas_cont_data = value.ideas_por_area
        console.log(self.areas_cont_data)
        value.ideas_por_area.forEach(
          area =>{
            self.areas_cont_nombres.push(area.nombre_area + " ("+area.total_ideas+" ideas)")
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
  catch(error) {
    console.error('Error fetching data:', error);
    }  
  }



    async ideasNoContables() {
      let self = this
      let fechas: FechasIdeas = {
        fecha_inicio: this.date0 ?? '',
        fecha_fin: this.date1 ?? ''
      }
      try{
      return new Promise<void>((resolve, reject) => {
        this.reporteService.ideasNoContables(fechas).subscribe({
          next: (value: ReportesIdeas) => {
            
          self.areas_non_data = value.msg.ideas_por_area
          console.log(self.areas_non_data)
          value.msg.ideas_por_area.forEach(
            area =>{
              self.areas_non_nombres.push(area.nombre_area + " ("+area.total_ideas+" ideas)")
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
    
    async renderAccountable()
    {
      await this.ideasContables()

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
            }
        }
    });
  }


    async renderNotAccountable()
    {
      await this.ideasNoContables()

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
            }
        }
    });
  }


  //Ahorro por area
  async ahorroTotal() {
    let self = this
    let fechas: FechasAhorros = {
      fecha_inicio: this.date0 ?? '',
      fecha_fin: this.date1 ?? ''
    }
    try{
    return new Promise<void>((resolve, reject) => {
      this.reporteService.ahorro(fechas).subscribe({
        next: (value: AhorroTotal) => {
        self.ahorros_data = value
        self.ahorros = value.msg.ahorros_por_area
        self.total_ahorros = value.msg.total_ahorros
        value.msg.ahorros_por_area.forEach(
          area =>{
            self.ahorros_nombres.push(area.nombre_area + " ($"+area.total_ahorros+")")
            self.ahorros_totalByArea.push(area.total_ahorros)
          })
          const total= this.total_ahorros
          self.ahorros_totalByArea.forEach(value => {
            self.pxt = (value / total ) * 100
            self.ahorros_percentages.push(this.pxt)
          });
          resolve();
        },
        error: (error) => reject(error)
      });
    });
  }
  catch(error) {
    console.error('Error fetching data:', error);
    }  
    }

    async renderAhorros()
    {
      await this.ahorroTotal()

      const myChart = new Chart("ahorro", {
        type: 'bar',
        data: {
            labels: this.ahorros_nombres,
            datasets: [{
                label: '% of savings',
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



    //calendario

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
      for ( var i=1; i <= dayOfWeek; i++) {
        blankdaysArray.push(i);
      }
  
      let daysArray = [];
      for ( var i=1; i <= daysInMonth; i++) {
        daysArray.push(i);
      }
  
      this.blankdays = blankdaysArray;
      this.no_of_days = daysArray;
    }
    
    puntosClick()
    {
      this.tab = 0
      console.log(this.tab)
    }

    ideasClick()
    {
      this.tab = 1
      console.log(this.tab)
    }
    ahorrosClick()
    {
      this.tab = 2
      console.log(this.tab)
    }


    //hola, este calendario NO es de mi propiedad, lo saqué por completo de la sig. página:
        //https://stackblitz.com/edit/angular-tailwind-datepicker?file=src%2Fapp%2Fapp.component.ts
}
