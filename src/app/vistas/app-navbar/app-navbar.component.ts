import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { Router, RouterLink } from '@angular/router';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../servicios/auth.service';
import { isEmpty } from 'rxjs';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './app-navbar.component.html',
  styleUrl: './app-navbar.component.css'
})
export class AppNavbarComponent implements OnInit{
user_token : string | null = null
user: User | null = null
user_rol: string | null = null
user_id: string | null = null
constructor(protected cookie: CookieService, protected authService: AuthService, protected router: Router){
}

ngOnInit(): void {
  initFlowbite();
  const accessToken = this.authService.getToken(); 

  if (accessToken.trim() === '') {
    console.log('Access token is empty.');
  } else {
    this.getToken()
    this.getRol()
    this.getId()
}
}

getId()
{
  this.user_id = this.authService.getId()
}

getRol(){
  this.user_rol = this.authService.getRol()
}
getToken()
{
  this.user_token = this.authService.getToken()
  console.log("Access token exist!")
}

logout()
{
  this.authService.logout()
  
  this.router.navigate(['/'])
  
}


}


