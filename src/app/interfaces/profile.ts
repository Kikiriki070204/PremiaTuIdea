export interface Profile {
id: number
ibm: number
nombre: string
email: string
password: string
departamento: string
departamento_id: number
area: string
area_id: number
locacion: string
locacion_id:number
rol: string
rol_id: number
puntos: number
is_active: boolean
}

export interface UpdateUser{
    id: number
    ibm : number
    nombre: string
    rol_id : number
    departamento_id: number 
    area_id : number
    is_active: number 
    locacion_id : number | null
}