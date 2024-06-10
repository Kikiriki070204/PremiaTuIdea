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
