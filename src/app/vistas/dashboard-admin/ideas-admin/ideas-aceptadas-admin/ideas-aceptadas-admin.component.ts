import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../servicios/auth.service';
import { IdeasService } from '../../../../servicios/ideas.service';
import { Idea } from '../../../../interfaces/idea';
import { Profile } from '../../../../interfaces/profile';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ideas-aceptadas-admin',
  standalone: true,
  imports: [RouterModule, NgFor, CommonModule, FormsModule],
  templateUrl: './ideas-aceptadas-admin.component.html',
  styleUrl: './ideas-aceptadas-admin.component.css'
})
export class IdeasAceptadasAdminComponent {
  ideasUsers: any = [];
  userInfo: Profile | null = null;
  user_rol: number | null = null;
  totalItems: number = 0;
  pageSize: number = 15;
  currentPage: number = 1;
  Math = Math;

  selectedCategoria: number = 1; // por defecto, categoría 1
  selectedArea: number | null = null;


  constructor(
    protected authService: AuthService,
    protected ideaService: IdeasService,
    protected router: Router
  ) { }

  ngOnInit(): void {
    this.ideasbyStatus(2, this.currentPage, this.selectedCategoria);
  }

  ideasbyStatus(
    estatus: number | null = null,
    page: number,
    categoria: number | null = null,
    area_id: number | null = null
  ) {
    this.currentPage = page;
    this.ideasUsers = [];
    this.ideaService.ideasByStatusAndCategory(estatus, categoria, page, area_id).subscribe((myIdeas) => {
      this.ideasUsers = myIdeas.ideas;
    });
  }

  onCategoriaChange(): void {
    this.ideasbyStatus(2, 1, this.selectedCategoria); // siempre reinicia en página 1 al cambiar
  }

  onPageChange(page: number): void {
    this.ideasbyStatus(2, page, this.selectedCategoria, this.selectedArea);
  }

  onAreaChange(): void {
    this.ideasbyStatus(2, 1, this.selectedCategoria, this.selectedArea);

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
            }).then(() => {
              this.ideasbyStatus(1, this.currentPage, this.selectedCategoria);
            });
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
          },
        });
      }
    });
  }
}
