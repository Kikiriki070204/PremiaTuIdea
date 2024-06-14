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
		condiciones: string
		ahorro: number
		contable: number
	},
	colaboradores: User[
		
	],
	campos:[
		Campo
	]
}

export interface Puntos{
	id: number
	id_usuarios: number[]
	puntos: number[]
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
	contable: number
	campos_id: number[] | null
	ahorro: number |  null | undefined
}

export interface EstatusIdea{
	estatus: number
}

export interface Campo{
	id: number
	nombre: number
	is_active: boolean
}

export interface Campos{
	campos: Campo[]
}

export interface EditColabs{
	id_usuarios: number[]
	id: number
}

export interface Msg{
	msg: string
}
