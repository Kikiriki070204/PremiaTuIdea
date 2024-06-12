import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EditarProducto, Producto, ProductoData } from '../../interfaces/producto';
import { UsersService } from '../../servicios/users.service';
import { NgFor, NgIf } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpResponse } from '../../interfaces/http';

@Component({
  selector: 'app-producto-data',
  standalone: true,
  imports: [AppNavbarComponent, RouterLink, NgFor, NgIf, ReactiveFormsModule, FormsModule],
  templateUrl: './producto-data.component.html',
  styleUrl: './producto-data.component.css'
})
export class ProductoDataComponent implements OnInit{
producto: ProductoData | null = null
id: number | null = null
errorMessage: string | null = null
selectedActive: number | null = null

valor=  new FormControl('',Validators.required)
nombre= new FormControl('',Validators.required)


constructor(protected productoService: UsersService, protected router: Router, private route: ActivatedRoute){
  this.route.params.subscribe(params => {
    const id = params['id'];
    this.id = id
  });
}

ngOnInit(): void {
  this.productData()
  console.log("activo: ",this.selectedActive)
}

productData(): void{

  this.productoService.productoData(this.id).subscribe(
    product=>{
      this.producto = product
      console.log(this.producto)
    }
  )
  }

  onEstadoChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedActive = parseInt(selectedValue,10)
    console.log("estado: ",this.selectedActive)
    console.log("puntos:",this.producto?.producto.valor)
  }
  
  editar(){
    let self = this
    let editarP: EditarProducto = {
      id: this.producto?.producto.id ?? 0,
      nombre: this.producto?.producto.nombre ?? "",
      valor : (this.valor.value !== null && this.valor.value !== '') ? +this.valor.value : this.producto?.producto.valor,
      url: this.producto?.producto.url ?? "",
      is_active: this.selectedActive ?? 0
    }

    this.productoService.editarProducto(editarP).subscribe({
      next(value) {
        console.log(editarP)
        self.router.navigate(['/productos'])
      },
      error(err: HttpResponse)
      {switch(err.status)
        {
          case 422:
              self.errorMessage = 'Datos no válidos';
              console.log(err)
              break;
            case 404:
              self.errorMessage = 'Producto no encontrado';
              break;
            default:
                // Errores generales
                self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
                break;
        }
      }
    })
    
  } 

  editar2(){
    let self = this
    let editarP: EditarProducto = {
      id: this.producto?.producto.id ?? 0,
      nombre: this.producto?.producto.nombre ?? "",
      valor : (this.valor.value !== null && this.valor.value !== '') ? +this.valor.value : this.producto?.producto.valor,
      url: this.producto?.producto.url ?? "",
      is_active: this.selectedActive ?? 1
    }

    this.productoService.editarProducto(editarP).subscribe({
      next(value) {
        console.log(editarP)
        self.router.navigate(['/productos'])
      },
      error(err: HttpResponse)
      {switch(err.status)
        {
          case 422:
              self.errorMessage = 'Datos no válidos';
              console.log(err)
              break;
            case 404:
              self.errorMessage = 'Producto no encontrado';
              break;
            default:
                // Errores generales
                self.errorMessage = 'Ha ocurrido un error. Intentelo de nuevo.';
                break;
        }
      }
    })
    
  } 

}
