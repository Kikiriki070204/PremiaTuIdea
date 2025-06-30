import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ActivarService } from '../../../../servicios/activar.service';
import { Router } from '@angular/router';
import { NuevoProducto } from '../../../../interfaces/producto';
import { Producto } from '../../../../interfaces/producto';
import { HttpResponse } from '../../../../interfaces/http';

@Component({
  selector: 'app-new-producto',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './new-producto.component.html',
  styleUrl: './new-producto.component.css'
})
export class NewProductoComponent {
  errorMessage: string | null = null
  constructor(protected productoService: ActivarService, protected router: Router) { }

  nombre = new FormControl('', Validators.required)
  valor = new FormControl(Validators.required)
  url = new FormControl('', Validators.required)

  newProducto() {
    let self = this
    let newProduct: NuevoProducto = {
      nombre: this.nombre.value ?? "",
      valor: (this.valor.value !== null) ? +this.valor.value : 0,
      url: this.url.value ?? ""
    }

    this.productoService.newProduct(newProduct).subscribe({
      next(value: Producto) {
        self.router.navigate(['/premios'])
      },
      error(err: HttpResponse) {
        switch (err.status) {
          case 422:
            self.errorMessage = 'Campos obligatorios, por favor introduce un valor adecuado';
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

  goBack() {
    history.back()
  }
}
