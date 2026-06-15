import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportesService } from '../../../../servicios/reportes.service';
import { FechasIdeas, ReportesIdeas, ReportesIdeas2 } from '../../../../interfaces/reportes';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface AreaCard {
  nombre: string;
  revision: number;
  aceptadas: number;
  implementadas: number;
  rechazadas: number;
  total: number;
}

interface MonthData {
  mes: number;
  nombre_mes: string;
  total_ideas: number;
  areas: Record<string, number>;
}

@Component({
  selector: 'app-reportes-ideas',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './reportes-ideas.component.html',
  styleUrl: './reportes-ideas.component.css'
})
export class ReportesIdeasComponent implements OnInit, OnDestroy {

  private readonly AREA_COLORS = [
    'rgba(59,130,246,0.85)',
    'rgba(239,68,68,0.85)',
    'rgba(16,185,129,0.85)',
    'rgba(245,158,11,0.85)',
    'rgba(168,85,247,0.85)',
    'rgba(20,184,166,0.85)',
    'rgba(249,115,22,0.85)',
    'rgba(236,72,153,0.85)',
    'rgba(132,204,22,0.85)',
    'rgba(99,102,241,0.85)',
  ];

  private readonly STATUS_COLORS = [
    'rgba(245,158,11,0.85)',
    'rgba(16,185,129,0.85)',
    'rgba(59,130,246,0.85)',
    'rgba(239,68,68,0.85)',
  ];

  // ---- Drill-down state ----
  drillLevel: 0 | 1 | 2 = 0;
  selectedYear: number = new Date().getFullYear();
  metaMensual: number = 0;
  loadingDrill = false;
  selectedMonth: MonthData | null = null;
  selectedArea: AreaCard | null = null;
  monthlyData: MonthData[] = [];
  annualAreas: string[] = [];
  level1Data: AreaCard[] = [];
  areasEstatus: AreaCard[] = [];

  // ---- Secondary charts ----
  date0: string | null = null;
  date1: string | null = null;
  total_ideas_contables: number = 0;
  total_ideas_no_contables: number = 0;
  private areas_cont_nombres: string[] = [];
  private accountable_percentages: number[] = [];
  private areas_non_nombres: string[] = [];
  private non_percentages: number[] = [];

  private drillChart: Chart | null = null;
  private contChart: Chart | null = null;
  private nonChart: Chart | null = null;

  constructor(private reporteService: ReportesService) {}

  // ---- Level-2 stats (stable array — never recreated on the fly to avoid CD loop) ----
  level2Stats: { label: string; count: number; pct: number; colorBg: string; colorBorder: string; colorText: string; colorBar: string }[] = [];

  private buildLevel2Stats(a: AreaCard): void {
    const t = a.total || 1;
    this.level2Stats = [
      { label: 'En revisión',   count: a.revision,      pct: Math.round((a.revision / t) * 100),      colorBg: 'bg-amber-50',  colorBorder: 'border-amber-200', colorText: 'text-amber-600',  colorBar: 'bg-amber-400' },
      { label: 'Aceptadas',     count: a.aceptadas,     pct: Math.round((a.aceptadas / t) * 100),      colorBg: 'bg-green-50',  colorBorder: 'border-green-200', colorText: 'text-green-600',  colorBar: 'bg-green-400' },
      { label: 'Implementadas', count: a.implementadas, pct: Math.round((a.implementadas / t) * 100),  colorBg: 'bg-blue-50',   colorBorder: 'border-blue-200',  colorText: 'text-blue-600',   colorBar: 'bg-blue-400' },
      { label: 'Rechazadas',    count: a.rechazadas,    pct: Math.round((a.rechazadas / t) * 100),     colorBg: 'bg-red-50',    colorBorder: 'border-red-200',   colorText: 'text-red-600',    colorBar: 'bg-red-400' },
    ];
  }

  get breadcrumb(): string[] {
    const c: string[] = [String(this.selectedYear)];
    if (this.selectedMonth) c.push(this.selectedMonth.nombre_mes);
    if (this.selectedArea) c.push(this.selectedArea.nombre);
    return c;
  }

