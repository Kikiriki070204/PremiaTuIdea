import { Component } from '@angular/core';
import { ReportesService } from '../../../../servicios/reportes.service';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-reportes-premios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes-premios.component.html',
  styleUrl: './reportes-premios.component.css'
})
export class ReportesPremiosComponent {
  cambiarTipo() {
    this.chartType = this.chartType === 'bar' ? 'doughnut' : 'bar';
    this.chart.destroy();
    this.renderProductosChart();
  }

  animPremiosEntregados = 0;
  animPremiosProceso = 0;
  animUsuarios = 0;
  animTotalMXN = 0;
  resumenPremios: any;

  chart: any;
  chartType: 'bar' | 'doughnut' = 'bar';

  constructor(private reportesService: ReportesService) { }

  ngOnInit(): void {
    this.getResumenPremios();
    this.renderProductosChart();
  }

  getResumenPremios() {

    this.reportesService.getResumenPremios().subscribe({
      next: (data) => {
        this.resumenPremios = data;

        this.animateNumber(data.premios_entregados, 800, val => this.animPremiosEntregados = val);
        this.animateNumber(data.premios_en_proceso, 800, val => this.animPremiosProceso = val);
        this.animateNumber(data.usuarios_canjeadores, 800, val => this.animUsuarios = val);
        this.animateNumber(data.valor_total_canjeado, 1000, val => this.animTotalMXN = val);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  renderProductosChart(): void {
    this.reportesService.getTopProductosEntregados().subscribe({
      next: (res: any) => {
        const productos = res.top_productos_entregados;

        const labels = productos.map((p: any) => p.nombre_producto);
        const data = productos.map((p: any) => p.cantidad_entregada);

        const backgroundColors = [
          'rgba(99,102,241,0.85)','rgba(59,130,246,0.85)','rgba(16,185,129,0.85)',
          'rgba(245,158,11,0.85)','rgba(168,85,247,0.85)','rgba(20,184,166,0.85)',
          'rgba(249,115,22,0.85)','rgba(236,72,153,0.85)','rgba(132,204,22,0.85)',
          'rgba(239,68,68,0.85)',
        ];
        const borderColors = [
          'rgba(99,102,241,1)','rgba(59,130,246,1)','rgba(16,185,129,1)',
          'rgba(245,158,11,1)','rgba(168,85,247,1)','rgba(20,184,166,1)',
          'rgba(249,115,22,1)','rgba(236,72,153,1)','rgba(132,204,22,1)',
          'rgba(239,68,68,1)',
        ];

        const canvas = document.getElementById('topProductosChart') as HTMLCanvasElement;

        this.chart = new Chart(canvas, {
          type: this.chartType,
          data: {
            labels: labels,
            datasets: [{
              label: 'Total entregados',
              data: data,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            animation: {
              duration: 1000,
              easing: 'easeOutQuart',
              animateScale: true,
              animateRotate: false
            },
            plugins: {
              title: {
                display: true,
                color: '#1E3A8A',
                font: {
                  size: 18
                }
              },
              legend: {
                display: this.chartType !== 'bar'
              },
              tooltip: {
                callbacks: {
                  label: (context: any) => `${context.label}: ${context.raw}`
                }
              }
            },
            scales: this.chartType === 'bar' ? {
              y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
              x: { grid: { display: false } }
            } : undefined
          }
        });
      },
      error: err => console.error(err)
    });
  }

  animateNumber(
    target: number,
    duration: number,
    callback: (current: number) => void
  ) {
    const frameRate = 30;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const current = Math.round(target * progress);

      callback(current);

      if (frame >= totalFrames) {
        clearInterval(counter);
        callback(target);
      }
    }, frameRate);
  }

}
