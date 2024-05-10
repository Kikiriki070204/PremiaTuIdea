import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './app-navbar.component.html',
  styleUrl: './app-navbar.component.css'
})
export class AppNavbarComponent implements OnInit{
user_token : string | null = null

ngOnInit(): void {
  initFlowbite();
  this.user_token = localStorage.getItem('access_token')
  console.log("Usuario token: ",this.user_token)
}
}
