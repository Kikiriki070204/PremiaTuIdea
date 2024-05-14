import { Component } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IdeasService } from '../servicios/ideas.service';
import { Idea } from '../interfaces/idea';
import { NewIdea } from '../interfaces/new-idea';

@Component({
  selector: 'app-new-idea',
  standalone: true,
  imports: [AppNavbarComponent, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './new-idea.component.html',
  styleUrl: './new-idea.component.css'
})
export class NewIdeaComponent {
//aun hay dudas con lo del servidor de fotos
//por el momento el campo de condiciones actuales no tiene valor real y no se almacena
titulo = new FormControl('', Validators.required)
antecedentes = new FormControl('', Validators.maxLength(2000))
//condicion_actual = new FormControl()
propuesta = new FormControl('', Validators.maxLength(2000))

constructor(protected ideaService: IdeasService, protected router: Router){}

idea()
{
  let self = this
  let newIdea: NewIdea = {
    titulo: this.titulo.value ?? "",
    antecedentes: this.antecedentes.value ?? "",
    propuesta: this.propuesta.value ?? ""
  }

  this.ideaService.newIdea(newIdea).subscribe({
    next(value: Idea) {
      console.log("idea id:", value.id)
      self.router.navigate(['/newIdea/add'])
    },
  })
}

goBack()
{
  this.router.navigate(['/misIdeas'])
}

}
