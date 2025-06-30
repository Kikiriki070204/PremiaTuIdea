import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../../../app-navbar/app-navbar.component';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../../servicios/users.service';
import { Area, Departamento, Locacion, Rol } from '../../../../interfaces/activar';
import { AreaId, NewUser, NoLocation, User } from '../../../../interfaces/user';
import { NgFor, NgIf } from '@angular/common';
import { HttpResponse } from '../../../../interfaces/http';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [AppNavbarComponent, RouterLink, FormsModule, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css'
})
export class NewUserComponent implements OnInit {
  errorMessage: string | null = null
  roles: Rol[] | null = null
  departamentos: Departamento[] | null = null
  areas: Area[] | null = null
  locaciones: Locacion[] | null = null

  ibm = new FormControl(Validators.required)
  nombre = new FormControl('', Validators.required)

  selectedRol: number | null = null
  selectedArea: number | null = null
  selectedDep: number | null = null
  selectedLoc: number | null = null
  constructor(protected userService: UsersService, protected router: Router) { }

  ngOnInit(): void {
    this.getRoles()
    this.getDeps()
    this.getAreas()
  }

  getRoles(): void {
    this.userService.allRoles()
      .subscribe(Roles => {
        this.roles = Roles.roles;
        console.log(this.roles)
      });
  }

  onRoleChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedRol = parseInt(selectedValue, 10);
    console.log("rol: ", this.selectedRol)
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

  newUser() {
    let self = this
    let newUser: NewUser = {
      ibm: (this.ibm.value !== null) ? +this.ibm.value : 0,
      nombre: this.nombre.value ?? "",
      rol_id: this.selectedRol ?? 0,
      departamento_id: this.selectedDep ?? null,
      area_id: this.selectedArea ?? 0,
      locacion_id: this.selectedLoc ?? null
    }

    this.userService.newUsert(newUser).subscribe({
      next(value: User) {
        console.log("si jala!")
        self.router.navigate(['/usuarios'])
      },
      error(err: HttpResponse) {
        switch (err.status) {
          case 422:
            self.errorMessage = 'Campos obligatorios, por favor introduce un valor adecuado';
            console.log(err)
            break;
          default:
            // Errores generales
            self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
            console.log(err)
            break;
        }
      },
    })
  }

  noLocationUser() {
    let self = this
    let newUser: NoLocation = {
      ibm: (this.ibm.value !== null) ? +this.ibm.value : 0,
      nombre: this.nombre.value ?? "",
      rol_id: this.selectedRol ?? 0,
      departamento_id: this.selectedDep ?? 0,
      area_id: this.selectedArea ?? 0,
    }

    this.userService.newUsert(newUser).subscribe({
      next(value: User) {
        console.log("si jala!")
        self.router.navigate(['/usuarios'])
      },
      error(err: HttpResponse) {
        switch (err.status) {
          case 422:
            self.errorMessage = 'Campos obligatorios, por favor introduce un valor adecuado';
            console.log(err)
            break;
          default:
            // Errores generales
            self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
            console.log(err)
            break;
        }
      },
    })
  }

  goBack() {
    history.back();
  }


}
