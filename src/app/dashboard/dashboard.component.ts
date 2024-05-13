import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { User } from '../interfaces/user';
import { AuthService } from '../servicios/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AppNavbarComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
user: User | null = null
constructor(protected authService: AuthService ){
}
ngOnInit(): void {
  this.me()
}

me(){
  let self = this

  this.authService.me().subscribe({
    next(value: User ) {
      self.user = value
      console.log("si jala", self.user.nombre)
    },
    error(err) {
      console.log(err)
    },
  })
}
}
