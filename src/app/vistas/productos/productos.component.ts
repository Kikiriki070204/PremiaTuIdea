import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { Route, Router, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { Producto } from '../../interfaces/producto';
import { Profile } from '../../interfaces/profile';
import { UsersService } from '../../servicios/users.service';
import { AuthService } from '../../servicios/auth.service';
import { Canjear } from '../../interfaces/producto';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [AppNavbarComponent, RouterLink, NgFor],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = []
  user_rol: number | null = null

  user: Profile | null = null
  constructor(protected userService: UsersService, protected router: Router, protected authService: AuthService) { }
  ngOnInit(): void {
    this.meplus()
    this.premiosDisponibles()
    this.getRol()
  }

  premiosDisponibles(): void {
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



}
