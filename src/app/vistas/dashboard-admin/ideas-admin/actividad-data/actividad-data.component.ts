import { Component, OnInit } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { IdeasService } from '../../../../servicios/ideas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Actividad, ActivityData, EditEstado, EditEstado2, EstadoAct } from '../../../../interfaces/actividad';
import { HttpResponse } from '../../../../interfaces/http';
import { FormsModule } from '@angular/forms';

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
        console.log("editado correctamente!")
        self.router.navigate(['/ideas/', self.actividad?.actividad.id_idea])
      },
      error(err) {
        console.log(err)
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
        console.log("editado correctamente!")
        self.router.navigate(['/ideas/', self.actividad?.actividad.id_idea])
      },
      error(err: HttpResponse) {
        switch (err.status) {
          case 422:
            self.errorMessage = 'Debes seleccionar un estado';
            break;
          case 404:
            self.errorMessage = 'Idea no encontrada';
            break;
          default:
            // Errores generales
            self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
            break;
        }
      },
    })
  }

  goBack() {
    history.back()
  }

}
