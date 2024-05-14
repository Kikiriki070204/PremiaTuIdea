import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { User } from '../interfaces/user';
import { UsersService } from '../servicios/users.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [AppNavbarComponent, FormsModule, ReactiveFormsModule, RouterLink, NgFor],
  templateUrl: './equipo.component.html',
  styleUrl: './equipo.component.css'
})
export class EquipoComponent implements OnInit {
colaboradores: User[] = []
constructor(protected userService: UsersService){}
ngOnInit(): void {
  this.getColaboradores()
}
getColaboradores(){
  let self = this
  this.userService.colaboradores()
  .subscribe(colabs => {
    this.colaboradores = colabs;
    console.log(this.colaboradores)
  }); 
}

getEquipo(){

}

}
