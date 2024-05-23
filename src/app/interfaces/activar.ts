export interface Activar {
ibm: number
password: string
}

export interface Rol{
    id: number
    nombre: string
    is_active: boolean
}
export interface Departamento{
    id: number
    nombre: string
    is_active: boolean
}
export interface Area{
    id: number
    nombre: string
    is_active: boolean
}
export interface Locacion{
    id: number
    nombre: string
    area_id: number
    is_active: boolean
}

export interface Roles{
    roles: Rol[]
}
export interface Departamentos{
    departamentos: Departamento[]
}
export interface Areas{
    areas: Area[]
}
export interface Locaciones{
    locaciones: Locacion[]
}