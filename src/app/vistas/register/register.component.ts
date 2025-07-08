import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../servicios/users.service';
import { Departamento, Area, Locacion } from '../../interfaces/activar';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AreaId, User } from '../../interfaces/user';
import { HttpResponse } from '../../interfaces/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  errorMessage: string | null = null
  showPassword = false
  showPasswordConfirmation = false

  departamentos: Departamento[] | null = null
  areas: Area[] | null = null
  locaciones: Locacion[] | null = null

  selectedArea: number | null = null
  selectedDep: number | null = null
  selectedLoc: number | null = null

  form = new FormGroup({
    ibm: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    apellido_paterno: new FormControl('', [Validators.required]),
    apellido_materno: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmed_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    selectedAreaControl: new FormControl(null, [Validators.required]),
    selectedDepControl: new FormControl(null),
    selectedLocControl: new FormControl(null)
  }, { validators: passwordMatchValidator });

  constructor(protected userService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.getDeps();
    this.getAreas();
    this.getLocaciones();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleNewPasswordConfirmationVisibility() {
    this.showPasswordConfirmation = !this.showPasswordConfirmation;
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

  onAreaChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedArea = parseInt(selectedValue, 10);
    console.log("area: ", this.selectedArea)
    this.getLocaciones()
  }

  onDepChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedDep = parseInt(selectedValue, 10);
    console.log("dep: ", this.selectedDep)
  }

  onLocChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedLoc = parseInt(selectedValue, 10);
    console.log("locacion: ", this.selectedLoc)
  }
  getLocaciones(): void {
    let self = this
    let area: AreaId = {
      area_id: this.selectedArea ?? 0
    }

    this.userService.locByArea(area).subscribe(locations => {
      this.locaciones = locations.locaciones
      console.log("locaciones!")
    })
  }

  registrarse() {
    if (this.form.valid) {
      const {
        ibm,
        nombre,
        apellido_paterno,
        apellido_materno,
        password
      } = this.form.value;

      const nombreCompleto = `${nombre || ''} ${apellido_paterno || ''} ${apellido_materno || ''}`.trim();

      const formData = {
        ibm,
        nombre: nombreCompleto,
        password,
        rol_id: 4,
        area_id: this.selectedArea,
        departamento_id: this.selectedDep,
        locacion_id: this.selectedLoc
      };

      console.log(formData);
      this.userService.register(formData).subscribe({
        next: (response) => {
          this.form.reset();
          this.errorMessage = null;
          this.router.navigate(['/login']);
        },
        error: (err) => {
          let self = this;
          switch (err.status) {
            case 422:
              self.errorMessage = 'Campos obligatorios, por favor rellena todos los campos requeridos';
              console.log(err)
              break;
            default:
              // Errores generales
              self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
              console.log(err)
              break;
          }
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
    }

  }

  get nombre() {
    return this.form.get('nombre')
  }

  get apellido_paterno() {
    return this.form.get('apellido_paterno')
  }

  get apellido_materno() {
    return this.form.get('apellido_materno')
  }
  get ibm() {
    return this.form.get('ibm')
  }

  get password() {
    return this.form.get('password')
  }

  get passwordConfirmation() {
    return this.form.get('confirmed_password')
  }

  get selectedAreaControl() {
    return this.form.get('selectedArea');
  }
  get selectedDepControl() {
    return this.form.get('selectedDep');
  }
  get selectedLocControl() {
    return this.form.get('selectedLoc');
  }
}

export const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmedPassword = group.get('confirmed_password')?.value;
  return password === confirmedPassword ? null : { passwordMismatch: true };
};
