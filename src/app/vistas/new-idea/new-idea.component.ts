import { Component } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IdeasService } from '../../servicios/ideas.service';
import { Idea } from '../../interfaces/idea';
import { NewIdea } from '../../interfaces/new-idea';
import { HttpResponse } from '../../interfaces/http';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-new-idea',
  standalone: true,
  imports: [AppNavbarComponent, FormsModule, ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './new-idea.component.html',
  styleUrl: './new-idea.component.css'
})
export class NewIdeaComponent {
  errorMessage: string | null = null
//aun hay dudas con lo del servidor de fotos
//por el momento el campo de condiciones actuales no tiene valor real y no se almacena
titulo = new FormControl('', Validators.required)
antecedentes = new FormControl('', Validators.maxLength(2000))
//condicion_actual = new FormControl()
propuesta = new FormControl('', Validators.maxLength(2000))
condiciones: File | null = null
constructor(protected ideaService: IdeasService, protected router: Router){}

onFileSelected(event: any): void {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    this.condiciones = fileInput.files[0];
  } else {
    this.condiciones = null;
  }
}


idea()
{
  let self = this
  let newIdea: NewIdea = {
    titulo: this.titulo.value ?? "",
    antecedentes: this.antecedentes.value ?? "",
    propuesta: this.propuesta.value ?? "",
    condiciones: this.condiciones as File 
  }

  this.ideaService.newIdea(newIdea).subscribe({
    next(value: Idea) {
      console.log("idea id:", value.id)
      self.router.navigate(['/newIdea/add', value.id])
    },
    error(err: HttpResponse) {
      switch(err.status)
      {
        case 422:
            self.errorMessage = 'Campos obligatorios, por favor introduce un valor adecuado';
            console.log(err)
            break;
          case 404:
            self.errorMessage = 'Idea no encontrada';
            console.log(err)
            break;
          default:
              // Errores generales
              self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
              console.log(err)
              break;
      }
    },
  })
}

goBack()
{
  this.router.navigate(['/misIdeas'])
}



}
