import { Component } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor } from '@angular/common';
import { ActivarService } from '../../servicios/activar.service';
import { Router } from '@angular/router';
import { NuevoProducto } from '../../interfaces/producto';
import { Producto } from '../../interfaces/producto';

@Component({
  selector: 'app-new-producto',
  standalone: true,
  imports: [AppNavbarComponent, FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './new-producto.component.html',
  styleUrl: './new-producto.component.css'
})
export class NewProductoComponent {

  constructor(protected productoService: ActivarService, protected router: Router){}

  nombre = new FormControl('',Validators.required)
  valor = new FormControl(Validators.required)
  url =  new FormControl('',Validators.required)

  newProducto(){
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
      error(err) {
        console.log(err)
      },
    })
  }
}
