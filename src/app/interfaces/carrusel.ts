export interface CarruselImagen {
  id: number
  orden: number
  mime_type: string
  is_active?: boolean
  created_at?: string
  url?: string
}

export interface CarruselResponse {
  imagenes: CarruselImagen[]
}
