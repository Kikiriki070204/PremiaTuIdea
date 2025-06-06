import { Component, HostListener } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../servicios/auth.service';
import { isEmpty } from 'rxjs';
import { NgIf } from '@angular/common';
import { Profile } from '../../interfaces/profile';




@Component({
  selector: 'app-app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf, RouterModule],
  templateUrl: './app-navbar.component.html',
  styleUrl: './app-navbar.component.css'
})
export class AppNavbarComponent implements OnInit {
  user_token: string | null = null
  userInfo: Profile | null = null
  user_rol: string | null = null
  user_id: number | null = null

  profileMenuOpen = false;
  mobileMenuOpen = false;



  constructor(protected cookie: CookieService, protected authService: AuthService, protected router: Router) { }

  ngOnInit(): void {

    this.user()
    initFlowbite();

    /*
    const accessToken = this.authService.getToken();

    if (accessToken.trim() === '') {
      console.log('Access token is empty.');
    } else {
      this.getToken()
      this.getRol()
      this.getId()
    }
  }
  
  getId() {
    this.user_id = this.authService.getId()
  }

  getRol() {
    this.user_rol = this.authService.getRol()
    console.log(this.user_rol)
  }
  getToken() {
    this.user_token = this.authService.getToken()
  }
  
  */
  }
  user() {
    let self = this

    this.authService.meplus().subscribe({
      next(value: Profile) {
        self.userInfo = value
        self.user_id = value.rol_id
        console.log(self.userInfo)
        console.log(self.user_id)
      },
      error(err) {
        console.log(err)
      },
    })
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

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const clickedInsideProfile = target.closest('#user-menu-button') || target.closest('.z-10');
    if (!clickedInsideProfile) {
      this.profileMenuOpen = false;
    }
  }


}


