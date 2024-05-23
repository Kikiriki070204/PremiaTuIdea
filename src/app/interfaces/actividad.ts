export interface Actividad {
    id: number
    id_idea: number
    titulo: string
    responsable: number
    responsable_name: string
    fecha_inicio: Date
    fecha_finalizacion: Date
    id_estado_actividad: number
    estado_actividad: string
}

export interface ActivityData {
    actividad:{
    id: number
    id_idea: number
    titulo: string
    responsable: number
    responsable_name: string
    fecha_inicio: Date
    fecha_finalizacion: Date
    id_estado_actividad: number
    estado_actividad: string
    }
}

export interface Actividades {
    actividades: Actividad[]
}

export interface ActividadIdea{
    id_idea: number
}

export interface newActivity{
    id_idea: number
    titulo: string
    responsable: number
    fecha_inicio: string
}

export interface EstadoAct{
    id: number
    nombre: string
    is_active: boolean
}

export interface EstadoActividades{
    estados: EstadoAct[]
}

export interface EditEstado{
    id: number
    id_idea: number
    titulo: string
    responsable: number
    fecha_inicio: Date
    fecha_finalizacion: string
    id_estado_actividad: number
}

export interface EditEstado2{
    id: number
    id_idea: number
    titulo: string
    responsable: number
    fecha_inicio: Date
    id_estado_actividad: number
}

