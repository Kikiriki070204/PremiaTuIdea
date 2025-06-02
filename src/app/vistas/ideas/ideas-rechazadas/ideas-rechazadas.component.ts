import { Component, OnInit } from '@angular/core';
import { Profile } from '../../../interfaces/profile';
import { IdeasService } from '../../../servicios/ideas.service';
import { AuthService } from '../../../servicios/auth.service';
import { Idea } from '../../../interfaces/idea';
import { Router, RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-ideas-rechazadas',
  standalone: true,
  imports: [RouterModule, NgFor],
  templateUrl: './ideas-rechazadas.component.html',
  styleUrl: './ideas-rechazadas.component.css'
})
export class IdeasRechazadasComponent {

  ideas: Idea[] = []
  ideasUsers: Idea[] = []
  userInfo: Profile | null = null
  user_rol: number | null = null

  constructor(protected authService: AuthService, protected ideaService: IdeasService, protected router: Router) { }

  ngOnInit(): void {
    this.user()
  }

  async user(): Promise<void> {
    try {
      const profile = await firstValueFrom(this.authService.meplus());
      this.userInfo = profile;
      this.user_rol = profile.rol_id;
      console.log('Rol del usuario:', this.user_rol);

      // Ejecutar lógica según el rol
      if (this.user_rol === 4) {
        this.misIdeas(3);
      } else {
        this.ideasbyStatus(3);
      }

    } catch (err) {
      console.error('Error al obtener perfil:', err);
    }
  }

  misIdeas(estatus: number | null = null): void {
    this.ideaService.allIdeas(estatus)
      .subscribe(myIdeas => {
        this.ideas = myIdeas.ideas;
        console.log(this.ideas)
      });
  }

  allideasUsers(): void {
    this.ideaService.usersIdeas().subscribe(myIdeas => {
      this.ideasUsers = myIdeas.ideas;
      console.log(this.ideasUsers)
    })


  }


  ideasbyStatus(estatus: number | null = null): void {
    this.ideasUsers = []
    this.ideaService.ideasByStatus(estatus)
      .subscribe(myIdeas => {
        this.ideasUsers = myIdeas.ideas;
        console.log(this.ideasUsers)
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


