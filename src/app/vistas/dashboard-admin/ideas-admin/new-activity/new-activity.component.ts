import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { UsersService } from '../../../../servicios/users.service';
import { User } from '../../../../interfaces/user';
import { ActivatedRoute, Router } from '@angular/router';
import { newActivity } from '../../../../interfaces/actividad';
import { IdeasService } from '../../../../servicios/ideas.service';
import { HttpResponse } from '../../../../interfaces/http';
import Swal from 'sweetalert2';

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
  date1: string = this.datePipe.transform(new Date(), 'yyyy-MM-dd') ?? '';


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

  }
  getColaboradores(): void {
    this.userService.colaboradores().subscribe(
      colabs => {
        this.colaboradores = colabs.users;
      }
    );
  }

  inputChanged($event: any): void {
    const value = $event.target.value.toLowerCase();
    if (value.length <= 0) {
      this.colaboradores = [];
      this.getColaboradores()
    }
    const items: User[] = this.colaboradores.filter((user) =>
      user.nombre.toLowerCase().includes(value)
    );
    this.colaboradores = items;
  }

  selected(item: any) {
    this.selectedItem = item
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

  asignarActividad() {
    let self = this

    let fecha = this.datePipe.transform(this.date1, 'yyyy-MM-dd');

    let newAct: newActivity = {
      id_idea: this.id ?? 0,
      titulo: this.titulo.value ?? "",
      responsable: this.selectedItem ?? 0,
      fecha_inicio: fecha ?? ""
    }

    this.ideaService.newActivity(newAct).subscribe({
      next(value) {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Actividad creada correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'bg-blue-800 text-white hover:bg-blue-900 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out',
          },
          buttonsStyling: false
        }).then(() => {
          self.router.navigate(['/admin/ideas/', self.id])
        });
      },
      error(err: HttpResponse) {
        switch (err.status) {
          case 422:
            self.errorMessage = 'Campos obligatorios, por favor introduce valores adecuados';
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

  goBack() {
    history.back();
  }

}
