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
            'rgba(168,85,247,0.85)','rgba(59,130,246,0.85)','rgba(236,72,153,0.85)',
            'rgba(245,158,11,0.85)','rgba(16,185,129,0.85)','rgba(249,115,22,0.85)',
            'rgba(239,68,68,0.85)','rgba(20,184,166,0.85)','rgba(132,204,22,0.85)',
            'rgba(99,102,241,0.85)',
          ],
          borderColor: [
            'rgba(168,85,247,1)','rgba(59,130,246,1)','rgba(236,72,153,1)',
            'rgba(245,158,11,1)','rgba(16,185,129,1)','rgba(249,115,22,1)',
            'rgba(239,68,68,1)','rgba(20,184,166,1)','rgba(132,204,22,1)',
            'rgba(99,102,241,1)',
          ],
          borderWidth: 1,
          borderRadius: 6
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
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          y: { grid: { display: false } }
        }
      }
    });
  }


}
