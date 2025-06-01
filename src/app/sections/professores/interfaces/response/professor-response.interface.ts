export interface ProfessorResponseI {
  id: number
  name: string
  cpf: string
  department: {
    id: number
    name: string
    createdAt: string
    updatedAt: string
  }
  createdAt: string
  updatedAt: string
}
