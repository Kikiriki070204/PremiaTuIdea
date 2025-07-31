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
          'rgba(35, 52, 188, 1)', 'rgba(176, 21, 63, 1)', 'rgba(29, 232, 50, 1)',
          'rgba(235, 235, 28, 1)', 'rgba(294, 97, 7, 1)', 'rgba(33, 147, 8, 1)',
          'rgba(0, 191, 255, 1)', 'rgba(213, 14, 192, 1)', 'rgba(231, 207, 7, 1)',
          'rgba(185, 178, 122, 1)'
        ];
        const borderColors = backgroundColors.map(color => color.replace('1)', '0.4)'));

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
              borderWidth: 1
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
