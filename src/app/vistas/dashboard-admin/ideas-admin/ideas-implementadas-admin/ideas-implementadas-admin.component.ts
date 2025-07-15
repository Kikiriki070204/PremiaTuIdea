import { Component, OnInit } from '@angular/core';
import { Idea } from '../../../../interfaces/idea';
import { Profile } from '../../../../interfaces/profile';
import { AuthService } from '../../../../servicios/auth.service';
import { IdeasService } from '../../../../servicios/ideas.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-ideas-implementadas-admin',
  standalone: true,
  imports: [RouterLink, NgFor, CommonModule],
  templateUrl: './ideas-implementadas-admin.component.html',
  styleUrl: './ideas-implementadas-admin.component.css'
})
export class IdeasImplementadasAdminComponent implements OnInit {
  ideasUsers: any = []
  userInfo: Profile | null = null
  user_rol: number | null = null
  totalItems: number = 0
  pageSize: number = 15
  currentPage: number = 1
  Math = Math;


  constructor(
    protected authService: AuthService,
    protected ideaService: IdeasService,
    protected router: Router
  ) { }

  ngOnInit(): void {
    this.ideasbyStatus(3, this.currentPage);
  }

  ideasbyStatus(estatus: number | null = null, page: number) {
    this.currentPage = page;
    this.ideasUsers = []
    this.ideaService.ideasByStatus(estatus, page)
      .subscribe(myIdeas => {
        this.ideasUsers = myIdeas.ideas
      });
  }

  getPages(): number[] {
    if (!this.ideasUsers) return [];

    const total = this.ideasUsers.last_page || 1;
    return Array.from({ length: total }, (_, i) => i + 1);
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
          this.ideasbyStatus(3, this.currentPage);
        },
        error: (err) => {
          window.alert("Error al eliminar la idea: " + err.error.message);
        }
      });
    }
  }
}
