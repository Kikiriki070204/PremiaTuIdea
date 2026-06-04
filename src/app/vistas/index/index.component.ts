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
  isLoggedIn = false

  constructor(protected authService: AuthService, protected router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn()

    if (this.isLoggedIn) {
      const rol = this.authService.getRoleId()
      if (rol === 1) {
        this.dashboard()
      }
    } else {
      this.router.navigate(['/login'])
    }
  }

  dashboard() {
    this.router.navigate(['/dashboard'])
  }
}
