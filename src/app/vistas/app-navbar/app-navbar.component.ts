import { Component, HostListener } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../servicios/auth.service';
import { BehaviorSubject, catchError, interval, isEmpty, startWith, switchMap } from 'rxjs';
import { NgIf } from '@angular/common';
import { Profile } from '../../interfaces/profile';
import { Notificacion, NotificacionesService } from '../../servicios/notificaciones.service';




@Component({
  selector: 'app-app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf, RouterModule],
  templateUrl: './app-navbar.component.html',
  styleUrl: './app-navbar.component.css'
})
export class AppNavbarComponent implements OnInit {
  user_token: string | null = null
  user_info: Profile | null = null
  user_rol: number | null = null
  user_id: number | null = null

  profileMenuOpen = false;
  mobileMenuOpen = false;

  hayNotisSinLeer = false;

  constructor(protected cookie: CookieService, protected authService: AuthService, protected router: Router, protected notiService: NotificacionesService) {
  }



  ngOnInit(): void {
    this.user()
    this.notiService.hayNoLeidas$.subscribe(flag => this.hayNotisSinLeer = flag);
    initFlowbite();
  }



  user() {
    if (this.authService.isLoggedIn()) {
      this.user_rol = this.authService.getRoleId();
    } else {
      console.log('Role not found')
    }
  }


  logout() {
    this.authService.logout()
    location.reload()
    this.router.navigate(['/'])
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  // Para cerrar dropdown de perfil
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const clickedInsideProfile = target.closest('#user-menu-button') || target.closest('.z-10');
    if (!clickedInsideProfile) {
      this.profileMenuOpen = false;
    }
  }


}


