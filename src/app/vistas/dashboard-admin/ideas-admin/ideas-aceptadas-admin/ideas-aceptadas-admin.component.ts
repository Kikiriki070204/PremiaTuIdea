import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../servicios/auth.service';
import { IdeasService } from '../../../../servicios/ideas.service';
import { Idea } from '../../../../interfaces/idea';
import { Profile } from '../../../../interfaces/profile';

@Component({
  selector: 'app-ideas-aceptadas-admin',
  standalone: true,
  imports: [RouterModule, NgFor],
  templateUrl: './ideas-aceptadas-admin.component.html',
  styleUrl: './ideas-aceptadas-admin.component.css'
})
export class IdeasAceptadasAdminComponent {
  ideas: Idea[] = []
  ideasUsers: Idea[] = []
  userInfo: Profile | null = null
  user_rol: number | null = null


  constructor(
    protected authService: AuthService,
    protected ideaService: IdeasService,
    protected router: Router
  ) { }

  ngOnInit(): void {
    this.ideasbyStatus(2);
  }

  ideasbyStatus(estatus: number | null = null): void {
    this.ideasUsers = []
    this.ideaService.ideasByStatus(estatus)
      .subscribe(myIdeas => {
        this.ideasUsers = myIdeas.ideas
      });
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
          this.router.navigate(['/admin/ideas-admin/revision']);
        },
        error: (err) => {
          console.error('Error al eliminar la idea:', err);
        }
      });
    }
  }
}
