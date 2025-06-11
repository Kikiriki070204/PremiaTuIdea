import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../servicios/login.service';
import { Login } from '../../interfaces/login';
import { User } from '../../interfaces/user';
import { Profile } from '../../interfaces/profile';
import { AuthService } from '../../servicios/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpResponse } from '../../interfaces/http';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  errorMessage: string | null = null;
  ibm = new FormControl('', Validators.required);
  password = new FormControl('', Validators.minLength(6));
  cargando = false;

  constructor(
    private cookieService: CookieService,
    private service: LoginService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.ibm.valueChanges.subscribe(() => this.clearError());
    this.password.valueChanges.subscribe(() => this.clearError());
  }

  login() {
    this.errorMessage = null;
    const login: Login = {
      ibm: this.ibm.value ? +this.ibm.value : 0,
      password: this.password.value ?? ''
    };

    this.cargando = true;

    this.service.login(login).subscribe({
      next: (value: User) => {
        const token = value.access_token;
        localStorage.setItem('access_token', token);

        this.authService.meplus().subscribe({
          next: (user: Profile) => {
            this.authService.setUser(user, token);
            sessionStorage.setItem('desdeLogin', 'true');


            switch (user.rol_id) {
              case 1:
                this.router.navigate(['/dashboard']);
                break;
              case 3:
                this.router.navigate(['/dashboard']);
                break;
              default:
                this.router.navigate(['/dashboard']);
                break;
            }
          },
          error: () => {
            this.errorMessage = 'No se pudo cargar el perfil del usuario.';
            this.cargando = false;
          }
        });
      },
      error: (err: HttpErrorResponse) => {

        this.cargando = false;

        switch (err.status) {
          case 401:
            this.errorMessage = err.error.msg === 'Usuario no activo'
              ? 'Cuenta inactiva'
              : (err.error.msg === 'Usuario no registrado'
                ? 'Debe activar su cuenta antes de iniciar sesión'
                : 'Contraseña incorrecta');
            break;
          case 422:
            this.errorMessage = err.error.msg === 'Usuario ya registrado'
              ? 'Usuario ya registrado, por favor inicie sesión'
              : 'Campos obligatorios, por favor introduzca datos válidos';
            break;
          case 404:
            this.errorMessage = 'Usuario no encontrado, comuníquese con su administrador';
            break;
          default:
            this.errorMessage = 'Ha ocurrido un error. Inténtelo de nuevo.';
            break;
        }
      }
    });
  }

  clearError() {
    this.errorMessage = null;
  }
}
