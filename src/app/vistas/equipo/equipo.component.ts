import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import { UsersService } from '../../servicios/users.service';
import { NgFor } from '@angular/common';
import { EquipoIdea } from '../../interfaces/equipo-idea';
import { EquiposService } from '../../servicios/equipos.service';
import { Equipo } from '../../interfaces/equipo';
import { UsuarioEquipo } from '../../interfaces/usuario-equipo';
import { RequestEquipo } from '../../interfaces/request-equipo';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [AppNavbarComponent, FormsModule, ReactiveFormsModule, RouterLink, NgFor],
  templateUrl: './equipo.component.html',
  styleUrl: './equipo.component.css'
})
export class EquipoComponent implements OnInit {
colabSelected: number | null = null
colaboradores: User[] = []
id: number | null = null
equipoID: number | null = null
constructor(protected router: Router, protected userService: UsersService, private route: ActivatedRoute, protected equipoService: EquiposService){
  this.route.params.subscribe(params => {
    const id = params['id'];
    this.id = id
  });
}


ngOnInit(): void {
  this.getColaboradores()
  this.getEquipo()
  console.log("id idea: ",this.id)
}
getColaboradores(){
  let self = this
  this.userService.colaboradores()
  .subscribe(colabs => {
    this.colaboradores = colabs.users;
    console.log(this.colaboradores)
  }); 
}

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
      id_usuario: this.colabSelected ?? 0,
      id_equipo: equipoData.equipoID ?? 0,
    };

    this.equipoService.agregar(userteam).subscribe({
      next(value: UsuarioEquipo) {
        console.log("Nuevo colaborador:", value);
      },
      error(err) {
        console.log("Error:", err);
      },
    });
  });
}
goBack()
{
  this.router.navigate(['/misIdeas'])
}
}

