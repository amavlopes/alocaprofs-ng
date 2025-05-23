export interface CursoResponseI {
  id: number
  name: string
  allocations: Array<{
    id: number
    day: string
    startHour: string
    endHour: string
    professorId: number
    createdAt: string
    updatedAt: string
  }>
  createdAt: string
  updatedAt: string
}
