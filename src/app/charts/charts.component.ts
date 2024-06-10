import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { UsersService } from '../servicios/users.service';
import { Usuario } from '../interfaces/user';
import { UsersList } from '../interfaces/user';
import { AppNavbarComponent } from '../vistas/app-navbar/app-navbar.component';
Chart.register(...registerables)
@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [AppNavbarComponent],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent implements OnInit{
  ngOnInit(): void {
    const ctx = document.getElementById('myChart');
    //"ctx" hace referencia al id del componente canvas
    
      const myChart = new Chart("ctx", {
          type: 'bar',
          data: {
              labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
              datasets: [{
                  label: '# of Votes',
                  data: [12, 19, 3, 5, 2, 3],
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
                      beginAtZero: true
                  }
              }
          }
      });


  }
 
}
