import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { User, Usuario, UserName } from '../../interfaces/user';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { UsersService } from '../../servicios/users.service';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [AppNavbarComponent, RouterLink, NgFor, ReactiveFormsModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
usuarios: Usuario[] = []
nombre = new FormControl('',Validators.required)

constructor(protected userService: UsersService){}
ngOnInit(): void {
  this.allUsers()
}

allUsers(): void
{
  this.userService.allUsers()
    .subscribe(users => {
      this.usuarios = users.users;
      console.log("usuarios")
      console.log(this.usuarios)
    }); 
}

usersByName(): void{
  let self = this
  let nombre: UserName = {
    nombre: this.nombre.value ?? ""
  }

  this.userService.usersByName(nombre).subscribe(
    usuarios=>{
      this.usuarios = usuarios.users
    }
  )
  
}

}
