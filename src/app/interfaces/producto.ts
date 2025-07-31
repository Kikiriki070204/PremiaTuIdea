export interface Producto {
    id: number
    nombre: string
    url: string
    valor: number
    is_active: boolean
}

export interface ProductoData {
    producto: {
        id: number
        nombre: string
        url: string
        valor: number
        is_active: number
        precio: number
    }
}

export interface EditarProducto {
    id: number
    nombre: string
    valor: number | undefined
    is_active: number
    precio: number | undefined
}

export interface NuevoProducto {
    nombre: string
    valor: number
    url: string
    precio: number,
    imagen: File
}
export interface Canjear {
    id: number
}
export interface UsuarioPremio {

    id: number
    folio: number
    id_usuario: number
    id_producto: number
    id_estado: number
    usuario: string
    producto: string
    estado: string
    url: string
    imagen: string

}

export interface UsuarioPremio2 {
    premio: {
        id: number
        folio: number
        id_usuario: number
        id_producto: number
        id_estado: number
        usuario: string
        producto: string
        estado: string
        url: string
    }

}

export interface Premios {
    premios: UsuarioPremio[]
}

export interface ProductoId {
    id: number
}

export interface EstadoPremio {
    id: number
    estado: string
    activo: boolean
}

export interface EstadosPremios {
    estado: EstadoPremio[]
}

export interface EditarEstadoP {
    id: number
    id_usuario: number
    id_producto: number
    id_estado: number
}