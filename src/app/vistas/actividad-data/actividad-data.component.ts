import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { DatePipe, NgFor } from '@angular/common';
import { IdeasService } from '../../servicios/ideas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Actividad, ActivityData, EditEstado, EditEstado2, EstadoAct } from '../../interfaces/actividad';

@Component({
  selector: 'app-actividad-data',
  standalone: true,
  imports: [AppNavbarComponent, NgFor],
  templateUrl: './actividad-data.component.html',
  styleUrl: './actividad-data.component.css'
})
export class ActividadDataComponent implements OnInit{

  id: number | null = null
  actividad: ActivityData | null = null
  estados: EstadoAct[] | null = null
  selectedEstado: number | null = null

  fecha = new Date()
fecha_fin: string | null = null
  constructor(private datePipe: DatePipe, protected actService: IdeasService, protected router: Router, private route: ActivatedRoute){
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

  actividadData(): void{
    this.actService.actividadData(this.id).subscribe(
      actividadData=>{
        this.actividad = actividadData
        console.log(this.actividad)
      }
    )
  }

  getEstados(): void{
    this.actService.getEstadoAct().subscribe(
      estadosAct =>{
        this.estados = estadosAct.estados
      }
    )
  }

  onEstadoChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedEstado = parseInt(selectedValue, 10);
    console.log("estado: ",this.selectedEstado)
  }
  
  editarEstadoFinal()
  {
    let self = this
    let estado: EditEstado = {
      id: this.id ?? 0,
      id_idea: this.actividad?.actividad.id_idea ?? 0,
      titulo: this.actividad?.actividad.titulo ?? "",
      responsable: this.actividad?.actividad.responsable ?? 0,
      fecha_inicio: this.actividad?.actividad.fecha_inicio || new Date(),
      fecha_finalizacion: this.fecha_fin ?? "",
      id_estado_actividad: this.selectedEstado ?? 0
    }

    this.actService.editarEstadoAct(estado).subscribe({
      next(value) {
        console.log("editado correctamente!")
        self.router.navigate(['/ideas/',self.actividad?.actividad.id_idea])
      },
      error(err) {
        console.log(err)
      },
    })
  }

  editarEstado()
  {
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
        self.router.navigate(['/ideas/',self.actividad?.actividad.id_idea])
      },
      error(err) {
        console.log(err)
      },
    })
  }


}
