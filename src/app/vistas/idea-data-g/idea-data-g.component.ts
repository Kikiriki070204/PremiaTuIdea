import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { NgFor, NgIf } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Campo, EstadoIdea, IdeaData, Puntos } from '../../interfaces/idea';
import { User } from '../../interfaces/user';
import { Actividad } from '../../interfaces/actividad';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../../servicios/auth.service';
import { IdeasService } from '../../servicios/ideas.service';
import { HttpResponse } from '../../interfaces/http';
import { Profile } from '../../interfaces/profile';

@Component({
  selector: 'app-idea-data-g',
  standalone: true,
  imports: [NgFor, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './idea-data-g.component.html',
  styleUrl: './idea-data-g.component.css'
})
export class IdeaDataGComponent implements OnInit {
  user_rol: number | null = null
  errorMessage: string | null = null
  Message: string | null = null
  idea: IdeaData | null = null
  idea_id: number | null = null
  colaboradores: User[] | null = null
  campos_init: [Campo] | null = null
  estados: EstadoIdea[] | null = null
  check = false
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
  categoria: number | null = null
  categoriaNombre: string | null = null

  fecha = new Date()
  fecha_puntos: string | null = null
  campos: Campo[] | null = null
  campos_idea: number[] = []
  //campo's properties:
  checkboxModel = new FormControl
  checkboxStates: { [id: number]: boolean } = {};

  userInfo: Profile | null = null

  public safeImage: SafeUrl | null = null;
  ahorro = new FormControl('', Validators.required)
  puntos = new FormControl(Validators.required)
  constructor(protected authService: AuthService, protected sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute, protected ideaService: IdeasService, protected router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      var idea_id = params['id'];
      this.idea_id = idea_id
      console.log(params['id'])
    });
    // this.getRol()
    this.user()
    this.ideaData()
    this.estadoIdeas()
    this.getImage()
    this.actividadesByIdea()
    this.getCampos()
    this.getCategoriaNombres()
    // if(this.idea?.idea.estatus == 3){
    //   this.asignarDisabled()
    // }

  }

  /*
  getRol() {
    this.user_rol = this.authService.getRol()
  } */


  private getImage(): void {
    this.ideaService.getImage(this.idea_id).subscribe(image => {
      let blob: Blob = image;
      let objectURL = URL.createObjectURL(blob);
      this.safeImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    });
  }

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


  logout() {
    this.authService.logout()
    location.reload()
    this.router.navigate(['/'])


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
          self.categoria = value.idea.categoria_id
          console.log(value.idea.categoria_id)
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
          console.log("campos seleccionados:", self.campos_idea)
        },
        error(err: HttpResponse) {
          self.router.navigate(['**'])
          console.log(err)
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
    if (this.contable == 0) {
      this.ideaService.campos(1).subscribe(
        campos => {
          this.campos = campos.campos
        }
      )
      console.log("campos contable: ", this.campos);
    }
    else {
      this.ideaService.campos(2).subscribe(
        campos => {
          this.campos = campos.campos
        }
      )
      console.log("campos no contable: ", this.campos);
    }

  }

  getCategoriaNombres() {
    switch (this.categoria) {
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

  goBack() {
    history.back()
  }

  // asignarDisabled(){
  //   let state: boolean | null = null
  //   if(this.idea?.idea.estatus == 3)
  //   {
  //       state = true
  //   }
  //   else{
  //     state = false
  //   }
  //   console.log("check!:", state)
  //   return state
  // }

}
