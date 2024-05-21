export interface Actividad {
    id: number
    id_idea: number
    titulo: string
    responsable: number
    fecha_inicio: Date
    fecha_finalizacion: Date
}

export interface Actividades {
    actividades: Actividad[]
}