  get chartTitle(): string {
    if (this.drillLevel === 0) return `Ideas registradas — ${this.selectedYear}`;
    if (this.drillLevel === 1) return `Áreas — ${this.selectedMonth?.nombre_mes} ${this.selectedYear}`;
    return `${this.selectedArea?.nombre} — ${this.selectedMonth?.nombre_mes} ${this.selectedYear}`;
  }

  // ---- Lifecycle ----
  ngOnInit(): void {
    this.metaMensual = parseInt(localStorage.getItem('premiatuidea_meta_mensual') ?? '0', 10) || 0;
    this.loadAnnualData();
    this.ideasHistoricasEstatusArea();
    this.renderIdeasContablesHistoricas();
    this.renderIdeasNoContablesHistoricas();
  }

  ngOnDestroy(): void {
    this.drillChart?.destroy();
    this.contChart?.destroy();
    this.nonChart?.destroy();
  }

  // ---- Meta mensual ----
  guardarMeta(): void {
    localStorage.setItem('premiatuidea_meta_mensual', this.metaMensual.toString());
    if (this.drillLevel === 0) {
      this.drillChart?.destroy();
      this.drillChart = null;
      setTimeout(() => this.renderLevel0(), 0);
    }
  }

  // ---- Drill navigation ----
  loadAnnualData(): void {
    this.loadingDrill = true;
    this.reporteService.ideasMensualesPorAnioYArea(this.selectedYear).subscribe({
      next: (data: any) => {
        this.monthlyData = data.meses;
        this.annualAreas = data.areas ?? [];
        this.drillLevel = 0;
        this.selectedMonth = null;
        this.selectedArea = null;
        this.loadingDrill = false;
        this.drillChart?.destroy();
        this.drillChart = null;
        setTimeout(() => this.renderLevel0(), 0);
      },
      error: err => { console.error(err); this.loadingDrill = false; }
    });
  }

  drillToMonth(month: MonthData): void {
    this.loadingDrill = true;
    const mes = String(month.mes).padStart(2, '0');
    const lastDay = new Date(this.selectedYear, month.mes, 0).getDate();
    const fecha_inicio = `${this.selectedYear}-${mes}-01`;
    const fecha_fin = `${this.selectedYear}-${mes}-${String(lastDay).padStart(2, '0')}`;

    this.reporteService.getIdeasHistoricasEstatusAreaFechas(fecha_inicio, fecha_fin).subscribe({
      next: (data: any) => {
        this.level1Data = (data.ideas_por_area as any[]).map(area => {
          const get = (n: string) =>
            area.estatus.find((e: any) => e.nombre_estatus?.toLowerCase() === n.toLowerCase())?.total_por_estatus ?? 0;
          const r = get('Revision'), a = get('Aceptada'), i = get('Implementada'), rec = get('Rechazada');
          return { nombre: area.nombre_area, revision: r, aceptadas: a, implementadas: i, rechazadas: rec, total: r + a + i + rec };
        });
        this.selectedMonth = month;
        this.drillLevel = 1;
        this.loadingDrill = false;
        this.drillChart?.destroy();
        this.drillChart = null;
        setTimeout(() => this.renderLevel1(), 0);
      },
      error: err => { console.error(err); this.loadingDrill = false; }
    });
  }

  areaColor(i: number): string {
    return this.AREA_COLORS[i % this.AREA_COLORS.length].replace('0.85', '1');
  }

  onCanvasClick(event: MouseEvent): void {
    if (!this.drillChart || this.loadingDrill) return;
    const elements = this.drillChart.getElementsAtEventForMode(
      event as any, 'nearest', { intersect: true }, false
    );
    if (!elements.length) return;
    const idx = elements[0].index;
    if (this.drillLevel === 0) {
      this.drillToMonth(this.monthlyData[idx]);
    } else if (this.drillLevel === 1) {
      this.drillToArea(this.level1Data[idx]);
    }
  }

