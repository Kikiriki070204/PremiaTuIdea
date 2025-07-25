import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IdeasService } from '../../servicios/ideas.service';
import { Idea } from '../../interfaces/idea';
import { NewIdea } from '../../interfaces/new-idea';
import { HttpResponse } from '../../interfaces/http';
import { DatePipe, NgFor, NgIf, NgClass } from '@angular/common';
import { UsersService } from '../../servicios/users.service';
import { Area } from '../../interfaces/activar';

@Component({
  selector: 'app-new-idea',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './new-idea.component.html',
  styleUrl: './new-idea.component.css'
})
export class NewIdeaComponent implements OnInit {
  fecha = new Date()
  fecha_inicio: string | null = null
  areas: Area[] | null = null
  selectedArea: string | null = null
  idCategoriaSeleccionado: number | null = null;

  errorMessage: string | null = null
  titulo = new FormControl('', Validators.required)
  antecedentes = new FormControl('', Validators.maxLength(4000))
  propuesta = new FormControl('', Validators.maxLength(4000))
  condiciones: File | null = null
  fecha_inicial = new FormControl('', Validators.required)
  area = new FormControl()

  categoria: string | null = null

  constructor(private datePipe: DatePipe, protected ideaService: IdeasService, protected router: Router, protected userService: UsersService, private route: ActivatedRoute) {
    this.fecha_inicio = this.datePipe.transform(this.fecha, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    const raw = this.route.snapshot.paramMap.get('id');
    this.idCategoriaSeleccionado = raw ? +raw : null;
    this.getAreas()
    this.categorias()
    console.log(this.idCategoriaSeleccionado)
  }

  onFileSelected(event: any): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.condiciones = fileInput.files[0];
    } else {
      this.condiciones = null;
    }
  }
  getAreas(): void {
    this.userService.allAreas()
      .subscribe(Areas => {
        this.areas = Areas.areas;
        console.log(this.areas)
      });
  }
  onAreaChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedArea = String(selectedValue)
  }

  async idea() {
    let self = this
    let formData: FormData = new FormData();
    formData.append('titulo', this.titulo.value ?? "");
    formData.append('antecedentes', this.antecedentes.value ?? "");

    formData.append('propuesta', this.propuesta.value ?? "");
    if (this.condiciones) {
      formData.append('condiciones', this.condiciones);
    }
    else {
      console.log("No selecciono niguna imagen")
      // Load the default image/file from the project (assuming it's in the assets folder)
      const defaultImageUrl = 'assets/borgwarner_logo.png';  // Adjust this path accordingly

      const response = await fetch(defaultImageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'default-image.png', { type: blob.type });


      formData.append('condiciones', file);
    }
    formData.append('fecha_inicio', this.fecha_inicial.value ?? "")
    if (this.selectedArea) {
      formData.append('area_id', this.selectedArea ?? "")
    } else {
      formData.append('area_id', "6");
    }
    formData.append('categoria_id', String(this.idCategoriaSeleccionado ?? 1))

    if (this.idCategoriaSeleccionado != 1) {
      formData.append('contable', "1")
    }



    this.ideaService.newIdea(formData).subscribe({
      next(value: Idea) {
        console.log("idea id:", value.id)
        self.router.navigate(['/newIdea/add', value.id])
      },
      error(err: HttpResponse) {
        switch (err.status) {
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
            if (err.error.msg == 'Error al guardar la idea e imagen') {
              self.errorMessage = 'Error al guardar la imagen. Intentelo de nuevo.';
              console.log(err)
            }
            else {
              self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
              console.log(err)
            }

            break;
        }
      },
    })
  }

  goBack() {
    history.back();
  }

  categorias() {
    switch (this.idCategoriaSeleccionado) {
      case 1:
        this.categoria = "Ideas de mejora";
        break;
      case 2:
        this.categoria = "Lean workshops";
        break;
      case 3:
        this.categoria = "Cambio de nivel de técnicos";
        break;
      case 4:
        this.categoria = "Scrap/CI";
        break;
      case 5:
        this.categoria = "OE";
        break;
      case 10:
        this.categoria = "Ahorro de energía";
        break;
      default:
        this.categoria = null;
    }
  }


}
