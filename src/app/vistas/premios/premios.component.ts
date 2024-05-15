import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { Router, RouterLink } from '@angular/router';
import { Producto } from '../../interfaces/producto';
import { UsersService } from '../../servicios/users.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-premios',
  standalone: true,
  imports: [AppNavbarComponent, RouterLink,NgFor ],
  templateUrl: './premios.component.html',
  styleUrl: './premios.component.css'
})
export class PremiosComponent implements OnInit{
productos: Producto[] = []

constructor(protected userService: UsersService, protected router: Router){}
ngOnInit(): void {
  this.premiosDisponibles()
}

premiosDisponibles(): void
  {
    this.userService.premiosDisponibles()
    .subscribe(myProducts => {
      this.productos = myProducts.productos;
      console.log(this.productos)
    }); 
  }
}
