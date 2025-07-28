export interface IdeasCN {
    nombre_area: string
    total_ideas: number
}

export interface ReportesIdeas {
    msg: {
        total_ideas: number,
        ideas_por_area: IdeasCN[]
    }
}

export interface PuntosArea {
    nombre_area: string
    total_puntos: number
}

export interface ReportesPuntos {
    msg: {
        total_puntos: number,
        puntos_por_area: PuntosArea[]
    }
}

export interface ReportesIdeas2 {
    total_ideas: number,
    ideas_por_area: IdeasCN[]
}

export interface Top10User {
    id: number
    user_id: number
    total_puntos: number
    is_active: boolean
    ibm: number
    nombre: string
}

export interface Historial {
    historial: Top10User[]
}

export interface AhorroArea {
    nombre_area: string
    total_ahorros: number
    total_ahorros_dolares: number
    valor_animado: number
}

export interface AhorroCategoria {
    nombre_categoria: string
    total_ahorros: number
    total_ahorros_dolares: number
    valor_animado: number
}

export interface AhorroTotal {
    msg: {
        total_ahorros: number
        total_ahorros_usd: number
        ahorros_por_area: AhorroArea[]
    }
}

export interface AhorroTotalCategoria {
    msg: {
        total_ahorros: number
        total_ahorros_usd: number
        ahorros_por_categoria: AhorroCategoria[]
    }
}

export interface FechasPuntos {
    fecha_inicio: string
    fecha_fin: string
}

export interface FechasIdeas {
    fecha_inicio: string
    fecha_fin: string
}

export interface FechasAhorros {
    fecha_inicio: string
    fecha_fin: string
}

export interface EstatusCount {
    nombre_estatus: string;
    total_por_estatus: number;
}

export interface AreaStats {
    area_id: number;
    nombre_area: string;
    total_ideas: number;
    estatus: EstatusCount[];
}

export interface CategoriaStats {
    categoria_id: number;
    nombre_categoria: string;
    total_ideas: number;
    estatus: EstatusCount[];
}

export interface IdeasVsUsuarios {
    total_ideas: number;
    total_usuarios: number;
    porcentaje_por_usuario: number;
}


export interface ParticipacionEmpleados {
    total_ideas: number;
    total_colaboradores: number;
    total_empleados: number;
    porcentaje_participacion: number;
}
