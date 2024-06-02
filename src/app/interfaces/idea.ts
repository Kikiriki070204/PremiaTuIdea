import { User } from "./user"

export interface Idea {
id: number
titulo: string
antecedente: string
condiciones: File
propuesta: string
estatus: number
user_id: number
}

export interface IdeaData{
    idea: {
		id: 9,
		titulo: string
		antecedente: string
		propuesta: string
		estatus: number
		user_id: number
		estatus_idea: string
		status: number
	},
	colaboradores: [
		User
	]
}

export interface Puntos{
	id: number
	puntos: number
}

export interface EstadoIdea{
	id: number
	nombre: string
	is_active: boolean
}

export interface EstadoIdeas{
estados: EstadoIdea[]
}

export interface Estado{
	id: number
    titulo: string
    antecedentes: string
    propuesta : string
	estatus : number
}

export interface EstatusIdea{
	estatus: number
}
