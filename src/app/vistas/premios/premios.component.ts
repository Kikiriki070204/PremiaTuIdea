import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { Router, RouterLink } from '@angular/router';
import { Producto } from '../../interfaces/producto';
import { UsersService } from '../../servicios/users.service';
import { NgFor } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { User } from '../../interfaces/user';
import { Profile } from '../../interfaces/profile';

@Component({
  selector: 'app-premios',
  standalone: true,
  imports: [AppNavbarComponent, RouterLink,NgFor ],
  templateUrl: './premios.component.html',
  styleUrl: './premios.component.css'
})
export class PremiosComponent implements OnInit{
productos: Producto[] = []
user_rol: string | null = null

user: Profile | null = null
constructor(protected userService: UsersService, protected router: Router, protected authService: AuthService){}
ngOnInit(): void {
  this.meplus()
  this.premiosDisponibles()
  this.getRol()
}

premiosDisponibles(): void
  {
    this.userService.premiosDisponibles()
    .subscribe(myProducts => {
      this.productos = myProducts.productos;
      console.log(this.productos)
    }); 
  }

  getRol(){
    this.user_rol = this.authService.getRol()
    console.log("user rol: ", this.user_rol)
  }

  meplus(){
    let self = this

    this.authService.meplus().subscribe({
      next(value: Profile ) {
        self.user = value
      },
      error(err) {
        console.log(err)
      },
    })
  }
}
