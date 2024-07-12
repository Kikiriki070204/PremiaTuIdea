export interface IdeasCN{
    nombre_area: string
    total_ideas: number
}

export interface ReportesIdeas {
msg:{
   total_ideas: number,
   ideas_por_area: IdeasCN[]
}
}

export interface PuntosArea{
    nombre_area: string
    total_puntos: number
}

export interface ReportesPuntos {
    msg:{
       total_puntos: number,
       puntos_por_area: PuntosArea[]
    }
}

export interface ReportesIdeas2 {
    total_ideas: number,
    ideas_por_area: IdeasCN[]
}

export interface Top10User{
    id: number
    user_id: number
    total_puntos: number
    is_active: boolean
    ibm: number
    nombre: string
}

export interface Historial{
    historial: Top10User[]
}

export interface AhorroArea{
    nombre_area: string
    total_ahorros: number
}

export interface AhorroTotal{
    msg: {
		total_ahorros: number
		ahorros_por_area:AhorroArea[]
    }
}

export interface FechasPuntos{
    fecha_inicio: string
    fecha_fin: string
}

export interface FechasIdeas{
    fecha_inicio: string
    fecha_fin: string
}

export interface FechasAhorros{
    fecha_inicio: string
    fecha_fin: string
}