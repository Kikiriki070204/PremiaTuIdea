import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { NgFor } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ReportesService } from '../../servicios/reportes.service';
import { Historial, IdeasCN, PuntosArea, ReportesPuntos, Top10User } from '../../interfaces/reportes';
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

  pxt: number = 0
  ctx = document.getElementById('myChart');
  constructor(protected reporteService: ReportesService){}

  ngOnInit(): void {
  this.renderHistorial()
  this.renderPuntosNoContables()
  this.renderPuntosContables()
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
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)',
                  'rgba(0, 128, 0, 0.2)', // Nuevo color
                  'rgba(255, 0, 0, 0.2)', // Nuevo color
                  'rgba(0, 0, 255, 0.2)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)',
                'rgb(0, 128, 0)', // Nuevo color
                'rgb(255, 0, 0)', // Nuevo color
                'rgb(0, 0, 255)' 
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
                    'rgba(0, 128, 0, 0.2)', 
                    'rgba(255, 0, 0, 0.2)', 
                    'rgba(0, 0, 255, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgb(0, 128, 0)', 
                    'rgb(255, 0, 0)', 
                    'rgb(0, 0, 255)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
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
                    'rgba(0, 128, 0, 0.2)', 
                    'rgba(255, 0, 0, 0.2)', 
                    'rgba(0, 0, 255, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgb(0, 128, 0)', 
                    'rgb(255, 0, 0)', 
                    'rgb(0, 0, 255)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
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
  ideasContables() {
    let self = this
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



    ideasNoContables() {
      let self = this
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
    
    renderAccountable()
    {
      this.ideasContables()

      const myChart = new Chart("countable", {
        type: 'bar',
        data: {
            labels: this.areas_cont_nombres,
            datasets: [{
                label: '% of Ideas',
                data: this.accountable_percentages,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
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


    renderNotAccountable()
    {
      this.ideasNoContables()

      const myChart = new Chart("ctx", {
        type: 'bar',
        data: {
            labels: this.areas_non_nombres,
            datasets: [{
                label: '% of Ideas',
                data: this.non_percentages,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
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
