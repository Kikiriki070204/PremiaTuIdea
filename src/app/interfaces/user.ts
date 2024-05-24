export interface User {
id: number
ibm: number
nombre: string
email: string
password: string
departamento_id: number
area_id: number
locacion_id: number
is_active: number
rol_id: number
puntos: number
access_token: string
}

export interface Usuario{
id: number
ibm: number
nombre: string
email: string
password: string
departamento: string
area: string
locacion: string
}

export interface Colaborador{
    id: number
    nombre: string
}

export interface UsersList{
    users: Usuario[]
}

export interface UserName{
    nombre: string
}

export interface NewUser{
    ibm: number
    nombre: string 
    rol_id: number
    departamento_id: number 
    area_id: number
    locacion_id: number 
}

export interface NoLocation{
    ibm: number
    nombre: string 
    rol_id: number
    departamento_id: number 
    area_id: number
}

export interface AreaId{
    area_id: number
}


