import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ActivarService } from '../../../../servicios/activar.service';
import { Router } from '@angular/router';
import { NuevoProducto } from '../../../../interfaces/producto';
import { Producto } from '../../../../interfaces/producto';
import { HttpResponse } from '../../../../interfaces/http';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-producto',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './new-producto.component.html',
  styleUrl: './new-producto.component.css'
})
export class NewProductoComponent {
  productoForm: FormGroup;
  imagenFile: File | null = null;
  errorMessage: string | null = null;

  constructor(
    protected productoService: ActivarService,
    protected router: Router
  ) {
    this.productoForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      precio: new FormControl('', [Validators.required, Validators.min(0)]),
      valor: new FormControl('', [Validators.required, Validators.min(0)]),
      url: new FormControl('', [Validators.nullValidator]), // Puede ser nulo
    });
  }

  // Captura el archivo de imagen cuando se selecciona
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenFile = input.files[0];
    }
  }

  // Enviar producto
  onSubmit() {
    if (this.productoForm.invalid || !this.imagenFile) {
      this.errorMessage = 'Por favor completa todos los campos requeridos.';
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.productoForm.get('nombre')?.value);
    formData.append('precio', this.productoForm.get('precio')?.value);
    formData.append('valor', this.productoForm.get('valor')?.value);
    formData.append('url', this.productoForm.get('url')?.value || '');
    formData.append('imagen', this.imagenFile);

    this.productoService.newProduct(formData).subscribe({
      next: (producto: Producto) => {
        this.router.navigate(['/premios']);
      },
      error: (err: HttpErrorResponse) => {
        switch (err.status) {
          case 422:
            this.errorMessage =
              'Campos obligatorios inválidos. Por favor revisa tu información.';
            break;
          default:
            this.errorMessage =
              'Ha ocurrido un error al guardar el producto. Intenta nuevamente.';
            break;
        }
        console.error(err);
      },
    });
  }

  goBack() {
    history.back();
  }
}
