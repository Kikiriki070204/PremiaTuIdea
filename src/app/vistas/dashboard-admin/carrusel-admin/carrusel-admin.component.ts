import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarruselService } from '../../../servicios/carrusel.service';
import { CarruselImagen } from '../../../interfaces/carrusel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrusel-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel-admin.component.html',
})
export class CarruselAdminComponent implements OnInit {
  imagenes: CarruselImagen[] = [];
  uploading = false;
  error: string | null = null;

  constructor(private carruselService: CarruselService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.carruselService.adminList().subscribe(res => {
      this.imagenes = res.imagenes;
    });
  }

  imageUrl(id: number): string {
    return this.carruselService.imageUrl(id);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];

    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      this.error = 'Solo se permiten imágenes JPG, PNG o WEBP.';
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      this.error = 'La imagen no puede superar 4 MB.';
      return;
    }

    this.error = null;
    this.uploading = true;

    this.carruselService.upload(file).subscribe({
      next: () => {
        this.uploading = false;
        input.value = '';
        this.load();
      },
      error: () => {
        this.uploading = false;
        this.error = 'Error al subir la imagen. Intenta de nuevo.';
      }
    });
  }

  delete(id: number): void {
    Swal.fire({
      title: '¿Eliminar imagen?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'bg-red-600 text-white font-bold rounded-lg text-sm px-4 py-2 mr-2',
        cancelButton: 'bg-gray-200 text-gray-800 font-bold rounded-lg text-sm px-4 py-2',
      },
      buttonsStyling: false,
    }).then(result => {
      if (!result.isConfirmed) return;
      this.carruselService.delete(id).subscribe({
        next: () => this.load(),
        error: () => {
          this.error = 'Error al eliminar la imagen.';
        }
      });
    });
  }
}
