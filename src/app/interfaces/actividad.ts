export interface Actividad {
    id: number
    id_idea: number
    titulo: string
    responsable: number
    responsable_name: string
    fecha_inicio: Date
    fecha_finalizacion: Date
    id_estado_actividad: number
}

export interface Actividades {
    actividades: Actividad[]
}