  drillToArea(area: AreaCard): void {
    this.drillChart?.destroy();
    this.drillChart = null;
    this.selectedArea = area;
    this.buildLevel2Stats(area);
    this.drillLevel = 2;
    setTimeout(() => this.renderLevel2(), 0);
  }

  goBack(): void {
    this.drillChart?.destroy();
    this.drillChart = null;
    if (this.drillLevel === 2) {
      this.selectedArea = null;
      this.drillLevel = 1;
      setTimeout(() => this.renderLevel1(), 0);
    } else {
      this.selectedMonth = null;
      this.drillLevel = 0;
      setTimeout(() => this.renderLevel0(), 0);
    }
  }

  goToAnnual(): void {
    this.drillChart?.destroy();
    this.drillChart = null;
    this.drillLevel = 0;
    this.selectedMonth = null;
    this.selectedArea = null;
    setTimeout(() => this.renderLevel0(), 0);
  }

  goToMonth(): void {
    if (!this.selectedMonth || this.drillLevel !== 2) return;
    this.drillChart?.destroy();
    this.drillChart = null;
    this.selectedArea = null;
    this.drillLevel = 1;
    setTimeout(() => this.renderLevel1(), 0);
  }

  // ---- Chart renders ----
  private renderLevel0(): void {
    this.drillChart?.destroy();
    this.drillChart = null;

    const labels = this.monthlyData.map(m => m.nombre_mes);

    const areaDatasets: any[] = this.annualAreas.map((area, i) => ({
      type: 'bar',
      label: area,
      data: this.monthlyData.map(m => m.areas?.[area] ?? 0),
      backgroundColor: this.AREA_COLORS[i % this.AREA_COLORS.length],
      borderColor: this.AREA_COLORS[i % this.AREA_COLORS.length].replace('0.85', '1'),
      borderWidth: 0,
      borderRadius: i === this.annualAreas.length - 1 ? 4 : 0,
      stack: 'ideas',
    }));

    const datasets: any[] = [...areaDatasets];

    if (this.metaMensual > 0) {
      datasets.push({
        type: 'line',
        label: `Meta (${this.metaMensual})`,
        data: Array(12).fill(this.metaMensual),
        borderColor: 'rgba(239,68,68,0.9)',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [8, 4],
        pointRadius: 0,
        tension: 0,
        order: 0,
        stack: undefined,
      });
    }

    // Plugin inline: dibuja el total encima de cada barra apilada
    const stackTotalsPlugin: any = {
      id: 'stackTotals',
      afterDatasetsDraw(chart: any) {
        const ctx: CanvasRenderingContext2D = chart.ctx;
        const yScale = chart.scales['y'];
        if (!yScale) return;

        const numBars = (chart.data.labels || []).length;
        for (let i = 0; i < numBars; i++) {
          // Sumar solo datasets de tipo bar (excluir línea de meta)
          let total = 0;
          chart.data.datasets.forEach((ds: any, dsIdx: number) => {
            if (ds.type === 'line') return;
            if (chart.getDatasetMeta(dsIdx).hidden) return;
            total += Number(ds.data[i]) || 0;
          });
          if (total === 0) continue;

          // Obtener posición X del primer dataset bar
          let xPos: number | null = null;
          for (let d = 0; d < chart.data.datasets.length; d++) {
            if (chart.data.datasets[d].type === 'line') continue;
            const el = chart.getDatasetMeta(d).data[i];
            if (el) { xPos = el.x; break; }
          }
          if (xPos === null) continue;

          const yPos = yScale.getPixelForValue(total);
          ctx.save();
          ctx.fillStyle = '#1e3a8a';
          ctx.font = 'bold 11px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(String(total), xPos, yPos - 3);
          ctx.restore();
        }
      }
    };

    this.drillChart = new Chart('drillChart', {
      type: 'bar',
      data: { labels, datasets },
      plugins: [stackTotalsPlugin],
      options: {
        plugins: {
          legend: { display: true, position: 'top', labels: { boxWidth: 12, padding: 10, font: { size: 11 } } },
          tooltip: {
            mode: 'index',
            callbacks: {
              footer: () => '',
            }
          }
        },
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: { stacked: true, beginAtZero: true, ticks: { precision: 0 }, grid: { color: 'rgba(0,0,0,0.05)' } }
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  private renderLevel1(): void {
    this.drillChart?.destroy();
    this.drillChart = null;

    const labels = this.level1Data.map(a => a.nombre);
    const totals = this.level1Data.map(a => a.total);

    this.drillChart = new Chart('drillChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: `Ideas — ${this.selectedMonth?.nombre_mes}`,
          data: totals,
          backgroundColor: labels.map((_, i) => this.AREA_COLORS[i % this.AREA_COLORS.length]),
          borderColor: labels.map((_, i) => this.AREA_COLORS[i % this.AREA_COLORS.length].replace('0.85', '1')),
          borderWidth: 1,
          borderRadius: 6,
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              afterBody: () => [],
            }
          }
        },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: 'rgba(0,0,0,0.05)' } }
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  private renderLevel2(): void {
    this.drillChart?.destroy();
    this.drillChart = null;

    const area = this.selectedArea!;
    const total = area.total || 1;
    const labels = ['En revisión', 'Aceptadas', 'Implementadas', 'Rechazadas'];
    const values = [area.revision, area.aceptadas, area.implementadas, area.rechazadas];

    this.drillChart = new Chart('drillChart2', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: this.STATUS_COLORS,
          borderColor: this.STATUS_COLORS.map(c => c.replace('0.85', '1')),
          borderWidth: 1,
          borderRadius: 8,
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx: any) => {
                const count = ctx.raw as number;
                const pct = Math.round((count / total) * 100);
                return `  ${count} ideas — ${pct}% del total`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { precision: 0, stepSize: 1 },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          y: { grid: { display: false } }
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  // ---- Status cards data ----
  ideasHistoricasEstatusArea(): void {
    this.reporteService.getIdeasHistoricasEstatusArea().subscribe({
      next: (data: any) => { this.areasEstatus = this.mapAreaData(data.ideas_por_area); },
      error: err => console.error(err)
    });
  }

  ideasHistoricasEstatusAreaFechas(): void {
    if (!this.date0 || !this.date1) return;
    this.reporteService.getIdeasHistoricasEstatusAreaFechas(this.date0, this.date1).subscribe({
      next: (data: any) => { this.areasEstatus = this.mapAreaData(data.ideas_por_area); },
      error: err => console.error(err)
    });
  }

  private mapAreaData(raw: any[]): AreaCard[] {
    return raw.map(area => {
      const get = (n: string) =>
        area.estatus.find((e: any) => e.nombre_estatus?.toLowerCase() === n.toLowerCase())?.total_por_estatus ?? 0;
      const r = get('Revision'), a = get('Aceptada'), i = get('Implementada'), rec = get('Rechazada');
      return { nombre: area.nombre_area, revision: r, aceptadas: a, implementadas: i, rechazadas: rec, total: r + a + i + rec };
    });
  }

  // ---- Secondary charts ----
  mostrarDatosFiltrados(): void {
    this.cleanSecondaryCharts();
    this.renderIdeasContablesFiltradas();
    this.renderIdeasNoContablesFiltradas();
    this.ideasHistoricasEstatusAreaFechas();
  }

  mostrarDatosHistoricos(): void {
    this.cleanSecondaryCharts();
    this.ideasHistoricasEstatusArea();
    this.renderIdeasContablesHistoricas();
    this.renderIdeasNoContablesHistoricas();
  }

  private cleanSecondaryCharts(): void {
    this.contChart?.destroy(); this.contChart = null;
    this.nonChart?.destroy(); this.nonChart = null;
    this.areas_cont_nombres = []; this.accountable_percentages = [];
    this.areas_non_nombres = []; this.non_percentages = [];
    this.total_ideas_contables = 0;
    this.total_ideas_no_contables = 0;
  }

  private buildBarChart(canvasId: string, labels: string[], data: number[], label: string, existing: Chart | null): Chart {
    existing?.destroy();
    return new Chart(canvasId, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label,
          data,
          backgroundColor: this.AREA_COLORS,
          borderColor: this.AREA_COLORS.map(c => c.replace('0.85', '1')),
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        scales: { y: { beginAtZero: true, min: 0, max: 100, ticks: { precision: 1 } } },
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  async renderIdeasContablesHistoricas(): Promise<void> {
    await new Promise<void>((res, rej) => {
      this.reporteService.ideasContablesHistoricas().subscribe({
        next: (v: ReportesIdeas2) => {
          this.total_ideas_contables = v.total_ideas;
          const total = v.ideas_por_area.reduce((s, a) => s + a.total_ideas, 0);
          v.ideas_por_area.forEach(a => {
            this.areas_cont_nombres.push(`${a.nombre_area} (${a.total_ideas})`);
            this.accountable_percentages.push(total > 0 ? Math.round((a.total_ideas / total) * 100) : 0);
          });
          res();
        },
        error: rej
      });
    }).catch(console.error);
    this.contChart = this.buildBarChart('ideasContables', this.areas_cont_nombres, this.accountable_percentages, '% Ideas contables', this.contChart);
  }

  async renderIdeasContablesFiltradas(): Promise<void> {
    const fechas: FechasIdeas = { fecha_inicio: this.date0 ?? '', fecha_fin: this.date1 ?? '' };
    await new Promise<void>((res, rej) => {
      this.reporteService.ideasContables(fechas).subscribe({
        next: (v: ReportesIdeas2) => {
          this.total_ideas_contables = v.total_ideas;
          const total = v.ideas_por_area.reduce((s, a) => s + a.total_ideas, 0);
          v.ideas_por_area.forEach(a => {
            this.areas_cont_nombres.push(`${a.nombre_area} (${a.total_ideas})`);
            this.accountable_percentages.push(total > 0 ? Math.round((a.total_ideas / total) * 100) : 0);
          });
          res();
        },
        error: rej
      });
    }).catch(console.error);
    this.contChart = this.buildBarChart('ideasContables', this.areas_cont_nombres, this.accountable_percentages, '% Ideas contables', this.contChart);
  }

  async renderIdeasNoContablesHistoricas(): Promise<void> {
    await new Promise<void>((res, rej) => {
      this.reporteService.ideasNoContablesHistoricas().subscribe({
        next: (v: ReportesIdeas) => {
          this.total_ideas_no_contables = v.msg.total_ideas;
          const total = v.msg.ideas_por_area.reduce((s, a) => s + a.total_ideas, 0);
          v.msg.ideas_por_area.forEach(a => {
            this.areas_non_nombres.push(`${a.nombre_area} (${a.total_ideas})`);
            this.non_percentages.push(total > 0 ? Math.round((a.total_ideas / total) * 100) : 0);
          });
          res();
        },
        error: rej
      });
    }).catch(console.error);
    this.nonChart = this.buildBarChart('ideasNoContables', this.areas_non_nombres, this.non_percentages, '% Ideas no contables', this.nonChart);
  }

  async renderIdeasNoContablesFiltradas(): Promise<void> {
    const fechas: FechasIdeas = { fecha_inicio: this.date0 ?? '', fecha_fin: this.date1 ?? '' };
    await new Promise<void>((res, rej) => {
      this.reporteService.ideasNoContables(fechas).subscribe({
        next: (v: ReportesIdeas) => {
          this.total_ideas_no_contables = v.msg.total_ideas;
          const total = v.msg.ideas_por_area.reduce((s, a) => s + a.total_ideas, 0);
          v.msg.ideas_por_area.forEach(a => {
            this.areas_non_nombres.push(`${a.nombre_area} (${a.total_ideas})`);
            this.non_percentages.push(total > 0 ? Math.round((a.total_ideas / total) * 100) : 0);
          });
          res();
        },
        error: rej
      });
    }).catch(console.error);
    this.nonChart = this.buildBarChart('ideasNoContables', this.areas_non_nombres, this.non_percentages, '% Ideas no contables', this.nonChart);
  }
}
