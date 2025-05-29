import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { Idea } from '../../interfaces/idea';
import { IdeasService } from '../../servicios/ideas.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';

import { AuthService } from '../../servicios/auth.service';
import { Profile } from '../../interfaces/profile';

@Component({
  selector: 'app-ideas',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './ideas.component.html',
  styleUrl: './ideas.component.css'
})
export class IdeasComponent implements OnInit {
  ideas: Idea[] = []
  ideasUsers: Idea[] = []
  userInfo: Profile | null = null

  user_rol: number | null = null
  revision: number = 1
  constructor(protected ideaService: IdeasService, protected router: Router, protected authService: AuthService) { }
  ngOnInit(): void {
    this.user()
    this.irRevision()
    if (this.user_rol == 4) {
      this.misIdeas(1)
    }
    else {
      this.ideasbyStatus(1)
    }
  }

  user() {
    let self = this

    this.authService.meplus().subscribe({
      next(value: Profile) {
        self.userInfo = value
        self.user_rol = value.rol_id
        console.log(self.userInfo)
        console.log(self.user_rol)
      },
      error(err) {
        console.log(err)
      },
    })
  }

  irRevision() {
    this.router.navigateByUrl('/ideas/revision')
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
