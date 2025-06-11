import { Component, OnInit } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent implements OnInit {
  user_token: string | null = null
  constructor(protected authService: AuthService, protected router: Router) {
  }

  ngOnInit(): void {
    const accessToken = this.authService.getToken();
    if (accessToken === null || accessToken.trim() === '') {
      console.log('Access token is empty.');
    } else {
      this.getToken()
    }
  }

  getToken() {
    this.user_token = this.authService.getToken()
  }
}
