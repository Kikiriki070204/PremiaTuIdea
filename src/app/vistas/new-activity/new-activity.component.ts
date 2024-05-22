import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { UsersService } from '../../servicios/users.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-new-activity',
  standalone: true,
  imports: [AppNavbarComponent, ReactiveFormsModule, FormsModule, NgFor, NgIf],
  templateUrl: './new-activity.component.html',
  styleUrl: './new-activity.component.css'
})
export class NewActivityComponent implements OnInit{
  colabSelected: number | null = null
  colaboradores: User[] = []
  responsable: number | null = null
selectedItem: number | null = null
selectModel = new FormControl
  constructor(protected userService: UsersService){}

  ngOnInit(): void {
    this.getColaboradores()
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
      this.getColaboradores()
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
    
    console.log(this.selectedItem)
  }
}
