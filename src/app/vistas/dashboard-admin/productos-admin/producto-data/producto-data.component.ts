import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EditarProducto, Producto, ProductoData } from '../../../../interfaces/producto';
import { UsersService } from '../../../../servicios/users.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpResponse } from '../../../../interfaces/http';
import Swal from 'sweetalert2';
import { ProductoService } from '../../../../servicios/producto.service';

@Component({
  selector: 'app-producto-data',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './producto-data.component.html',
  styleUrl: './producto-data.component.css'
})
export class ProductoDataComponent implements OnInit {
  producto: ProductoData | null = null
  id: number | null = null
  errorMessage: string | null = null
  selectedActive: number | null = null

  imagenUrl: string | null = null;


  valor = new FormControl('', Validators.required)
  nombre = new FormControl('', Validators.required)
  precio = new FormControl('', Validators.required)


  constructor(protected productoService: UsersService, protected router: Router, private route: ActivatedRoute, protected productoServiceImagen: ProductoService) {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.id = id
    });
  }

  ngOnInit(): void {
    this.productData()

    console.log("activo: ", this.selectedActive)
  }

  productData(): void {

    this.productoService.productoData(this.id).subscribe(
      product => {
        this.producto = product
        this.selectedActive = this.producto.producto.is_active
        console.log(this.producto)
        this.productoImagen()
      }


    )

  }

  productoImagen() {
    const id = this.producto?.producto?.id;

    if (id) {
      this.productoServiceImagen.getImagenProducto(id).subscribe({
        next: (blob) => {
          this.imagenUrl = URL.createObjectURL(blob);
          console.log('Imagen obtenida correctamente:', this.imagenUrl);
        },
        error: (err) => {
          console.error('Error al obtener imagen:', err);
          this.imagenUrl = null;
        }
      });
    }
  }

  onEstadoChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedActive = parseInt(selectedValue, 10)
    console.log("estado: ", this.selectedActive)
    console.log("puntos:", this.producto?.producto.valor)
  }

  editar() {
    const formData = new FormData();

    formData.append('id', String(this.producto?.producto.id ?? 0));
    formData.append('nombre', this.nombre.value || this.producto?.producto.nombre || '');
    formData.append('valor', String(
      this.valor.value !== null && this.valor.value !== ''
        ? +this.valor.value
        : this.producto?.producto.valor
    ));
    formData.append('precio', String(
      this.precio.value !== null && this.precio.value !== ''
        ? +this.precio.value
        : this.producto?.producto.precio
    ));
    formData.append('is_active', String(this.selectedActive ?? this.producto?.producto.is_active ?? 0));

    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }

    this.productoService.editarProducto(formData).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Producto editado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'bg-blue-800 text-white hover:bg-blue-900 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out',
          },
          buttonsStyling: false
        }).then(() => {
          this.router.navigate(['/admin/productos-admin']);
        });
      },
      error: (err: HttpResponse) => {
        switch (err.status) {
          case 422:
            this.errorMessage = 'Datos no válidos';
            break;
          case 404:
            this.errorMessage = 'Producto no encontrado';
            break;
          default:
            this.errorMessage = 'Ha ocurrido un error. Inténtelo de nuevo.';
            break;
        }
        this.errorAlert(this.errorMessage);
      }
    });
  }


  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }



  errorAlert($message: string) {
    Swal.fire({
      title: 'Error',
      text: $message,
      icon: 'error',
      confirmButtonText: 'Intentar de nuevo',
      customClass: {
        confirmButton: 'bg-red-600 text-white hover:bg-red-700 transition duration-300 ease-in-out font-bold rounded-lg text-sm px-4 py-2',
      }
    });

  }

  goBack() {
    history.back();
  }

}
