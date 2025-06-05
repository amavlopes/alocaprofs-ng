export interface AlocacaoResponseI {
  id: number
  day: number
  startHour: string
  endHour: string
  course: {
    id: number
    name: string
    description: string
  }
  professor: {
    id: number
    name: string
    cpf: string
    departmentId: number
  }
}
