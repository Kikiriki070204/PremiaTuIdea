import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ReportesService } from '../../../../servicios/reportes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reportes-bonos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes-bonos.component.html',
  styleUrl: './reportes-bonos.component.css'
})
export class ReportesBonosComponent implements OnInit {

  date0: string | null = null
  date1: string | null = null
  fecha_inicio: string | null = null
  fecha_fin: string | null = null
  data: any

  chartBonosRef: Chart | null = null;


  constructor(private reporteService: ReportesService) { }
  ngOnInit(): void {
    this.mostrarDatosHistoricos();
  }

  mostrarDatosHistoricos() {
    this.cleanChart()
    this.getUsuariosBonos();
  }

  mostrarDatosFiltrados() {
    this.cleanChart();
    this.getUsuariosBonosFiltrados()
  }

  cleanChart() {
    const existingChartUsuariosBonos = Chart.getChart('bonoUsuariosChart');
    if (existingChartUsuariosBonos) {
      existingChartUsuariosBonos.destroy();
    }
  }

  getUsuariosBonos() {
    this.reporteService.getUsuariosBonos().subscribe({
      next: (res) => {
        this.data = res
        this.crearGraficaBonosUsuarios(res.top_usuarios);
      },
      error: (err) => console.error(err)
    });
  }

  getUsuariosBonosFiltrados() {
    this.reporteService.getUsuariosBonos(this.date0, this.date1).subscribe({
      next: (res) => {
        this.data = res;
        this.crearGraficaBonosUsuarios(res.top_usuarios);
      },
      error: err => console.error(err)
    });
  }


  crearGraficaBonosUsuarios(data: any[]) {
    const nombres = data.map(u => u.nombre);
    const bonosMXN = data.map(u => u.bono_mxn);
    const bonosUSD = data.map(u => u.bono_usd); // para el tooltip

    if (this.chartBonosRef) {
      this.chartBonosRef.destroy();
      this.chartBonosRef = null;
    }

    const canvas = document.getElementById('bonoUsuariosChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas no encontrado');
      return;
    }

    new Chart('bonoUsuariosChart', {
      type: 'bar',
      data: {
        labels: nombres,
        datasets: [{
          label: 'Bonos (MXN)',
          data: bonosMXN,
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
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const index = context.dataIndex;
                const mxn = bonosMXN[index].toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                const usd = bonosUSD[index].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                return [`${mxn} MXN`, `${usd} USD`];
              }
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });
  }


}
