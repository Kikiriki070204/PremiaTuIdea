import { Component, OnInit } from '@angular/core';
import { Profile } from '../../../interfaces/profile';
import { IdeasService } from '../../../servicios/ideas.service';
import { AuthService } from '../../../servicios/auth.service';
import { Idea } from '../../../interfaces/idea';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-ideas-rechazadas',
  standalone: true,
  imports: [RouterModule, NgFor, CommonModule],
  templateUrl: './ideas-rechazadas.component.html',
  styleUrl: './ideas-rechazadas.component.css'
})
export class IdeasRechazadasComponent {

  ideas: any = []
  userInfo: Profile | null = null
  user_rol: number | null = null

  totalItems: number = 0
  pageSize: number = 15
  currentPage: number = 1
  Math = Math;

  constructor(protected authService: AuthService, protected ideaService: IdeasService, protected router: Router) { }

  ngOnInit(): void {
    this.misIdeas(4, this.currentPage)
  }


  misIdeas(estatus: number | null = null, page: number): void {
    this.ideaService.allIdeas(estatus, page)
      .subscribe(myIdeas => {
        console.log('Mis ideas:', myIdeas)
        this.ideas = myIdeas.ideas;
      });
  }

  getPages(): number[] {
    if (!this.ideas) return [];

    const total = this.ideas.last_page || 1;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  onPageChange(estatus: number, page: number): void {
    this.misIdeas(
      estatus, page);
  }
}


