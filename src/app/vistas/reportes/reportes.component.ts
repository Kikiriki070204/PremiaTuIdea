import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { NgFor } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ReportesService } from '../../servicios/reportes.service';
import { AhorroArea, AhorroTotal, Historial, IdeasCN, PuntosArea, ReportesPuntos, Top10User } from '../../interfaces/reportes';
import { ReportesIdeas } from '../../interfaces/reportes';
Chart.register(...registerables)

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [AppNavbarComponent, NgFor],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit{

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
  constructor(protected reporteService: ReportesService){}

  ngOnInit(): void {
  this.renderHistorial()
  this.renderPuntosNoContables()
  this.renderPuntosContables()
  this.renderNotAccountable()
  this.renderAccountable()
  this.renderAhorros()
  }
    
  //TOP 10 USUARIOS CON MAS PUNTOS 
  async historial(){
    let self = this
  try{
     return new Promise<void>((resolve, reject) => {
      this.reporteService.top10().subscribe({
        next: (value: Historial) => {
          self.top10_data = value
        value.historial.forEach(
          user =>{
            self.top10_nombres.push(user.nombre)
            self.top10_users_points.push(user.puntos)
          })
          const PuntosMax = Math.max(...this.top10_users_points)
          this.top10_max = PuntosMax
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
    await this.historial();
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
  
  //PUNTOS POR AREA (contables y no contables)
  async puntosContables(){
    let self = this
try{
  return new Promise<void>((resolve, reject) => {
    this.reporteService.puntosContables().subscribe({
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
try{
  return new Promise<void>((resolve, reject) => {
    this.reporteService.puntosNoContables().subscribe({
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
    try{
    return new Promise<void>((resolve, reject) => {
      this.reporteService.ideasContables().subscribe({
        next: (value: ReportesIdeas) => {
          self.areas_cont_data = value.msg.ideas_por_area
        console.log(self.areas_cont_data)
        value.msg.ideas_por_area.forEach(
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
      try{
      return new Promise<void>((resolve, reject) => {
        this.reporteService.ideasNoContables().subscribe({
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
    try{
    return new Promise<void>((resolve, reject) => {
      this.reporteService.ahorro().subscribe({
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


}
