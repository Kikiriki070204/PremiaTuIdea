import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IdeasService } from '../../../../servicios/ideas.service';
import { Campo, EditColabs, EstadoIdea, IdeaData, Puntos } from '../../../../interfaces/idea';
import { DatePipe, NgFor, NgIf } from '@angular/common';

import { Colaborador, User } from '../../../../interfaces/user';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Estado } from '../../../../interfaces/idea';
import { Actividad } from '../../../../interfaces/actividad';
import { HttpResponse } from '../../../../interfaces/http';
import { Imagen } from '../../../../interfaces/ideas';
import { environment } from '../../../../../enviroment/enviroment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../../../../servicios/auth.service';
import { Subject, debounceTime } from 'rxjs';
import { UsersService } from '../../../../servicios/users.service';
import { Profile } from '../../../../interfaces/profile';
import { initFlowbite } from 'flowbite';
import Swal from 'sweetalert2';
// import { initFlowbite } from 'flowbite';


@Component({
  selector: 'app-idea-data',
  standalone: true,
  imports: [NgFor, FormsModule, ReactiveFormsModule, RouterLink, NgIf, DatePipe],
  templateUrl: './idea-data.component.html',
  styleUrl: './idea-data.component.css'

})
export class IdeaDataComponent implements OnInit {
  colabSelected: number | null = null
  id: number | null = null
  equipoID: number | null = null
  searchChanged = new Subject<string>();
  allColaboradores: User[] = []
  //modal properties:
  checkboxModel = new FormControl
  checkboxStates: { [id: number]: boolean } = {};

  showModal: boolean = false;
  showBonosModal: boolean = false;


  abrirModal(): void {
    this.showModal = true;
  }

  abrirBonosModal(): void {
    this.showBonosModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
  }

  cerrarBonosModal(): void {
    this.showBonosModal = false;
  }
  colabs: number[] = []
  selectedItem: number | null = null

  fecha = new Date()
  fecha_puntos: string | null = null
  user_rol: number | null = null
  errorMessage: string | null = null
  Message: string | null = null
  idea: IdeaData | null = null
  idea_id: number | null = null
  colaboradores: User[] | null = null
  colaboradores_modal: User[] = []
  campos_init: [Campo] | null = null
  estados: EstadoIdea[] | null = null
  puntos_idea: number | null = null

  puntos_idea_edit: number = 0
  check = false
  ahorro_idea: number | null = null
  //datos para editar
  titulo = new FormControl
  antecedentes = new FormControl
  propuesta = new FormControl
  actividades: Actividad[] | null = null
  selectedEstado: number | null = null
  colaboradores_id: number[] = []
  colaboradores_puntos: number[] = []
  contable: number = 0
  ahorro_valor: number = 0
  categoria_id: number | null = null
  categoriaNombre: string | null = null

  userInfo: Profile | null = null

  campos: Campo[] | null = null
  campos_idea: number[] = []
  //campo's properties:
  checkboxModelColabs = new FormControl
  checkboxStatesColabs: { [id: number]: boolean } = {};

  public safeImage: SafeUrl | null = null;
  ahorro = new FormControl('', Validators.required)
  puntos = new FormControl(Validators.required)
  puntos_x_idea = new FormControl('', Validators.required)

