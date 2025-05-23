import { CursoResponseI } from '../interfaces/curso-response.interface'

export type CursoResponseT = Omit<CursoResponseI, 'allocations'>
