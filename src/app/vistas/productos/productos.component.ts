import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { Route, Router, RouterLink } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { Producto } from '../../interfaces/producto';
import { Profile } from '../../interfaces/profile';
import { UsersService } from '../../servicios/users.service';
import { AuthService } from '../../servicios/auth.service';
import { Canjear } from '../../interfaces/producto';
import { environment } from '../../../enviroment/enviroment';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  productos: any = []
  user_rol: number | null = null
  listaProductos: boolean | null = null// false es asc y true dsc
  totalItems: number = 0
  pageSize: number = 15
  currentPage: number = 1
  Math = Math;

  user: any | null = null

  imagenUrl: string | null = null;

  constructor(protected userService: UsersService, protected router: Router, protected authService: AuthService) { }
  ngOnInit(): void {
    this.listaProductos = false
    this.meplus()
    this.productosDsc(this.currentPage)
    this.getRol()
  }

  premiosDisponibles(page: number): void {
    this.userService.premiosDisponibles()
      .subscribe(myProducts => {
        this.productos = myProducts.productos;
        console.log(this.productos)
      });
  }

  getRol() {
    this.user_rol = this.authService.getRoleId()
    console.log("user rol: ", this.user_rol)
  }

  getImageUrl(path: string): string {
    return `${environment.api_url_images}/storage/` + path.replace('public/', '')
  }

  meplus() {
    let self = this

    this.authService.meplus().subscribe({
      next(value: Profile) {
        self.user = value
      },
      error(err) {
        console.log(err)
      },
    })
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

  getUser() {
    this.user = this.authService.getUser()
  }

  canjearProducto(id_producto: any) {
    let self = this

    let canjear: Canjear = {
      id: id_producto
    }

    this.userService.canjearProducto(canjear).subscribe(
      {
        next(value) {
          self.router.navigate(['/premios'])
        },
        error(err) {
          console.log(err)
        },
      }
    )
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
