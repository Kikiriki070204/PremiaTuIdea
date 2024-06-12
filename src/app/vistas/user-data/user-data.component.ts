import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { NgFor } from '@angular/common';
import { UsersService } from '../../servicios/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile, UpdateUser } from '../../interfaces/profile';
import { IdeasService } from '../../servicios/ideas.service';
import { Idea } from '../../interfaces/idea';
import { User } from '../../interfaces/user';
import { HttpResponse } from '../../interfaces/http';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [AppNavbarComponent, NgFor, FormsModule, ReactiveFormsModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css'
})
export class UserDataComponent implements OnInit{
errorMessage: string | null = null
id: number | null = null
userProfile: Profile | null = null
ideas: Idea[] | null = null
selectedActive: number | null = null
puntos = new FormControl('',Validators.required)

constructor(protected ideasService: IdeasService, protected userService: UsersService, protected router: Router, private route: ActivatedRoute){
  this.route.params.subscribe(params => {
    const id = params['id'];
    this.id = id
  });
}

ngOnInit(): void {
console.log("id: ", this.id)  
this.userData()
this.userImplementedIdeas()
}

userData(){
  let self = this
  this.userService.userData(this.id)
  .subscribe({
    next(value: Profile){
        self.userProfile = value;
    },
    error(err: HttpResponse){
      if(err.status == 401)
        {
          self.router.navigate(['**']) 
        }
    }
  }); 
}

userImplementedIdeas(): void{
  this.ideasService.ideasImpByUser(this.id).subscribe(
    ideasImp =>{
      this.ideas = ideasImp.ideas
    },
  )
}
onEstadoChange(event: any) {
  const selectedValue = event.target.value;
  this.selectedActive = parseInt(selectedValue,10)
  console.log("estado: ",this.selectedActive)
}

editar(){
  let self = this
  let active: UpdateUser = {
    id: this.id ?? 0,
    ibm: this.userProfile?.ibm ?? 0,
    nombre: this.userProfile?.nombre ?? "",
    rol_id : this.userProfile?.rol_id ?? 0,
    departamento_id: this.userProfile?.departamento_id ?? null, 
    area_id : this.userProfile?.area_id ?? 0,
    is_active: this.selectedActive ?? this.userProfile?.is_active, 
    locacion_id : this.userProfile?.locacion_id ?? null,
    puntos: (this.puntos.value !== null && this.puntos.value !== '') ? +this.puntos.value : this.userProfile?.puntos
  }

  this.userService.updateUser(active).subscribe({
    next(value) {
      self.router.navigate(['/usuarios'])
    },
    error(err: HttpResponse)
    {switch(err.status)
      {
        case 422:
            self.errorMessage = 'Debes seleccionar un estado';
            console.log(err)
            break;
          case 404:
            self.errorMessage = 'Usuario no encontrado';
            console.log(err)
            break;
          default:
              // Errores generales
              self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
              console.log(err)
              break;
      }
    }
  })
  
}  


}
