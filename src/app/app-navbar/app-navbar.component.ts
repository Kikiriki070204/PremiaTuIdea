import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { RouterLink } from '@angular/router';
import { CookieOptions, CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './app-navbar.component.html',
  styleUrl: './app-navbar.component.css'
})
export class AppNavbarComponent implements OnInit{
user_token : string | null = null
user: User | null = null
constructor(protected cookie: CookieService){}

ngOnInit(): void {
  initFlowbite();
  this.user_token = this.cookie.get('access_token')
  console.log("Usuario token: ",this.user_token)
}
}
