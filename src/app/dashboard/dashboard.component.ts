import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { User } from '../interfaces/user';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AppNavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
user: User | null = null
constructor(protected authService: AuthService ){}
ngOnInit(): void {
  this.user = this.authService.getCurrentUser()
  console.log(this.user?.nombre)
}
}
