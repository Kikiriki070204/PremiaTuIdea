import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { User, Usuario } from '../../interfaces/user';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { UsersService } from '../../servicios/users.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [AppNavbarComponent, RouterLink, NgFor],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
usuarios: Usuario[] = []

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

}
