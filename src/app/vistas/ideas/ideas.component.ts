import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { Idea } from '../../interfaces/idea';
import { IdeasService } from '../../servicios/ideas.service';
import { Router, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-ideas',
  standalone: true,
  imports: [AppNavbarComponent, NgFor, RouterLink],
  templateUrl: './ideas.component.html',
  styleUrl: './ideas.component.css'
})
export class IdeasComponent implements OnInit{
 ideas: Idea[] = []
ideasUsers: Idea[] = []
user_rol: string | null = null
 constructor(protected ideaService: IdeasService, protected router: Router, protected authService: AuthService){}
  ngOnInit(): void {
    this.getRol()
    if(this.user_rol == '3')
      {
        this.misIdeas()
      }
      else
      {
        this.ideasbyStatus()
      }
  }

  misIdeas(): void
  {
    this.ideaService.allIdeas()
    .subscribe(myIdeas => {
      this.ideas = myIdeas.ideas;
      console.log(this.ideas)
    }); 
  }
  getRol(){
    this.user_rol = this.authService.getRol()
    console.log("user rol: ", this.user_rol)
  }
  ideasbyStatus(): void
  {
    this.ideaService.usersIdeas()
    .subscribe(myIdeas => {
      this.ideasUsers = myIdeas.ideas;
      console.log(this.ideasUsers)
    }); 
  }
  goToIdea(id: number)
  {
    this.router.navigate(['/ideas/', id])
  }
}
