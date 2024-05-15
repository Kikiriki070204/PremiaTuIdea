import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { Profile } from '../../interfaces/profile';
import { User } from '../../interfaces/user';
import { Idea } from '../../interfaces/idea';
import { IdeasService } from '../../servicios/ideas.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AppNavbarComponent, NgFor],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  ideas: Idea[] = []
  constructor(protected authService: AuthService, protected ideaService: IdeasService , protected router: Router){}

  user: Profile | null = null

  ngOnInit(): void {
    this.me()
    this.misIdeas()
  }
 
  //aqui hay q usar el meplus() pero debes validar primero el rol del usuario con el rol_id en cookies
  me(){
    let self = this

    this.authService.meplus().subscribe({
      next(value: Profile ) {
        self.user = value
        console.log("si jala", self.user.nombre)
      },
      error(err) {
        console.log(err)
      },
    })
  }


  misIdeas(): void
  {
    this.ideaService.ideasImp()
    .subscribe(myIdeas => {
      this.ideas = myIdeas.ideas;
      console.log(this.ideas)
    }); 
  }
}
