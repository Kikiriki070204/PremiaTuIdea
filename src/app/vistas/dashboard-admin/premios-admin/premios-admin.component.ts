import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../servicios/users.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { UsuarioPremio } from '../../../interfaces/producto';
import { Profile } from '../../../interfaces/profile';
import { AuthService } from '../../../servicios/auth.service';
import { CommonModule, NgFor } from '@angular/common';
import { environment } from '../../../../enviroment/enviroment';

@Component({
  selector: 'app-premios-admin',
  standalone: true,
  imports: [RouterLink, NgFor, RouterModule, CommonModule],
  templateUrl: './premios-admin.component.html',
  styleUrl: './premios-admin.component.css'
})
export class PremiosAdminComponent implements OnInit {
  premios: any = []
  user_id: number | null = null
  userInfo: Profile | null = null

  // paginacion
  totalItems: number = 0
  pageSize: number = 15
  currentPage: number = 1
  Math = Math;

  imagenUrl: string | null = null;


  constructor(
    protected userService: UsersService,
    protected router: Router,
    protected authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user()
    this.premiosCanjeados(this.currentPage)
  }

  premiosCanjeados(page: number): void {
    this.userService.premiosCanjeadosAdmin(page).subscribe(
      premiosCanj => {
        this.premios = premiosCanj.premios
        console.log(this.premios)
      }
    )
  }

  getImageUrl(path: string): string {
    return `${environment.api_url_images}/storage/` + path.replace('public/', '')
  }

  getPages(): number[] {
    if (!this.premios) return [];

    const total = this.premios.last_page || 1;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  onPageChange(page: number): void {
    this.premiosCanjeados(page);
  }

  user() {
    this.user_id = this.authService.getRoleId()

  }
}
