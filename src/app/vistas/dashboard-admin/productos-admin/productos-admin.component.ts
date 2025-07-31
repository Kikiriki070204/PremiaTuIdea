import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../servicios/users.service';
import { Canjear, Producto } from '../../../interfaces/producto';
import { Profile } from '../../../interfaces/profile';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../servicios/auth.service';
import { CommonModule, NgFor } from '@angular/common';
import { ProductoService } from '../../../servicios/producto.service';
import { environment } from '../../../../enviroment/enviroment';

@Component({
  selector: 'app-productos-admin',
  standalone: true,
  imports: [RouterLink, NgFor, CommonModule],
  templateUrl: './productos-admin.component.html',
  styleUrl: './productos-admin.component.css'
})
export class ProductosAdminComponent implements OnInit {
  productos: any = []
  user_rol: number | null = null
  user: Profile | null = null
  listaProductos: boolean | null = null// false es asc y true dsc
  totalItems: number = 0
  pageSize: number = 15
  currentPage: number = 1
  Math = Math;

  imagenUrl: string | null = null;


  constructor(protected userService: UsersService, protected router: Router, protected authService: AuthService, protected productoServiceImagen: ProductoService) { }
  ngOnInit(): void {
    this.listaProductos = false
    this.productosDsc(this.currentPage)
    this.getRol()
  }

  premiosDisponibles(page: number): void {
    this.currentPage = page;

    this.userService.premiosDisponibles()
      .subscribe(myProducts => {
        this.productos = myProducts.productos;
        console.log(this.productos)
      });
  }

  getImageUrl(path: string): string {
    return `${environment.api_url_images}/storage/` + path.replace('public/', '')
  }


  getPages(): number[] {
    if (!this.productos) return [];

    const total = this.productos.last_page || 1;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  onPageChange(page: number): void {
    if (this.listaProductos === false) {
      this.productosAsc(page)

    } else if (this.listaProductos === true) {
      this.productosDsc(page)
    } else {
      this.premiosDisponibles(page);

    }
  }


  getRol() {
    this.user_rol = this.authService.getRoleId()
    console.log("user rol: ", this.user_rol)
  }

  productosAsc(page: number) {
    this.listaProductos = false
    console.log(this.listaProductos)
    this.userService.premiosDisponiblesAsc(page)
      .subscribe(myProducts => {
        this.productos = myProducts.productos;
      });


  }

  productosDsc(page: number) {
    this.listaProductos = true
    console.log(this.listaProductos)

    this.userService.premiosDisponiblesDsc(page)
      .subscribe(myProducts => {
        this.productos = myProducts.productos;
      });
  }



}
