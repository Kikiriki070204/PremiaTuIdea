import { Component, OnInit } from '@angular/core';
import { Profile } from '../../../interfaces/profile';
import { IdeasService } from '../../../servicios/ideas.service';
import { AuthService } from '../../../servicios/auth.service';
import { Idea, IdeaData } from '../../../interfaces/idea';
import { Router, RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Ideas } from '../../../interfaces/ideas';


@Component({
  selector: 'app-ideas-revision',
  standalone: true,
  imports: [RouterModule, NgFor],
  templateUrl: './ideas-revision.component.html',
  styleUrl: './ideas-revision.component.css'
})
export class IdeasRevisionComponent implements OnInit {
  ideas: Idea[] = []
  ideasUsers: Idea[] = []
  userInfo: Profile | null = null
  user_rol: number | null = null

  constructor(protected authService: AuthService, protected ideaService: IdeasService, protected router: Router) { }

  ngOnInit(): void {
    this.misIdeas(1);
  }

  misIdeas(estatus: number | null = null): void {
    this.ideaService.allIdeas(estatus)
      .subscribe(myIdeas => {
        console.log('Mis ideas:', myIdeas)
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
        this.ideasUsers = myIdeas.ideas


      });
  }


  goToIdea(id: number) {
    this.router.navigate(['/ideas/', id])
  }
  goToIdeaG(id: number) {
    this.router.navigate(['/idea/', id])
  }


}
