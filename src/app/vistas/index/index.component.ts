import { Component, OnInit } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  user_token: string | null = null
  constructor(protected authService: AuthService, protected router: Router) {
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getUser();
      const rol = this.authService.getRoleId();

      console.log('Usuario logueado:', user?.nombre);
      console.log('Rol del usuario:', rol);

      if (rol === 1) {
        this.dashboard()

      } else if (rol === 3) {

      }
    } else {
      this.router.navigate(['/login']);
    }


  }

  dashboard() {
    this.router.navigate(['/dashboard'])
  }
}
