import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import { UsersService } from '../../servicios/users.service';
import { NgFor, NgIf } from '@angular/common';
import { EquipoIdea } from '../../interfaces/equipo-idea';
import { EquiposService } from '../../servicios/equipos.service';
import { Equipo } from '../../interfaces/equipo';
import { UsuarioEquipo } from '../../interfaces/usuario-equipo';
import { RequestEquipo } from '../../interfaces/request-equipo';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [AppNavbarComponent, FormsModule, ReactiveFormsModule, RouterLink, NgFor, NgIf],
  templateUrl: './equipo.component.html',
  styleUrl: './equipo.component.css'
})
export class EquipoComponent implements OnInit {
colabSelected: number | null = null
colaboradores: User[] = []
id: number | null = null
equipoID: number | null = null

//modal properties:
colabs: number[] = []
selectedItem: number | null = null
constructor(protected router: Router, protected userService: UsersService, private route: ActivatedRoute, protected equipoService: EquiposService){
  this.route.params.subscribe(params => {
    const id = params['id'];
    this.id = id
    this.getColaboradores()
  });
}


ngOnInit(): void {
  this.getEquipo()
  console.log("id idea: ",this.id)
}

//modal methods
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
  debounceTime(500)
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
//

getEquipo(){
let self = this
let idea: EquipoIdea = {
  id_idea: this.id ?? 0
}

this.equipoService.equipo(idea).subscribe({
  next(value: Equipo ) {
    // llevarlo a su dashboard.
    console.log("id equipo: ",value.equipoID)
  },
  error(err) {
    console.log(err)
  },
})
return this.equipoService.equipo(idea);
}

agregarColab() {
  let self = this;

  self.getEquipo().subscribe((equipoData) => {
    let userteam: RequestEquipo = {
      id_usuarios: this.colabs,
      id_equipo: equipoData.equipoID ?? 0,
    };

    this.equipoService.agregar(userteam).subscribe({
      next(value: UsuarioEquipo) {
        console.log("colaboradores:", value);
        self.router.navigate(['/ideas'])
      },
      error(err) {
        console.log("Error:", err);
      },
    });
  });
}
goBack()
{
  this.router.navigate(['/ideas'])
}
}

