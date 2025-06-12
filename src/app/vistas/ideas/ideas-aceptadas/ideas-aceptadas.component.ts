import { Component, OnInit } from '@angular/core';
import { Profile } from '../../../interfaces/profile';
import { IdeasService } from '../../../servicios/ideas.service';
import { AuthService } from '../../../servicios/auth.service';
import { Idea } from '../../../interfaces/idea';
import { Router, RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-ideas-aceptadas',
  standalone: true,
  imports: [RouterModule, NgFor],
  templateUrl: './ideas-aceptadas.component.html',
  styleUrl: './ideas-aceptadas.component.css'
})
export class IdeasAceptadasComponent {
  ideas: Idea[] = []
  ideasUsers: Idea[] = []
  userInfo: Profile | null = null
  user_rol: number | null = null

  constructor(protected authService: AuthService, protected ideaService: IdeasService, protected router: Router) { }

  ngOnInit(): void {
    this.misIdeas(2);
  }


  misIdeas(estatus: number | null = null): void {
    this.ideaService.allIdeas(estatus)
      .subscribe(myIdeas => {
        this.ideas = myIdeas.ideas;
      });
  }

  allideasUsers(): void {
    this.ideaService.usersIdeas().subscribe(myIdeas => {
      this.ideasUsers = myIdeas.ideas;
    })


  }


  ideasbyStatus(estatus: number | null = null): void {
    this.ideasUsers = []
    this.ideaService.ideasByStatus(estatus)
      .subscribe(myIdeas => {
        this.ideasUsers = myIdeas.ideas;
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
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error al eliminar la idea:', err);
        }
      });
    }
  }
}
