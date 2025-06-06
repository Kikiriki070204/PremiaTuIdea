import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { Router, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { UsersService } from '../../servicios/users.service';
import { UsuarioPremio } from '../../interfaces/producto';
import { AuthService } from '../../servicios/auth.service';
import { Profile } from '../../interfaces/profile';

@Component({
  selector: 'app-premios',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './premios.component.html',
  styleUrl: './premios.component.css'
})
export class PremiosComponent implements OnInit {
  premios: UsuarioPremio[] | null = null
  user_id: number | null = null
  userInfo: Profile | null = null
  constructor(protected userService: UsersService, protected router: Router, protected authService: AuthService) { }

  ngOnInit(): void {
    this.premiosCanjeados()
    this.user()
    //this.getRol()
  }

  premiosCanjeados(): void {
    this.userService.premiosCanjeados().subscribe(
      premiosCanj => {
        this.premios = premiosCanj.premios
        console.log(this.premios)
      }
    )
  }
  /*
  getRol(){
    this.user_rol = this.authService.getRol()
    console.log("user rol: ", this.user_rol)
  }
    */

  user() {
    let self = this

    this.authService.meplus().subscribe({
      next(value: Profile) {
        self.userInfo = value
        self.user_id = value.rol_id
        console.log(self.userInfo)
        console.log(self.user_id)
      },
      error(err) {
        console.log(err)
      },
    })
  }

}
