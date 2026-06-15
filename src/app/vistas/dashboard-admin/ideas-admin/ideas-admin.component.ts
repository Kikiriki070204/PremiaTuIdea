import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { IdeasService } from '../../../servicios/ideas.service';
import { ExportExcelService } from '../../../servicios/export-excel.service';
import { IdeasRevisionAdminComponent } from './ideas-revision-admin/ideas-revision-admin.component';

@Component({
  selector: 'app-ideas-admin',
  standalone: true,
  imports: [RouterLink, RouterModule, FormsModule, CommonModule, IdeasRevisionAdminComponent],
  templateUrl: './ideas-admin.component.html',
  styleUrl: './ideas-admin.component.css'
})
export class IdeasAdminComponent implements OnInit {

  showExportModal = false;
  exportMode: 'all' | 'filtered' = 'all';
  isExporting = false;

  expRevision = true;
  expAceptadas = true;
  expImplementadas = true;
  expRechazadas = true;
  expCategoria = 0;
  expArea: number | null = null;
  expDateFrom = '';
  expDateTo = '';

  constructor(
    protected router: Router,
    private ideaService: IdeasService,
    private exportService: ExportExcelService,
  ) { }

  ngOnInit(): void { }

  openExportModal(): void {
    this.exportMode = 'all';
    this.expRevision = true;
    this.expAceptadas = true;
    this.expImplementadas = true;
    this.expRechazadas = true;
    this.expCategoria = 0;
    this.expArea = null;
    this.expDateFrom = '';
    this.expDateTo = '';
    this.showExportModal = true;
  }

  closeExportModal(): void {
    this.showExportModal = false;
  }

  private fetchByStatus(estatus: number): Promise<any[]> {
    return new Promise(resolve => {
      (this.ideaService.ideasByStatus(estatus, 1) as any).subscribe({
        next: (res: any) => {
          const first: any[] = res?.ideas?.data ?? [];
          const lastPage: number = res?.ideas?.last_page ?? 1;
          if (lastPage <= 1) { resolve(first); return; }
          const reqs = Array.from({ length: lastPage - 1 }, (_, i) =>
            (this.ideaService.ideasByStatus(estatus, i + 2) as any)
              .pipe(map((r: any) => r?.ideas?.data ?? []))
          );
          forkJoin(reqs).subscribe({
            next: (pages: any) => resolve([...first, ...(pages as any[]).flat()]),
            error: () => resolve(first),
          });
        },
        error: () => resolve([]),
      });
    });
  }

  private fetchByCategory(estatus: number, categoria: number, area: number | null): Promise<any[]> {
    return new Promise(resolve => {
      (this.ideaService.ideasByStatusAndCategory(estatus, categoria, 1, area) as any).subscribe({
        next: (res: any) => {
          const first: any[] = res?.ideas?.data ?? [];
          const lastPage: number = res?.ideas?.last_page ?? 1;
          if (lastPage <= 1) { resolve(first); return; }
          const reqs = Array.from({ length: lastPage - 1 }, (_, i) =>
            (this.ideaService.ideasByStatusAndCategory(estatus, categoria, i + 2, area) as any)
              .pipe(map((r: any) => r?.ideas?.data ?? []))
          );
          forkJoin(reqs).subscribe({
            next: (pages: any) => resolve([...first, ...(pages as any[]).flat()]),
            error: () => resolve(first),
          });
        },
        error: () => resolve([]),
      });
    });
  }

  async exportar(): Promise<void> {
    const statusList = this.exportMode === 'all'
      ? [1, 2, 3, 4]
      : [
          ...(this.expRevision ? [1] : []),
          ...(this.expAceptadas ? [2] : []),
          ...(this.expImplementadas ? [3] : []),
          ...(this.expRechazadas ? [4] : []),
        ];

    if (statusList.length === 0) return;

    this.isExporting = true;
    try {
      let allIdeas: any[] = [];

      for (const estatus of statusList) {
        let ideas: any[];
        if (this.exportMode === 'all' || this.expCategoria === 0) {
          ideas = await this.fetchByStatus(estatus);
        } else {
          ideas = await this.fetchByCategory(estatus, this.expCategoria, this.expArea);
        }
        allIdeas = [...allIdeas, ...ideas];
      }

      if (this.exportMode === 'filtered' && (this.expDateFrom || this.expDateTo)) {
        allIdeas = allIdeas.filter(idea => {
          const d = (idea.created_at ?? '').slice(0, 10);
          if (this.expDateFrom && d < this.expDateFrom) return false;
          if (this.expDateTo && d > this.expDateTo) return false;
          return true;
        });
      }

      const today = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
      this.exportService.exportIdeas(allIdeas, today);
      this.closeExportModal();
    } finally {
      this.isExporting = false;
    }
  }
}
