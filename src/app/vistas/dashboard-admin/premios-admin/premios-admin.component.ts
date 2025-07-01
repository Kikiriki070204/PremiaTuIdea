import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../servicios/users.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { UsuarioPremio } from '../../../interfaces/producto';
import { Profile } from '../../../interfaces/profile';
import { AuthService } from '../../../servicios/auth.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-premios-admin',
  standalone: true,
  imports: [RouterLink, NgFor, RouterModule],
  templateUrl: './premios-admin.component.html',
  styleUrl: './premios-admin.component.css'
})
export class PremiosAdminComponent implements OnInit {
  premios: UsuarioPremio[] | null = null
  user_id: number | null = null
  userInfo: Profile | null = null

  constructor(
    protected userService: UsersService,
    protected router: Router,
    protected authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user()
    this.premiosCanjeados()
  }

  premiosCanjeados(): void {
    this.userService.premiosCanjeadosAdmin().subscribe(
      premiosCanj => {
        this.premios = premiosCanj.premios
        console.log(this.premios)
      }
    )
  }
  user() {
    this.user_id = this.authService.getRoleId()

  }
}
