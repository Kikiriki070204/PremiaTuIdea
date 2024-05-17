import { User } from "./user"

export interface Idea {
id: number
titulo: string
antecedente: string
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
	},
	colaboradores: string[]
}
