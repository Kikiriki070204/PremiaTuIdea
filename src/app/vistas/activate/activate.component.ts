import { Component } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ActivarService } from '../../servicios/activar.service';
import { Activar } from '../../interfaces/activar';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [AppNavbarComponent, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.css'
})
export class ActivateComponent {
  ibm = new FormControl('',Validators.required)
  password = new FormControl('', Validators.minLength(6))

  constructor(protected service: ActivarService, protected router: Router){}

  activar(){
    let self = this
    let activar: Activar = {
      ibm : (this.ibm.value !== null && this.ibm.value !== '') ? +this.ibm.value : 0,
      password: this.password.value ?? ""
    }

    this.service.activar(activar).subscribe({
      next(value: User) {
        // llevarlo a login.
        console.log(value.ibm)
        self.router.navigate(['/login'])
      },
      error(err) {
        console.log(err)
      },
    })
  }
  
}
