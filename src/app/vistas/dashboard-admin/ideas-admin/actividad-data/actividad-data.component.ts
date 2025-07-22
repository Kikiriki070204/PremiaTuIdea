import { Component, OnInit } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { IdeasService } from '../../../../servicios/ideas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Actividad, ActivityData, EditEstado, EditEstado2, EstadoAct } from '../../../../interfaces/actividad';
import { HttpResponse } from '../../../../interfaces/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actividad-data',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './actividad-data.component.html',
  styleUrl: './actividad-data.component.css'
})
export class ActividadDataComponent implements OnInit {
  errorMessage: string | null = null
  id: number | null = null
  actividad: ActivityData | null = null
  estados: EstadoAct[] | null = null
  selectedEstado: number | null = null

  date1: string | null = null

  fecha = new Date()
  fecha_fin: string | null = null
  constructor(private datePipe: DatePipe, protected actService: IdeasService, protected router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.id = id
    });
    this.fecha_fin = this.datePipe.transform(this.fecha, 'yyyy-MM-dd');
    console.log(this.fecha_fin)
  }

  ngOnInit(): void {
    this.actividadData()
    this.getEstados()
    console.log("id: ", this.id)
  }

  actividadData() {
    let self = this
    this.actService.actividadData(this.id)
      .subscribe({
        next(value: ActivityData) {
          self.actividad = value;
        },
        error(err: HttpResponse) {
          self.router.navigate(['**'])
        }
      });
  }

  getEstados(): void {
    this.actService.getEstadoAct().subscribe(
      estadosAct => {
        this.estados = estadosAct.estados
      }
    )
  }

  onEstadoChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedEstado = parseInt(selectedValue, 10);
    console.log("estado: ", this.selectedEstado)
  }

  editarEstadoFinal() {
    let self = this
    let estado: EditEstado = {
      id: this.id ?? 0,
      id_idea: this.actividad?.actividad.id_idea ?? 0,
      titulo: this.actividad?.actividad.titulo ?? "",
      responsable: this.actividad?.actividad.responsable ?? 0,
      fecha_inicio: this.actividad?.actividad.fecha_inicio || new Date(),
      fecha_finalizacion: this.date1 ?? "",
      id_estado_actividad: this.selectedEstado ?? 0
    }

    this.actService.editarEstadoAct(estado).subscribe({
      next(value) {
        Swal.fire({
          title: '¡Éxito!',
          text: 'El estado de la actividad fue editado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'bg-blue-800 text-white hover:bg-blue-900 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out',
          },
          buttonsStyling: false
        }).then(() => {
          self.router.navigate(['/ideas/', self.actividad?.actividad.id_idea])
        });
      },
      error(err) {
        let errorM = 'Ha ocurrido un error al editar el estado de la actividad, inténtalo de nuevo'
        self.errorAlert(errorM);

      },
    })
  }

  editarEstado() {
    let self = this
    let estado: EditEstado2 = {
      id: this.id ?? 0,
      id_idea: this.actividad?.actividad.id_idea ?? 0,
      titulo: this.actividad?.actividad.titulo ?? "",
      responsable: this.actividad?.actividad.responsable ?? 0,
      fecha_inicio: this.actividad?.actividad.fecha_inicio || new Date(),
      id_estado_actividad: this.selectedEstado ?? 0
    }

    this.actService.editarEstadoAct(estado).subscribe({
      next(value) {
        Swal.fire({
          title: '¡Éxito!',
          text: 'El estado de la actividad fue editado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'bg-blue-800 text-white hover:bg-blue-900 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out',
          },
          buttonsStyling: false
        }).then(() => {
          self.router.navigate(['/ideas/', self.actividad?.actividad.id_idea])
        });
      },
      error(err: HttpResponse) {
        switch (err.status) {
          case 422:
            self.errorMessage = 'Debes seleccionar un estado';
            self.errorAlert(self.errorMessage);
            break;
          case 404:
            self.errorMessage = 'Idea no encontrada';
            self.errorAlert(self.errorMessage);
            break;
          default:
            // Errores generales
            self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
            self.errorAlert(self.errorMessage);
            break;
        }
      },
    })
  }

  errorAlert($message: string) {
    Swal.fire({
      title: 'Error',
      text: $message,
      icon: 'error',
      confirmButtonText: 'Intentar de nuevo',
      customClass: {
        confirmButton: 'bg-red-600 text-white hover:bg-red-700 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out',
      }
    });

  }

  goBack() {
    this.router.navigate(['/admin/ideas-admin/revision'])

  }

}
