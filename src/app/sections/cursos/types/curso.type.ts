import { CursoI } from '../interfaces/curso.interface'

export type CursoT = Omit<CursoI, 'id'>
