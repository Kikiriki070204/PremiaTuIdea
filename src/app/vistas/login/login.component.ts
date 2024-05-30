import { Component } from '@angular/core';
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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AppNavbarComponent, FormsModule, ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  errorMessage: string | null = null;
  ibm = new FormControl('',Validators.required)
  password = new FormControl('', Validators.minLength(6))

  constructor(protected cookieService: CookieService, protected service: LoginService, protected authService: AuthService,  protected router: Router){}

  login(){
    let self = this
    let login: Login = {
      ibm : (this.ibm.value !== null && this.ibm.value !== '') ? +this.ibm.value : 0,
      password: this.password.value ?? ""
    }

    this.service.login(login).subscribe({
      next(value: User ) {
        // llevarlo a su dashboard.
        localStorage.setItem('access_token', value.access_token)
        self.authService.meplus().subscribe({
          next(user: Profile){
            self.authService.setCurrentUser(user);
            console.log('Current User:', user);
            self.cookieService.set('rol_id',user.rol_id.toString(),1)
        self.cookieService.set('id',user.id.toString(),1)
        self.router.navigate(['/dashboard'])
          }
        })
      },
      error(err: HttpResponse) {

        switch(err.status)
        {
          case 401:
            if(err.error.msg == "Usuario no activo")
              {
              self.errorMessage = 'Cuenta inactiva';
              }
              else if(err.error.msg == "Usuario no registrado")
              {
                self.errorMessage = 'Debe registrarse antes de iniciar sesion';
              }
              else{
                self.errorMessage = 'Contraseña incorrecta';
              }
            break;
          case 422:
            if(err.error.msg == "Usuario ya registrado")
              {
                  self.errorMessage = 'Usuario ya registrado, por favor inicie sesion';
              }
              else
              {
                self.errorMessage = 'Campos obligatorios, por favor introduzca datos validos';
              }
              break;
            case 404:
              self.errorMessage = 'Usuario no encontrado, si cree que es un error comuniquese con su administrador';
              break;
            default:
                // Errores generales
                self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
                break;
        }
      },
    })
  }
  
}
