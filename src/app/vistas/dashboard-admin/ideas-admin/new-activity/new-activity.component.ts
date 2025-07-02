import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { UsersService } from '../../../../servicios/users.service';
import { User } from '../../../../interfaces/user';
import { ActivatedRoute, Router } from '@angular/router';
import { newActivity } from '../../../../interfaces/actividad';
import { IdeasService } from '../../../../servicios/ideas.service';
import { HttpResponse } from '../../../../interfaces/http';

@Component({
  selector: 'app-new-activity',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgFor, NgIf],
  templateUrl: './new-activity.component.html',
  styleUrl: './new-activity.component.css'
})
export class NewActivityComponent implements OnInit {
  errorMessage: string | null = null
  colabSelected: number | null = null
  colaboradores: User[] = []
  responsable: number | null = null
  selectedItem: number | null = null
  selectModel = new FormControl
  titulo = new FormControl
  date1: string | null = null

  id: number | null = null
  fecha = new Date()
  fecha_inicio: string | null = null
  constructor(private datePipe: DatePipe, protected ideaService: IdeasService, protected userService: UsersService, private route: ActivatedRoute, protected router: Router) {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.id = id
    });
    this.fecha_inicio = this.datePipe.transform(this.fecha, 'yyyy-MM-dd');
    console.log(this.fecha_inicio)
  }

  ngOnInit(): void {
    this.getColaboradores()
    console.log("id de idea:", this.id)
  }
  getColaboradores(): void {
    this.userService.colaboradores().subscribe(
      colabs => {
        this.colaboradores = colabs.users;
        console.log(this.colaboradores);
      }
    );
  }

  inputChanged($event: any): void {
    const value = $event.target.value.toLowerCase();
    if (value.length <= 0) {
      this.colaboradores = [];
      console.log("there's nothing here")
      this.getColaboradores()
    }
    const items: User[] = this.colaboradores.filter((user) =>
      user.nombre.toLowerCase().includes(value)
    );
    console.log("lot of things happening")
    console.log(items)
    this.colaboradores = items;
  }

  selected(item: any) {
    this.selectedItem = item

    console.log(this.selectedItem)
  }

  asignarActividad() {
    let self = this
    let newAct: newActivity = {
      id_idea: this.id ?? 0,
      titulo: this.titulo.value ?? "",
      responsable: this.selectedItem ?? 0,
      fecha_inicio: this.date1 ?? ""
    }

    this.ideaService.newActivity(newAct).subscribe({
      next(value) {
        console.log("actividad creada correctamente!")
        self.router.navigate(['/ideas/', self.id])
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
            self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
            console.log(err)
            break;
        }
      },
    })
  }

  goBack() {
    history.back();
  }

}
