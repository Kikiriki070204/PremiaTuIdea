import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { AuthService } from '../servicios/auth.service';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AppNavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  constructor(protected authService: AuthService, protected router: Router){}

  user: User | null = null
  ngOnInit(): void {
    this.me()
  }
 
  me(){
    let self = this

    this.authService.me().subscribe({
      next(value: User ) {
        // llevarlo a su dashboard.
        console.log("si jala")
      },
      error(err) {
        console.log(err)
      },
    })
  }
}
