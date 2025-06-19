import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../servicios/users.service';
import { Canjear, Producto } from '../../../interfaces/producto';
import { Profile } from '../../../interfaces/profile';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../servicios/auth.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-productos-admin',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './productos-admin.component.html',
  styleUrl: './productos-admin.component.css'
})
export class ProductosAdminComponent implements OnInit {
  productos: Producto[] = []
  user_rol: number | null = null

  user: Profile | null = null
  constructor(protected userService: UsersService, protected router: Router, protected authService: AuthService) { }
  ngOnInit(): void {

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
