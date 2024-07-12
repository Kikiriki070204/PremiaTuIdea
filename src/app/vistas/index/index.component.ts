import { Component, OnInit } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [AppNavbarComponent, RouterLink],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent  implements OnInit{
  user_token : string | null = null
  constructor( protected authService: AuthService, protected router: Router){
  }

  ngOnInit(): void {
    const accessToken = this.authService.getToken(); 
    if (accessToken.trim() === '') {
      console.log('Access token is empty.');
    } else {
      this.getToken()
    }
  }
  getToken()
  {
    this.user_token = this.authService.getToken()
    console.log("Access token exist!")
  }

  logout()
{
  this.authService.logout()
  this.router.navigate(['/dashboard'])
}
}
