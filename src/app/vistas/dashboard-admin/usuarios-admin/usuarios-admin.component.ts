import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserName, Usuario } from '../../../interfaces/user';
import { UsersService } from '../../../servicios/users.service';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [RouterLink, NgFor, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.css'
})
export class UsuariosAdminComponent implements OnInit {

  usersList: any = []
  totalItems: number = 0
  pageSize: number = 15
  currentPage: number = 1
  nombre = new FormControl(null, Validators.required)

  Math = Math;


  constructor(protected userService: UsersService) { }
  ngOnInit(): void {
    this.getUsers(this.currentPage)
  }


  getUsers(page: number) {
    this.currentPage = page;
    this.userService.allUsers(page).subscribe((response) => {

      this.usersList = response.users
      console.log(this.usersList)
    }, (error) => {
      this.usersList = [];
      console.log("Error al cargar usuarios")

    })
  }

  getPages(): number[] {
    if (!this.usersList) return [];

    const total = this.usersList.last_page || 1;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  onPageChange(page: number): void {
    this.getUsers(page);
  }


  usersByName(): void {
    let self = this
    let nombre: UserName = {
      nombre: this.nombre.value ?? ""
    }

    this.userService.usersByName(nombre).subscribe(
      usuarios => {
        this.usersList = usuarios.users

      }
    )
  }



}
