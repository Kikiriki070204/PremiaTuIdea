import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { EquiposService } from '../servicios/equipos.service';
import { UsersService } from '../servicios/users.service';
import { Usuarios } from '../interfaces/usuarios';
import { NgFor, NgIf } from '@angular/common';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './example.component.html',
  styleUrl: './example.component.css'
})
export class ExampleComponent {
  colabSelected= new FormControl(Validators.required)
  colabs: number[] = []
  colaboradores: User[] = [];
  selectedItem: number | null = null
  constructor(private userService: UsersService) {
    this.getColaboradores();
  }

  getColaboradores(): void {
    this.userService.colaboradores().subscribe(
      colabs => {
        this.colaboradores = colabs.users;
        console.log(this.colaboradores);
      }
    );
  }

  inputChanged($event: any): void {
    const value = $event.target.value.toLowerCase();

    if (value.length <= 0) {
      this.colaboradores = [];
      console.log("there's nothing here")
      this.getColaboradores();
    }

    const items: User[] = this.colaboradores.filter((user) =>
      user.nombre.toLowerCase().includes(value)
    );
    console.log("lot of things happening")
    console.log(items)
    this.colaboradores = items;
  }

  selected(item: any){
    this.selectedItem = item
    this.colabs.push(item)
    console.log(this.colabs)
  }
}
