import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { UsersService } from '../../../../servicios/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile, UpdateUser } from '../../../../interfaces/profile';
import { IdeasService } from '../../../../servicios/ideas.service';
import { Idea } from '../../../../interfaces/idea';
import { User } from '../../../../interfaces/user';
import { HttpResponse } from '../../../../interfaces/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidatorProfile } from '../../../profile/profile.component';
import { Area, Departamento } from '../../../../interfaces/activar';

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [NgFor, FormsModule, ReactiveFormsModule, NgClass, CommonModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css'
})
export class UserDataComponent implements OnInit {
  errorMessage: string | null = null
  departamentos: Departamento[] | null = null
  areas: Area[] | null = null

  id: number | null = null
  userProfile: Profile | null = null
  ideas: Idea[] | null = null
  selectedActive: number | null = null
  puntos = new FormControl('', Validators.required)

  ibm = new FormControl<number | null>(null, Validators.required)
  departamento_id = new FormControl<number | null>(null, Validators.required);
  area_id = new FormControl<number | null>(null, Validators.required);


  showNewPassword = false;
  showNewPasswordConfirmation = false;

  form = new FormGroup({
    new_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    new_password_confirmation: new FormControl('', [Validators.required, Validators.minLength(8)])

  }, { validators: passwordMatchValidatorProfile })

  constructor(protected ideasService: IdeasService, protected userService: UsersService, protected router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.id = id
    });
  }

  ngOnInit(): void {
    console.log("id: ", this.id)
    this.userData()
    this.userImplementedIdeas()
    this.getDeps()
    this.getAreas()
  }

  userData() {
    let self = this
    this.userService.userData(this.id)
      .subscribe({
        next(value: Profile) {
          self.userProfile = value;
          self.ibm.setValue(value.ibm)
          self.departamento_id.setValue(value.departamento_id)
          self.area_id.setValue(value.area_id)
        },
        error(err: HttpResponse) {
          if (err.status == 401) {
            self.router.navigate(['**'])
          }
        }
      });
  }

  userImplementedIdeas(): void {
    this.ideasService.ideasImpByUser(this.id).subscribe(
      ideasImp => {
        this.ideas = ideasImp.ideas
      },
    )
  }
  onEstadoChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedActive = parseInt(selectedValue, 10)
    console.log("estado: ", this.selectedActive)
  }

  editar() {
    let self = this
    let active: UpdateUser = {
      id: this.id ?? 0,
      ibm: Number(this.ibm.value) ?? 0,
      nombre: this.userProfile?.nombre ?? "",
      rol_id: this.userProfile?.rol_id ?? 0,
      departamento_id: Number(this.departamento_id.value) ?? this.userProfile?.departamento_id,
      area_id: Number(this.area_id.value) ?? this.userProfile?.area_id,
      is_active: this.selectedActive ?? this.userProfile?.is_active,
      locacion_id: this.userProfile?.locacion_id ?? null,
      puntos: (this.puntos.value !== null && this.puntos.value !== '') ? +this.puntos.value : this.userProfile?.puntos
    }

    this.userService.updateUser(active).subscribe({
      next(value) {
        self.router.navigate(['/admin/usuarios-admin'])
      },
      error(err: HttpResponse) {
        switch (err.status) {
          case 422:
            self.errorMessage = 'Debes seleccionar un estado';
            console.log(err)
            break;
          case 404:
            self.errorMessage = 'Usuario no encontrado';
            console.log(err)
            break;
          default:
            self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
            console.log(err)
            break;
        }
      }
    })

  }

  setPassword() {
    if (this.form.valid) {

      const formData = {
        user: this.id,
        new_password: this.form.value.new_password ?? '',
        new_password_confirmation: this.form.value.new_password_confirmation ?? ''
      }

      let self = this

      this.userService.setetarContraseña(formData).subscribe({
        next(value: User) {
          console.log(value)
          self.errorMessage = null
          self.form.reset();
          self.router.navigate(['/admin/usuarios-admin'])
        },
        error(err: HttpResponse) {
          switch (err.status) {
            case 401:
              self.errorMessage = 'Contraseña incorrecta';
              break;
            case 422:
              self.errorMessage = 'Datos no válidos';
              break;
            default:
              self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
              break;
          }
        }
      })
    }
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleNewPasswordConfirmationVisibility() {
    this.showNewPasswordConfirmation = !this.showNewPasswordConfirmation;
  }

  goBack() {
    history.back();
  }

  getDeps(): void {
    this.userService.allDeps()
      .subscribe(Deps => {
        this.departamentos = Deps.departamentos;
        console.log(this.departamentos)
      });
  }

  getAreas(): void {
    this.userService.allAreas()
      .subscribe(Areas => {
        this.areas = Areas.areas;
        console.log(this.areas)
      });
  }

  get newPassword() {
    return this.form.get('new_password')
  }


  get newPasswordConfirmation() {
    return this.form.get('new_password_confirmation')
  }

}
