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
      error(err) {
        console.log(err)
      },
    })
  }
  
}
