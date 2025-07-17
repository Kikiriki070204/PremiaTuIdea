import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categoria-idea',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './categoria-idea.component.html',
  styleUrl: './categoria-idea.component.css'
})
export class CategoriaIdeaComponent {
  opciones = [
    { id: 1, nombre: 'Ideas de mejora' },
    { id: 2, nombre: 'Lean workshops' },
    { id: 3, nombre: 'Cambio de nivel de técnicos' },
    { id: 4, nombre: 'Scrap/CI' },
    { id: 5, nombre: 'OE' },
    { id: 10, nombre: 'Ahorro de energía' }
  ];
  errorMessage: string | null = null;

  opcionSeleccionada: number | null = null;

  constructor(private router: Router) { }

  seleccionar(id: number) {
    // Si el usuario vuelve a hacer clic sobre la misma opción, la deselecciona
    this.opcionSeleccionada = this.opcionSeleccionada === id ? null : id;
  }

  irASiguiente() {
    if (this.opcionSeleccionada) {
      this.router.navigate(['/newIdea', this.opcionSeleccionada]);
    }
    else {
      this.errorMessage = "Porfavor seleccione un origen de mejora para continuar."
    }
  }
  irAtras() {
    history.back();
  }
}
