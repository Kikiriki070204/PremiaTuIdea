import { Component, OnInit } from '@angular/core';
import { EditarEstadoP, EstadoPremio, ProductoId, UsuarioPremio, UsuarioPremio2 } from '../../../../interfaces/producto';
import { UsersService } from '../../../../servicios/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { EditEstado } from '../../../../interfaces/actividad';
import { HttpResponse } from '../../../../interfaces/http';

@Component({
  selector: 'app-premio-data',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './premio-data.component.html',
  styleUrl: './premio-data.component.css'
})
export class PremioDataComponent implements OnInit {
  errorMessage: string | null = null
  id: number | null = null
  userPremio: UsuarioPremio2 | null = null
  estados: EstadoPremio[] | null = null
  selectedEstado: number | null = null
  constructor(protected userService: UsersService, protected router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.id = id
    });
  }
  ngOnInit(): void {
    console.log("userPremio id:", this.id)
    this.userPremioData()
    this.getEstados()
  }

  userPremioData(): void {

    this.userService.usuarioPremioData(this.id).subscribe(
      premioUser => {
        this.userPremio = premioUser
        console.log(this.userPremio)
      }
    )
  }

  getEstados(): void {
    this.userService.estadosPremios().subscribe(
      estadosPremios => {
        this.estados = estadosPremios.estado
        console.log(this.estados)
      }
    )
  }

  onEstadoChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedEstado = parseInt(selectedValue, 10);
    console.log("estado: ", this.selectedEstado)
  }

  editarEstado() {
    let self = this
    let editar: EditarEstadoP = {
      id: this.id ?? 0,
      id_estado: this.selectedEstado ?? 0,
      id_producto: this.userPremio?.premio.id_producto ?? 0,
      id_usuario: this.userPremio?.premio.id_usuario ?? 0,
    }

    this.userService.editarEstado(editar).subscribe({
      next(value) {
        self.router.navigate(['/premios'])
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
            self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
            break;
        }
      },
    })
  }

  goBack() {
    history.back();
  }
}
