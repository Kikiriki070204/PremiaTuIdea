import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx-js-style';

@Injectable({ providedIn: 'root' })
export class ExportExcelService {

  private readonly CATEGORIAS: Record<number, string> = {
    1: 'Ideas de mejora', 2: 'Lean workshops', 3: 'Cambio nivel técnicos',
    4: 'Scrap/CI', 5: 'OE', 10: 'Ahorro de energía'
  };

  private readonly AREAS: Record<number, string> = {
    1: 'Exhaust', 2: 'Ignición', 3: 'EACV', 4: 'Otros', 5: 'SRA'
  };

  private readonly ESTATUSES: Record<number, string> = {
    1: 'En revisión', 2: 'Aceptada', 3: 'Implementada', 4: 'Rechazada'
  };

  private readonly STATUS_BG: Record<number, string> = {
    1: 'FEF3C7', 2: 'DCFCE7', 3: 'DBEAFE', 4: 'FEE2E2'
  };

  private readonly STATUS_FG: Record<number, string> = {
    1: '92400E', 2: '166534', 3: '1E40AF', 4: '991B1B'
  };

  exportUsuarios(users: any[], date: string): void {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, this.buildUsersSheet(users, date), 'Usuarios');
    XLSX.writeFile(wb, `PremiaTuIdea_Usuarios_${date}.xlsx`);
  }

  private buildUsersSheet(users: any[], date: string): XLSX.WorkSheet {
    const COLS = ['A', 'B', 'C', 'D', 'E', 'F'];
    const HEADER_ROW = 4;

    const aoa: any[][] = [
      ['PremiaTuIdea — Listado de Usuarios', '', '', '', '', ''],
      [`Generado el: ${date}`, '', '', '', '', ''],
      ['', '', '', '', '', ''],
      ['IBM', 'Nombre', 'Departamento', 'Área', 'Locación', 'Puntos'],
      ...users.map(u => [
        u.ibm ?? '',
        u.nombre ?? '',
        u.departamento ?? '',
        u.area ?? '',
        u.locacion ?? 'N/A',
        u.puntos ?? 0,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(aoa);

    ws['!cols'] = [
      { wch: 12 }, { wch: 36 }, { wch: 24 }, { wch: 18 }, { wch: 20 }, { wch: 10 }
    ];

    ws['!rows'] = [
      { hpt: 32 }, { hpt: 18 }, { hpt: 6 }, { hpt: 24 },
      ...users.map(() => ({ hpt: 20 }))
    ];

    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
    ];

    if (ws['A1']) ws['A1'].s = {
      fill: { fgColor: { rgb: '1E3A8A' } },
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14 },
      alignment: { horizontal: 'center', vertical: 'center' },
    };

    if (ws['A2']) ws['A2'].s = {
      fill: { fgColor: { rgb: 'DBEAFE' } },
      font: { color: { rgb: '1E40AF' }, sz: 10, italic: true },
      alignment: { horizontal: 'left', vertical: 'center' },
    };

    COLS.forEach(col => {
      const cell = ws[`${col}${HEADER_ROW}`];
      if (cell) cell.s = {
        fill: { fgColor: { rgb: '1D4ED8' } },
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: { bottom: { style: 'medium', color: { rgb: '1E3A8A' } } },
      };
    });

    users.forEach((u, idx) => {
      const row = HEADER_ROW + 1 + idx;
      const bg = idx % 2 === 0 ? 'FFFFFF' : 'EFF6FF';
      const border = { bottom: { style: 'thin', color: { rgb: 'E2E8F0' } }, right: { style: 'thin', color: { rgb: 'E2E8F0' } } };

      COLS.forEach(col => {
        const cell = ws[`${col}${row}`];
        if (cell) cell.s = { fill: { fgColor: { rgb: bg } }, font: { sz: 10 }, alignment: { vertical: 'center' }, border };
      });

      const ibmCell = ws[`A${row}`];
      if (ibmCell) ibmCell.s = { ...ibmCell.s, alignment: { horizontal: 'center', vertical: 'center' } };

      const ptCell = ws[`F${row}`];
      if (ptCell) ptCell.s = {
        fill: { fgColor: { rgb: (u.puntos ?? 0) > 0 ? 'ECFDF5' : bg } },
        font: { bold: true, sz: 10, color: { rgb: (u.puntos ?? 0) > 0 ? '065F46' : '6B7280' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border,
      };
    });

    return ws;
  }

  exportIdeas(ideas: any[], date: string): void {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, this.buildSheet(ideas, date), 'Ideas y Proyectos');
    XLSX.writeFile(wb, `PremiaTuIdea_Reporte_${date}.xlsx`);
  }

  private buildSheet(ideas: any[], date: string): XLSX.WorkSheet {
    const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const HEADER_ROW = 4;

    const aoa: any[][] = [
      ['PremiaTuIdea — Reporte de Ideas / Proyectos', '', '', '', '', '', ''],
      [`Generado el: ${date}`, '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['ID', 'Título', 'Estatus', 'Origen de mejora', 'Área', 'Fecha', 'Usuario'],
      ...ideas.map(idea => [
        idea.id ?? '',
        idea.titulo ?? '',
        this.ESTATUSES[idea.estatus] ?? '',
        this.CATEGORIAS[idea.categoria_id] ?? '',
        idea.area_id ? (this.AREAS[idea.area_id] ?? '') : '',
        idea.created_at ? idea.created_at.slice(0, 10) : '',
        idea.usuario ?? idea.nombre_usuario ?? idea.user?.name ?? '',
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(aoa);

    ws['!cols'] = [
      { wch: 8 }, { wch: 48 }, { wch: 16 }, { wch: 26 }, { wch: 13 }, { wch: 14 }, { wch: 26 }
    ];

    ws['!rows'] = [
      { hpt: 32 }, { hpt: 18 }, { hpt: 6 }, { hpt: 24 },
      ...ideas.map(() => ({ hpt: 20 }))
    ];

    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
    ];

    // Title row
    if (ws['A1']) ws['A1'].s = {
      fill: { fgColor: { rgb: '1E3A8A' } },
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14 },
      alignment: { horizontal: 'center', vertical: 'center' },
    };

    // Subtitle row
    if (ws['A2']) ws['A2'].s = {
      fill: { fgColor: { rgb: 'DBEAFE' } },
      font: { color: { rgb: '1E40AF' }, sz: 10, italic: true },
      alignment: { horizontal: 'left', vertical: 'center' },
    };

    // Header row
    COLS.forEach(col => {
      const cell = ws[`${col}${HEADER_ROW}`];
      if (cell) cell.s = {
        fill: { fgColor: { rgb: '1D4ED8' } },
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: { bottom: { style: 'medium', color: { rgb: '1E3A8A' } } },
      };
    });

    // Data rows
    ideas.forEach((idea, idx) => {
      const row = HEADER_ROW + 1 + idx;
      const bg = idx % 2 === 0 ? 'FFFFFF' : 'EFF6FF';
      const border = { bottom: { style: 'thin', color: { rgb: 'E2E8F0' } }, right: { style: 'thin', color: { rgb: 'E2E8F0' } } };

      COLS.forEach(col => {
        const cell = ws[`${col}${row}`];
        if (cell) cell.s = { fill: { fgColor: { rgb: bg } }, font: { sz: 10 }, alignment: { vertical: 'center' }, border };
      });

      // ID centered
      const idCell = ws[`A${row}`];
      if (idCell) idCell.s = { ...idCell.s, alignment: { horizontal: 'center', vertical: 'center' } };

      // Status colored
      const sc = ws[`C${row}`];
      if (sc) sc.s = {
        fill: { fgColor: { rgb: this.STATUS_BG[idea.estatus] ?? bg } },
        font: { bold: true, sz: 10, color: { rgb: this.STATUS_FG[idea.estatus] ?? '374151' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border,
      };

      // Date centered
      const dc = ws[`F${row}`];
      if (dc) dc.s = { ...dc.s, alignment: { horizontal: 'center', vertical: 'center' } };
    });

    return ws;
  }
}
