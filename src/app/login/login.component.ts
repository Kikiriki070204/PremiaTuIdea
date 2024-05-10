import { Component } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../servicios/login.service';
import { Login } from '../interfaces/login';
import { User } from '../interfaces/user';
import { AuthService } from '../servicios/auth.service';

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

  constructor(protected service: LoginService, protected authService: AuthService,  protected router: Router){}

  login(){
    let self = this
    let login: Login = {
      ibm : (this.ibm.value !== null && this.ibm.value !== '') ? +this.ibm.value : 0,
      password: this.password.value ?? ""
    }

    this.service.login(login).subscribe({
      next(value: User ) {
        // llevarlo a su dashboard.
        console.log("token: ",value.access_token)
        self.router.navigate(['/dashboard'])
        localStorage.setItem('access_token',value.access_token)

        self.authService.me().subscribe({
          next(user: User){
            self.authService.setCurrentUser(user);
            console.log('Current User:', user);
          }
        })
      },
      error(err) {
        console.log(err)
      },
    })
  }
}
