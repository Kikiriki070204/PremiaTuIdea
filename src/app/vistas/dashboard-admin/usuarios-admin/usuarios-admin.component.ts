import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserName, Usuario } from '../../../interfaces/user';
import { UsersService } from '../../../servicios/users.service';
import { ExportExcelService } from '../../../servicios/export-excel.service';
import Swal from 'sweetalert2';

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
  exportando = false;
  resetando = false;

  Math = Math;


  constructor(protected userService: UsersService, private exportExcel: ExportExcelService) { }
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


  exportarUsuarios(): void {
    this.exportando = true;
    this.userService.allUsersForExport().subscribe({
      next: (response) => {
        const date = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
        this.exportExcel.exportUsuarios(response.users ?? [], date);
        this.exportando = false;
      },
      error: () => { this.exportando = false; }
    });
  }

  resetearPuntos(): void {
    Swal.fire({
      title: 'Restablecer todos los puntos',
      text: '¿Estás seguro? Esto pondrá en 0 los puntos de TODOS los usuarios. Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, restablecer',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'bg-red-600 text-white hover:bg-red-700 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out',
        cancelButton: 'bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out',
        actions: 'flex gap-4 justify-center'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetando = true;
        this.userService.resetAllPuntos().subscribe({
          next: () => {
            this.resetando = false;
            Swal.fire({
              title: '¡Listo!',
              text: 'Los puntos de todos los usuarios han sido restablecidos a 0.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              customClass: {
                confirmButton: 'bg-blue-800 text-white hover:bg-blue-900 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out'
              },
              buttonsStyling: false
            });
          },
          error: () => {
            this.resetando = false;
            Swal.fire({
              title: 'Error',
              text: 'No se pudieron restablecer los puntos. Intenta de nuevo.',
              icon: 'error',
              confirmButtonText: 'Cerrar',
              customClass: {
                confirmButton: 'bg-red-600 text-white hover:bg-red-700 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out'
              },
              buttonsStyling: false
            });
          }
        });
      }
    });
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
