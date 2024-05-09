import { Component } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AppNavbarComponent, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  ibm = new FormControl('',Validators.required)
  password = new FormControl('', Validators.minLength(6))
}
