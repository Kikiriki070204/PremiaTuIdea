import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IdeasService } from '../../servicios/ideas.service';
import { EstadoIdea, IdeaData, Puntos } from '../../interfaces/idea';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { NgFor, NgIf } from '@angular/common';
import { Colaborador, User } from '../../interfaces/user';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Estado } from '../../interfaces/idea';
import { Actividad } from '../../interfaces/actividad';
import { HttpResponse } from '../../interfaces/http';

@Component({
  selector: 'app-idea-data',
  standalone: true,
  imports: [AppNavbarComponent, NgFor, FormsModule, ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './idea-data.component.html',
  styleUrl: './idea-data.component.css'
  
})
export class IdeaDataComponent implements OnInit{
errorMessage: string | null = null
Message: string | null = null
idea: IdeaData | null = null
idea_id: number | null = null
colaboradores: [User] | null = null
estados: EstadoIdea[] | null = null
check = false
//datos para editar
titulo= new FormControl
antecedentes = new FormControl
propuesta = new FormControl
actividades: Actividad[] | null = null

selectedEstado: number | null = null

puntos = new FormControl(Validators.required)
  constructor(private activatedRoute: ActivatedRoute, protected ideaService: IdeasService, protected router: Router) {}

ngOnInit() {
  this.activatedRoute.params.subscribe(params => {
    var idea_id = params['id']; 
    this.idea_id = idea_id
    console.log(params['id'])
  });
  this.ideaData()
  this.estadoIdeas()
  this.actividadesByIdea()
  if(this.idea?.idea.estatus == 3){
    this.asignarDisabled()
  }
  
}

ideaData()
  {
    let self = this
    this.ideaService.ideaData(this.idea_id)
    .subscribe({
      next(value: IdeaData){
          self.idea = value;
          self.colaboradores = value.colaboradores
      },
      error(err: HttpResponse){
        self.router.navigate(['**']) 
      }
    }); 
  }

  asignarPuntos(){
    let self = this
    let puntos: Puntos = {
      id : this.idea_id ?? 0,
      puntos: (this.puntos.value !== null) ? +this.puntos.value : 0,
    }
    console.log("puntos", this.puntos)
    this.ideaService.asignarPuntos(puntos).subscribe({
      next(value: User ) {
        console.log("puntos asignados correctamente!")
        self.Message = '¡Puntos asignados correctamente!'
        
        //hay que poner un alert bonito que diga puntos asignados
      },
      error(err) {
        console.log(err)
      },
    })
  }

  estadoIdeas(): void{
    this.ideaService.estadoIdeas().subscribe(
      estadosIdeas => {
        this.estados = estadosIdeas.estados;
        console.log(this.estados);
      }
    );
  }

  onEstadoChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedEstado = parseInt(selectedValue, 10);
    console.log("estado: ",this.selectedEstado)
  }
  
  editarEstado()
  {
    let self = this
    let estado: Estado = {
      id: this.idea_id ?? 0,
      titulo: this.idea?.idea.titulo ?? "",
      antecedentes: this.idea?.idea.antecedente ?? "",
      propuesta: this.idea?.idea.propuesta ?? "",
      estatus: this.selectedEstado ?? 0
    }

    this.ideaService.editarEstado(estado).subscribe({
      next(value) {
        console.log("editado correctamente!")
        self.router.navigate(['/ideas'])
      },
      error(err: HttpResponse) {
        switch(err.status)
        {
          case 422:
              self.errorMessage = 'Debes seleccionar un estado';
              break;
            case 404:
              self.errorMessage = 'Idea no encontrada';
              break;
            default:
                // Errores generales
                self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
                break;
        }
      },
    })
  }

  actividadesByIdea()
  {
    this.ideaService.actividades(this.idea_id).subscribe(
      actividadesIdea => {
      this.actividades = actividadesIdea.actividades
      console.log(this.actividades);
    })
  }


  
asignarDisabled(){
  let state: boolean | null = null
  if(this.idea?.idea.estatus == 3)
  {
      state = true
  }
  else{
    state = false
  }
  console.log("check!:", state)
  return state
}

newAct(){
  this.router.navigate(['/newActivity/', this.idea_id])
}
}
