import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { OnInit } from '@angular/core';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './app-navbar.component.html',
  styleUrl: './app-navbar.component.css'
})
export class AppNavbarComponent implements OnInit{
user: User | undefined

ngOnInit(): void {
  initFlowbite();
}
}
