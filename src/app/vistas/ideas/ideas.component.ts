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
    this.irRevision()

  }

  irRevision() {
    this.router.navigateByUrl('/ideas/revision')
  }





}
