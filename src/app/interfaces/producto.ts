export interface Producto {
    id:number
    nombre: string
    url: string
    valor: number 
    is_active: boolean
}

export interface NuevoProducto{
    nombre: string
    valor: number
    url: string
}
