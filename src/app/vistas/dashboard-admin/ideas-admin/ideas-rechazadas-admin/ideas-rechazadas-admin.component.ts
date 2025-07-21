import { Component } from '@angular/core';
import { Idea } from '../../../../interfaces/idea';
import { Profile } from '../../../../interfaces/profile';
import { AuthService } from '../../../../servicios/auth.service';
import { IdeasService } from '../../../../servicios/ideas.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ideas-rechazadas-admin',
  standalone: true,
  imports: [RouterLink, NgFor, CommonModule, FormsModule],
  templateUrl: './ideas-rechazadas-admin.component.html',
  styleUrl: './ideas-rechazadas-admin.component.css'
})
export class IdeasRechazadasAdminComponent {

  ideasUsers: any = [];
  userInfo: Profile | null = null;
  user_rol: number | null = null;
  totalItems: number = 0;
  pageSize: number = 15;
  currentPage: number = 1;
  Math = Math;

  selectedCategoria: number = 1; // por defecto, categoría 1

  constructor(
    protected authService: AuthService,
    protected ideaService: IdeasService,
    protected router: Router
  ) { }

  ngOnInit(): void {
    this.ideasbyStatus(4, this.currentPage, this.selectedCategoria);
  }

  ideasbyStatus(
    estatus: number | null = null,
    page: number,
    categoria: number | null = null
  ) {
    this.currentPage = page;
    this.ideasUsers = [];
    this.ideaService.ideasByStatusAndCategory(estatus, categoria, page).subscribe((myIdeas) => {
      this.ideasUsers = myIdeas.ideas;
    });
  }

  onCategoriaChange(): void {
    this.ideasbyStatus(4, 1, this.selectedCategoria); // siempre reinicia en página 1 al cambiar
  }

  onPageChange(page: number): void {
    this.ideasbyStatus(4, page, this.selectedCategoria);
  }

  delete(idea: number) {
    const confirmation = window.confirm(
      '¿Estás seguro de querer eliminar esta idea? Una vez hecho, no se podrá recuperar.'
    );

    if (confirmation) {
      this.ideaService.deleteIdea(idea).subscribe({
        next: () => {
          this.router.navigate(['/admin/ideas-admin/revision']);
        },
        error: (err) => {
          window.alert('Error al eliminar la idea: ' + err.error.message);
        },
      });
    }
  }
}

