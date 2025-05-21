import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ActivarService } from '../../servicios/activar.service';
import { Activar } from '../../interfaces/activar';
import { User } from '../../interfaces/user';
import { HttpResponse } from '../../interfaces/http';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [AppNavbarComponent, FormsModule, ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.css'
})
export class ActivateComponent implements OnInit {
  errorMessage: string | null = null;
  ibm = new FormControl('',Validators.required)
  password = new FormControl('', Validators.minLength(6))
  cargando: boolean = false;


  constructor(protected service: ActivarService, protected router: Router){}

  ngOnInit() {
    this.ibm.valueChanges.subscribe(() => {
      this.clearError();
    });

    this.password.valueChanges.subscribe(() => {
      this.clearError();
    });
  }

  activar(){
    let self = this
    let activar: Activar = {
      ibm : (this.ibm.value !== null && this.ibm.value !== '') ? +this.ibm.value : 0,
      password: this.password.value ?? ""
    }

    this.service.activar(activar).subscribe({
      next(value: User) {
        self.cargando = true;
        // llevarlo a login.
        console.log(value.ibm)
        self.router.navigate(['/login'])
      },
      error(err: HttpResponse) {
        switch(err.status)
        {
          case 401:
            self.errorMessage = 'Co';
            console.error('Unprocessable Entity:', err);
            break;
          case 422:
            if(err.error.msg == "Usuario ya registrado")
              {
                  self.errorMessage = 'Usuario ya registrado, por favor inicie sesion';
              }
              else
              {
                self.errorMessage = 'Campos obligatorios, por favor introduzca datos validos';
                console.error('Unprocessable Content:', err);
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
  
  clearError() {
    this.errorMessage = null;
  }
}
