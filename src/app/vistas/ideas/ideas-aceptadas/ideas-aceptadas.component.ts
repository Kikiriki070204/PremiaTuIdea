import { Component, OnInit } from '@angular/core';
import { Profile } from '../../../interfaces/profile';
import { IdeasService } from '../../../servicios/ideas.service';
import { AuthService } from '../../../servicios/auth.service';
import { Idea } from '../../../interfaces/idea';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-ideas-aceptadas',
  standalone: true,
  imports: [RouterModule, NgFor, CommonModule],
  templateUrl: './ideas-aceptadas.component.html',
  styleUrl: './ideas-aceptadas.component.css'
})
export class IdeasAceptadasComponent {
  ideas: any = []
  userInfo: Profile | null = null
  user_rol: number | null = null

  totalItems: number = 0
  pageSize: number = 15
  currentPage: number = 1
  Math = Math;

  constructor(protected authService: AuthService, protected ideaService: IdeasService, protected router: Router) { }

  ngOnInit(): void {
    this.misIdeas(2, this.currentPage);
  }


  misIdeas(estatus: number | null = null, page: number): void {
    this.ideaService.allIdeas(estatus, page)
      .subscribe(myIdeas => {
        this.ideas = myIdeas.ideas;
      });
  }

  getPages(): number[] {
    if (!this.ideas) return [];

    const total = this.ideas.last_page || 1;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  onPageChange(estatus: number, page: number): void {
    this.misIdeas(estatus, page);
  }


  goToIdea(id: number) {
    this.router.navigate(['/ideas/', id])
  }
  goToIdeaG(id: number) {
    this.router.navigate(['/idea/', id])
  }

  delete(idea: number) {
    const confirmation = window.confirm("¿Estás seguro de querer eliminar esta idea? Una vez hecho, no se podrá recuperar.");

    if (confirmation) {
      this.ideaService.deleteIdea(idea).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error al eliminar la idea:', err);
        }
      });
    }
  }
}
