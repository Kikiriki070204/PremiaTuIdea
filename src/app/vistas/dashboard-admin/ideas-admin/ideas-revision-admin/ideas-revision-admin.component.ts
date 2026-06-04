import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Profile } from '../../../../interfaces/profile';
import { AuthService } from '../../../../servicios/auth.service';
import { IdeasService } from '../../../../servicios/ideas.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs';

@Component({
  selector: 'app-ideas-revision-admin',
  standalone: true,
  imports: [RouterModule, NgFor, CommonModule, FormsModule],
  templateUrl: './ideas-revision-admin.component.html',
  styleUrl: './ideas-revision-admin.component.css'
})
export class IdeasRevisionAdminComponent implements OnInit {
  allIdeas: any[] = [];
  filteredIdeas: any[] = [];
  clientPage = 1;
  readonly clientPageSize = 15;
  isLoading = false;

  selectedCategoria: number = 1;
  selectedArea: number | null = null;
  searchQuery: string = '';
  searchDate: string = '';

  constructor(
    protected authService: AuthService,
    protected ideaService: IdeasService,
    protected router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  get pagedIdeas(): any[] {
    const start = (this.clientPage - 1) * this.clientPageSize;
    return this.filteredIdeas.slice(start, start + this.clientPageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredIdeas.length / this.clientPageSize);
  }

  get showingFrom(): number {
    return this.filteredIdeas.length === 0 ? 0 : (this.clientPage - 1) * this.clientPageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.clientPage * this.clientPageSize, this.filteredIdeas.length);
  }

  loadAllData(): void {
    this.isLoading = true;
    this.allIdeas = [];
    this.filteredIdeas = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.ideaService.ideasByStatusAndCategory(1, this.selectedCategoria, 1, this.selectedArea) as any).subscribe({
      next: (firstRes: any) => {
        const firstData: any[] = firstRes?.ideas?.data ?? [];
        const lastPage: number = firstRes?.ideas?.last_page ?? 1;

        if (lastPage <= 1) {
          this.allIdeas = firstData;
          this.applyFilters();
          this.isLoading = false;
          return;
        }

        const requests = [];
        for (let p = 2; p <= lastPage; p++) {
          requests.push(
            (this.ideaService.ideasByStatusAndCategory(1, this.selectedCategoria, p, this.selectedArea) as any)
              .pipe(map((r: any) => r?.ideas?.data ?? []))
          );
        }

        forkJoin(requests).subscribe({
          next: (pages: any) => {
            this.allIdeas = [...firstData, ...(pages as any[]).flat()];
            this.applyFilters();
            this.isLoading = false;
          },
          error: () => {
            this.allIdeas = firstData;
            this.applyFilters();
            this.isLoading = false;
          }
        });
      },
      error: () => { this.isLoading = false; }
    });
  }

  applyFilters(): void {
    let result = [...this.allIdeas];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter((idea: any) => idea.titulo?.toLowerCase().includes(q));
    }

    if (this.searchDate) {
      result = result.filter((idea: any) => (idea.created_at ?? '').slice(0, 10) === this.searchDate);
    }

    this.filteredIdeas = result;
    this.clientPage = 1;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onDateChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.searchDate = '';
    this.applyFilters();
  }

  onCategoriaChange(): void {
    this.searchQuery = '';
    this.searchDate = '';
    this.loadAllData();
  }

  onAreaChange(): void {
    this.loadAllData();
  }

  delete(idea: number) {
    Swal.fire({
      title: 'Eliminar idea',
      text: '¿Estás seguro de querer eliminar esta idea? Una vez hecho, no se podrá recuperar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'bg-red-600 text-white hover:bg-red-700 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out',
        cancelButton: 'bg-gray-300 text-gray-800 hover:bg-gray-400 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out',
        actions: 'flex gap-4 justify-center'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.ideaService.deleteIdea(idea).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Idea eliminada correctamente',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              customClass: {
                confirmButton: 'bg-blue-800 text-white hover:bg-blue-900 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out',
              },
              buttonsStyling: false
            }).then(() => { this.loadAllData(); });
          },
          error: () => {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar la idea. Por favor, inténtalo de nuevo más tarde.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              customClass: {
                confirmButton: 'bg-red-600 text-white hover:bg-red-700 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out',
              }
            });
          }
        });
      }
    });
  }
}