  constructor(protected userService: UsersService, private datePipe: DatePipe, protected authService: AuthService, protected sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute, protected ideaService: IdeasService, protected router: Router) {
    this.searchChanged.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.filterColaboradores(value);
    });
    this.fecha_puntos = this.datePipe.transform(this.fecha, 'yyyy-MM-dd');
    console.log(this.fecha_puntos)
  }

  ngOnInit() {
    initFlowbite();
    this.activatedRoute.params.subscribe(params => {
      var idea_id = params['id'];
      this.idea_id = idea_id
      console.log(params['id'])
      this.getAllColaboradores()
    });
    // this.getRol()
    // this.user()
    this.ideaData()

    this.getCategoriaNombres()
    this.estadoIdeas()
    this.getImage()
    this.actividadesByIdea()


    // if(this.idea?.idea.estatus == 3){
    //   this.asignarDisabled()
    // }

  }

  /*
  getRol() {
    this.user_rol = this.authService.getRol()
  } */

  user() {
    let self = this

    this.authService.meplus().subscribe({
      next(value: Profile) {
        self.userInfo = value
        self.user_rol = value.rol_id
        console.log(self.userInfo)
        console.log(self.user_rol)
      },
      error(err) {
        console.log(err)
      },
    })
  }


  //Input para modificar colaboradores
  //modal methods
  getAllColaboradores(): void {
    this.userService.colaboradores().subscribe(
      colabs => {
        this.allColaboradores = colabs.users;
        this.colaboradores_modal = [...this.allColaboradores];
        console.log(this.colaboradores);
      }
    );
  }


  inputChanged($event: any): void {
    const value = $event.target.value.toLowerCase();
    this.searchChanged.next(value);
  }

  filterColaboradores(value: string): void {
    if (value.length <= 0) {
      this.colaboradores_modal = [...this.allColaboradores];
    } else {
      const items: User[] = this.allColaboradores.filter((user) =>
        user.nombre.toLowerCase().includes(value)
      );
      console.log("lot of things happening")
      console.log(items)
      this.colaboradores_modal = items;
    }

    // Update isChecked for each colaborador
    this.colaboradores_modal.forEach(colaborador => {
      colaborador.isChecked = this.checkboxStates[colaborador.id] || false;
    });
  }

  checkboxColabsChanged(item: any, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checkboxStatesColabs[item] = isChecked;

    if (isChecked) {
      this.colabs.push(item);
      console.log(this.colabs)
    } else {
      // Si se desmarca el checkbox, verifica si el elemento está en el array
      const index = this.colabs.indexOf(item);
      if (index !== -1) {
        // Si está presente, elimínalo del array
        this.colabs.splice(index, 1);
        console.log(this.colabs)
      }
    }
  }

  agregarColab() {
    let self = this
    let editarColabs: EditColabs = {
      id_usuarios: this.colabs,
      id: this.idea_id ?? 0
    }

    this.ideaService.editarColaboradores(editarColabs).subscribe({
      next(value) {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Colaboradores agregados correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'bg-blue-800 text-white hover:bg-blue-900 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out',
          },
          buttonsStyling: false
        }).then(() => {
          self.router.navigate(['/admin/ideas/', self.idea_id]);
        });
      },
      error(err: HttpResponse) {
        switch (err.status) {
          case 422:
            self.errorMessage = 'Por favor introduzca datos validos';

            break;
          case 404:
            self.errorMessage = 'Usuarios no encontrada';
            break;
          default:
            // Errores generales
            self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
            break;
        }
      },
    })
  }


  private getImage(): void {
    this.ideaService.getImage(this.idea_id).subscribe(image => {
      let blob: Blob = image;
      let objectURL = URL.createObjectURL(blob);
      this.safeImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    });
  }


  ideaData() {
    let self = this
    this.ideaService.ideaData(this.idea_id)
      .subscribe({
        next(value: IdeaData) {
          self.idea = value;
          self.colaboradores = value.colaboradores
          self.campos_init = value.campos
          self.contable = value.idea.contable

          self.ahorro_valor = value.idea.ahorro
          self.puntos_idea = value.idea.puntos
          self.ahorro_idea = value.idea.ahorro
          self.categoria_id = value.idea.categoria_id
          console.log(value)
          self.getCampos()
          value.colaboradores.forEach(
            colaborador => {
              self.colaboradores_id.push(colaborador.id)
            }
          )
          value.campos.forEach(
            campo => {
              self.campos_idea.push(campo.id)
              self.checkboxStates[campo.id] = self.campos_idea.includes(campo.id);
            }
          )
          value.colaboradores.forEach(
            colab => {
              self.colabs.push(colab.id)
              self.checkboxStatesColabs[colab.id] = self.colabs.includes(colab.id)
            }
          )
          console.log("campos seleccionados:", self.campos_idea)
        },
        error(err: HttpResponse) {
          self.router.navigate(['**'])
          console.log(err)
        }
      });
  }


  asignarPuntos() {
    let self = this
    const puntosColaboradores = self.colaboradores?.map((colaborador) => colaborador.puntos);
    let puntos: Puntos = {
      id: this.idea_id ?? 0,
      id_usuarios: this.colaboradores_id,
      puntos: puntosColaboradores ?? [],
      fecha: this.fecha_puntos ?? ''
    }

    const totalPuntos = puntosColaboradores!.reduce((acc, curr) => acc + curr, 0);
    self.puntos_idea_edit = totalPuntos; // Asignar el total de puntos a 
    console.log("puntos totales: ", self.puntos_idea_edit)
    this.ideaService.asignarPuntos(puntos).subscribe({
      next(value: User) {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Puntos asignados correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'bg-blue-800 text-white hover:bg-blue-900 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out',
          },
          buttonsStyling: false
        }).then(() => {
          self.router.navigate(['/admin/ideas/', self.idea_id]);
        });
      },
      error(err: HttpResponse) {
        switch (err.status) {
          case 422:
            self.errorMessage = 'Por favor introduzca datos validos';
            self.errorAlert(self.errorMessage);
            break;
          case 404:
            self.errorMessage = 'Usuarios no encontrada';
            self.errorAlert(self.errorMessage);
            break;
          default:
            self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
            self.errorAlert(self.errorMessage);
            break;
        }
      },
    })
  }

  asignarBonos() {
    let self = this;

    const usuariosBonos = self.colaboradores?.map((colaborador) => {
      return {
        usuario_id: colaborador.id,
        bono: colaborador.puntos ?? 0
      };
    });

    const payload = {
      id: this.idea_id ?? 0,
      usuarios_bonos: usuariosBonos
    };

    const totalBonos = usuariosBonos?.reduce((acc, curr) => acc + curr.bono, 0);
    self.puntos_idea_edit = totalBonos ?? 0;

    this.ideaService.asignarBonos(payload).subscribe({
      next(value: User) {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Bonos asignados correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'bg-blue-800 text-white hover:bg-blue-900 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out',
          },
          buttonsStyling: false
        }).then(() => {
          self.router.navigate(['/admin/ideas/', self.idea_id]);
        });
      },
      error(err: HttpResponse) {

        switch (err.status) {
          case 422:
            self.errorMessage = 'Por favor introduzca datos válidos';
            self.errorAlert(self.errorMessage);
            break;
          case 404:
            self.errorMessage = 'Usuarios no encontrados';
            self.errorAlert(self.errorMessage);
            break;
          default:
            self.errorMessage = 'Ha ocurrido un error. Inténtelo de nuevo.';
            self.errorAlert(self.errorMessage);
            break;
        }
      },
    });
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



  estadoIdeas(): void {
    this.ideaService.estadoIdeas().subscribe(
      estadosIdeas => {
        this.estados = estadosIdeas.estados;
        console.log(this.estados);
      }
    );
  }

  onEstadoChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedEstado = parseInt(selectedValue, 10);
    console.log("estado: ", this.selectedEstado)
  }

  editarEstado() {
    let self = this
    let estado: Estado = {
      id: this.idea_id ?? 0,
      titulo: this.idea?.idea.titulo ?? "",
      antecedentes: this.idea?.idea.antecedente ?? "",
      propuesta: this.idea?.idea.propuesta ?? "",
      puntos: (this.puntos_x_idea.value !== null && this.puntos_x_idea.value !== '') ? +this.puntos_x_idea.value : this.idea?.idea.puntos,
      estatus: this.selectedEstado ?? 0,
      campos_id: this.campos_idea ?? 0,
      contable: this.contable ?? null,
      ahorro: (this.ahorro.value !== null) ? +this.ahorro.value : this.idea?.idea.ahorro,
      fecha_fin: (this.selectedEstado === 3) ? this.fecha_puntos : ' '
    }

    this.ideaService.editarEstado(estado).subscribe({
      next(value) {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Datos editados correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'bg-blue-800 text-white hover:bg-blue-900 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out',
          },
          buttonsStyling: false
        }).then(() => {
          self.router.navigate(['/admin/ideas/', self.idea_id]);
        });
      },
      error(err: HttpResponse) {
        switch (err.status) {
          case 422:
            self.errorMessage = 'Por favor escoja datos válidos';
            self.errorAlert(self.errorMessage);
            break;
          case 404:
            self.errorMessage = 'Idea no encontrada';
            self.errorAlert(self.errorMessage);
            break;
          default:
            self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
            self.errorAlert(self.errorMessage);
            break;
        }
      },
    })
  }

  editarSinEstado() {
    let self = this
    let estado: Estado = {
      id: this.idea_id ?? 0,
      titulo: this.idea?.idea.titulo ?? "",
      antecedentes: this.idea?.idea.antecedente ?? "",
      propuesta: this.idea?.idea.propuesta ?? "",
      puntos: (this.puntos_x_idea.value !== null && this.puntos_x_idea.value !== '') ? +this.puntos_x_idea.value : (this.idea?.idea.puntos === 0) ? this.puntos_idea_edit : this.idea?.idea.puntos,
      estatus: this.idea?.idea.estatus ?? 0,
      campos_id: this.campos_idea ?? 0,
      contable: this.contable ?? null,
      ahorro: (this.ahorro.value !== null && this.ahorro.value !== '') ? +this.ahorro.value : this.idea?.idea.ahorro,
      fecha_fin: (this.selectedEstado === 3) ? this.fecha_puntos : ' '
    }

    this.ideaService.editarEstado(estado).subscribe({
      next(value) {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Datos editados correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'bg-blue-800 text-white hover:bg-blue-900 font-bold rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out',
          },
          buttonsStyling: false
        }).then(() => {
          self.router.navigate(['/admin/ideas/', self.idea_id]);
        });
      },
      error(err: HttpResponse) {
        switch (err.status) {
          case 422:
            self.errorMessage = 'Por favor escoja datos válidos';
            self.errorAlert(self.errorMessage);
            break;
          case 404:
            self.errorMessage = 'Idea no encontrada';
            self.errorAlert(self.errorMessage);
            break;
          default:
            self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
            self.errorAlert(self.errorMessage);
            break;
        }
      },
    })
  }

  actividadesByIdea() {
    this.ideaService.actividades(this.idea_id).subscribe(
      actividadesIdea => {
        this.actividades = actividadesIdea.actividades
        console.log(this.actividades);
      })
  }

  handleRadioChange(event: any) {
    const selectedValue = event.target.value;
    this.contable = parseInt(selectedValue, 10);
    console.log("contable: ", this.contable)
    this.getCampos()
  }

  getCampos() {
    if (this.contable === 0) {
      this.ideaService.campos(1).subscribe(
        campos => {
          this.campos = campos.campos
        }
      )
    }
    else {
      this.ideaService.campos(2).subscribe(
        campos => {
          this.campos = campos.campos
        }
      )
    }

  }

  checkboxChanged(item: any, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checkboxStates[item] = isChecked;

    if (isChecked) {
      this.campos_idea.push(item);
      console.log(this.campos_idea)
    } else {
      // Si se desmarca el checkbox, verifica si el elemento está en el array
      const index = this.campos_idea.indexOf(item);
      if (index !== -1) {
        // Si está presente, elimínalo del array
        this.campos_idea.splice(index, 1);
      }
    }
  }

  getCategoriaNombres() {
    switch (this.categoria_id) {
      case 1:
        this.categoriaNombre = "Ideas de mejora"
        break
      case 2:
        this.categoriaNombre = "Lean workshops"
        break
      case 3:
        this.categoriaNombre = "Cambio de nivel de técnicos"
        break
      case 4:
        this.categoriaNombre = "Scrap/CI"
        break
      case 5:
        this.categoriaNombre = "OE"
        break
      default:
        this.categoriaNombre = "Ideas de mejora"
        break
    }
  }

  newAct() {
    this.router.navigate(['/admin/nueva-actividad/', this.idea_id])
  }

  goBack() {
    history.back();
  }
}
