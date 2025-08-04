import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'

import { catchError, map, Observable, retry, throwError } from 'rxjs'

import { CursoI } from '../interfaces/curso.interface'
import { CursoResponseI } from '../interfaces/response/curso-response.interface'

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  url = 'http://localhost:7000/courses'

  private http = inject(HttpClient)

  criarCurso(curso: Omit<CursoI, 'id'>): Observable<CursoI> {
    const request = { name: curso.nome, description: curso.descricao }

    return this.http.post<{ course: CursoResponseI }>(this.url, request).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      map((response: { course: CursoResponseI }) => ({
        id: response.course.id,
        nome: response.course.name,
        descricao: response.course.description,
      }))
    )
  }

  obterCursos(nome?: string): Observable<CursoI[]> {
    nome = nome?.trim()
    const opcoes = nome ? { params: new HttpParams().set('name', nome) } : {}

    return this.http.get<{ courses: CursoResponseI[] }>(this.url, opcoes).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      retry({ count: 2, delay: 1000 }),
      map((response: { courses: CursoResponseI[] }) => {
        const cursos = response.courses.map((curso: CursoResponseI) => ({
          id: curso.id,
          nome: curso.name,
          descricao: curso.description,
        }))

        return cursos
      })
    )
  }

  obterCursoPorId(id: number): Observable<CursoI> {
    return this.http.get<{ course: CursoResponseI }>(`${this.url}/${id}`).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      retry({ count: 2, delay: 1000 }),
      map((response: { course: CursoResponseI }) => ({
        id: response.course.id,
        nome: response.course.name,
        descricao: response.course.description,
      }))
    )
  }

  atualizarCurso(curso: CursoI): Observable<CursoI> {
    const request = { name: curso.nome, description: curso.descricao }

    return this.http.put<{ course: CursoResponseI }>(`${this.url}/${curso.id}`, request).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      map((response: { course: CursoResponseI }) => ({
        id: response.course.id,
        nome: response.course.name,
        descricao: response.course.description,
      }))
    )
  }

  excluirCursoPorId(id: number): Observable<void> {
    return this.http.delete<Observable<void>>(`${this.url}/${id}`).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      map(() => void 0)
    )
  }
}
