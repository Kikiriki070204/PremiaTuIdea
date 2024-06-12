import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import { UsersService } from '../../servicios/users.service';
import { NgFor, NgIf } from '@angular/common';
import { EquipoIdea } from '../../interfaces/equipo-idea';
import { EquiposService } from '../../servicios/equipos.service';
import { Equipo } from '../../interfaces/equipo';
import { UsuarioEquipo } from '../../interfaces/usuario-equipo';
import { RequestEquipo } from '../../interfaces/request-equipo';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpResponse } from '../../interfaces/http';

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
searchChanged = new Subject<string>();
allColaboradores: User[] = []
//modal properties:
checkboxModel = new FormControl
checkboxStates: { [id: number]: boolean } = {};

colabs: number[] = []
selectedItem: number | null = null
constructor(protected router: Router, protected userService: UsersService, private route: ActivatedRoute, protected equipoService: EquiposService){
  this.route.params.subscribe(params => {
    const id = params['id'];
    this.id = id
  });

  this.searchChanged.pipe(
    debounceTime(500)
  ).subscribe(value => {
    this.filterColaboradores(value);
  });
}


ngOnInit(): void {
  this.getEquipo()
  console.log("id idea: ",this.id)
  this.getAllColaboradores()
}

//modal methods
getAllColaboradores(): void {
  this.userService.colaboradores().subscribe(
    colabs => {
      this.allColaboradores = colabs.users;
      this.colaboradores = [...this.allColaboradores];
      console.log(this.colaboradores);
    }
  );
}

inputChanged($event: any): void {
  const value = $event.target.value.toLowerCase();
  this.searchChanged.next(value);
}
 
filterColaboradores(value: string): void {
  if (value.length <= 0) {
    this.colaboradores = [...this.allColaboradores];
  } else {
    const items: User[] = this.allColaboradores.filter((user) =>
      user.nombre.toLowerCase().includes(value)
    );
    console.log("lot of things happening")
    console.log(items)
    this.colaboradores = items;
  }
 
  // Update isChecked for each colaborador
  this.colaboradores.forEach(colaborador => {
    colaborador.isChecked = this.checkboxStates[colaborador.id] || false;
  });
}

checkboxChanged(item: any, event: Event) {
  const isChecked = (event.target as HTMLInputElement).checked;
  this.checkboxStates[item] = isChecked;
 
  if (isChecked) {
    this.colabs.push(item);
    console.log(this.colabs)
  } else {
    // Si se desmarca el checkbox, verifica si el elemento está en el array
    const index = this.colabs.indexOf(item);
    if (index !== -1) {
      // Si está presente, elimínalo del array
      this.colabs.splice(index, 1);
    }
  }
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
  error(err: HttpResponse) {
    switch(err.status)
    {
      case 422: 
      self.router.navigate(['**'])
      console.log(err)
      break;
      default:
        console.log(err)
        break;
    }
    
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
      id: this.id ?? 0
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

