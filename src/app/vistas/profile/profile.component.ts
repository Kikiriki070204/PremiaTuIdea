import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { Profile } from '../../interfaces/profile';
import { User } from '../../interfaces/user';
import { Idea } from '../../interfaces/idea';
import { IdeasService } from '../../servicios/ideas.service';
import { CommonModule, NgFor } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../register/register.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgFor, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  ideas: Idea[] = []
  constructor(protected authService: AuthService, protected ideaService: IdeasService, protected router: Router) { }

  user: Profile | null = null

  errorMessage: string | null = null
  showNewPassword = false;
  showNewPasswordConfirmation = false;



  form = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    new_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    new_password_confirmation: new FormControl('', [Validators.required, Validators.minLength(8)])

  }, { validators: passwordMatchValidatorProfile })

  ngOnInit(): void {
    this.me()
    this.misIdeas()
  }

  //aqui hay q usar el meplus() pero debes validar primero el rol del usuario con el rol_id en cookies
  me() {
    let self = this

    this.authService.meplus().subscribe({
      next(value: Profile) {
        self.user = value
        console.log("si jala", self.user.nombre)
      },
      error(err) {
        console.log(err)
      },
    })
  }


  misIdeas(): void {
    this.ideaService.ideasImp()
      .subscribe(myIdeas => {
        this.ideas = myIdeas.ideas;
        console.log(this.ideas)
      });
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleNewPasswordConfirmationVisibility() {
    this.showNewPasswordConfirmation = !this.showNewPasswordConfirmation;
  }

  updatePassword() {
    if (this.form.valid) {
      const formData = {
        password: this.form.value.password,
        new_password: this.form.value.new_password,
        new_password_confirmation: this.form.value.new_password_confirmation
      }


      console.log(formData)
      let self = this


      this.authService.actualizarContraseña(formData).subscribe({
        next(value: User) {

          console.log(value)
          self.errorMessage = null
          self.form.reset();
          self.router.navigate(['/login'])

        },
        error(err) {
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

  get password() {
    return this.form.get('password')
  }

  get newPassword() {
    return this.form.get('new_password')
  }


  get newPasswordConfirmation() {
    return this.form.get('new_password_confirmation')
  }
}

export const passwordMatchValidatorProfile: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('new_password')?.value;
  const confirmedPassword = group.get('new_password_confirmation')?.value;
  return password === confirmedPassword ? null : { passwordMismatch: true };
};
