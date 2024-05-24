import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { Router, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { UsersService } from '../../servicios/users.service';
import { UsuarioPremio } from '../../interfaces/producto';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-premios',
  standalone: true,
  imports: [AppNavbarComponent, RouterLink,NgFor ],
  templateUrl: './premios.component.html',
  styleUrl: './premios.component.css'
})
export class PremiosComponent implements OnInit{
premios: UsuarioPremio[] | null = null
user_rol: string| null = null
constructor(protected userService: UsersService, protected router: Router, protected authService: AuthService){}

ngOnInit(): void {
  this.premiosCanjeados()
  this.getRol()
}

premiosCanjeados(): void{
  this.userService.premiosCanjeados().subscribe(
    premiosCanj =>{
      this.premios = premiosCanj.premios
      console.log(this.premios)
    }
  )
}

getRol(){
  this.user_rol = this.authService.getRol()
  console.log("user rol: ", this.user_rol)
}

}
