import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { NgFor } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ReportesService } from '../../servicios/reportes.service';
import { IdeasCN } from '../../interfaces/reportes';
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
  areas_cont_data: IdeasCN[] | null = null
  areas_non_nombres: string[] = []
  areas_non_ideas: number[] = []
  percentages: number[] = []
  areas_non_data: IdeasCN[] | null = null
  totalIdeas: number | null = 0
  pxt: number = 0
  labels: string[] = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']
  ctx = document.getElementById('myChart');
  constructor(protected reporteService: ReportesService){}

  ngOnInit(): void {

     this.ideasNoContables()
     console.log(this.labels)
     console.log(this.areas_non_nombres)
     console.log("PORCENTAJES")
     console.log(this.percentages)
    this.renderNotAccountable()
    }
    
  //TOP 10 USUARIOS CON MAS PUNTOS 



  //AHORRO POR AREA


  //IDEAS POR AREA  
  ideasContables() {
    let self = this
    return new Promise<void>((resolve, reject) => {
      this.reporteService.ideasContables().subscribe({
        next: (value: ReportesIdeas) => {
          self.areas_non_data = value.msg.ideas_por_area
        console.log(self.areas_non_data)
        value.msg.ideas_por_area.forEach(
          area =>{
            self.areas_non_nombres.push(area.nombre_area)
            self.areas_cont_ideas.push(area.total_ideas)
          })
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
              self.areas_non_nombres.push(area.nombre_area)
              self.areas_non_ideas.push(area.total_ideas)
            }
          )
          const totalIdeas = this.areas_non_ideas.reduce((acc, value) => acc + value, 0);
          this.areas_non_ideas.forEach(value => {
            self.pxt = (value / totalIdeas) * 100
            self.percentages.push(this.pxt)
          });
            resolve();
          },
          error: (error) => reject(error)
        });
      });
    }
    

    renderNotAccountable()
    {
      const myChart = new Chart("ctx", {
        type: 'bar',
        data: {
            labels: this.areas_non_nombres,
            datasets: [{
                label: '% of Ideas',
                data: this.percentages,
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
