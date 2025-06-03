import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'

import { ProfessorI } from '../interfaces/professor.interface'
import { catchError, map, Observable, retry, throwError } from 'rxjs'
import { ProfessorResponseI } from '../interfaces/response/professor-response.interface'

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  url: string = 'http://localhost:7000/professors'

  private http = inject(HttpClient)

  criarProfessor(professor: Omit<ProfessorI, 'id'>): Observable<ProfessorI> {
    const request = { name: professor.nome, cpf: professor.cpf, departmentId: professor.idDepartamento }

    return this.http.post<{ professor: ProfessorResponseI }>(this.url, request).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      map((response: { professor: ProfessorResponseI }) => ({
        id: response.professor.id,
        nome: response.professor.name,
        cpf: response.professor.cpf,
        idDepartamento: response.professor.department.id,
      }))
    )
  }

  obterProfessores(nome?: string, idDepartamento?: string): Observable<ProfessorI[]> {
    const params = this.buildHttpParams({
      name: nome?.trim(),
      departmentId: idDepartamento,
    })

    return this.http.get<{ professors: ProfessorResponseI[] }>(this.url, { params }).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      retry({ count: 2, delay: 1000 }),
      map((response: { professors: ProfessorResponseI[] }) => {
        const professores: ProfessorI[] = response.professors.map((professor: ProfessorResponseI) => ({
          id: professor.id,
          nome: professor.name,
          cpf: professor.cpf,
          idDepartamento: professor.department.id,
        }))

        return professores
      })
    )
  }

  obterProfessoresPorDepartamento(idDepartamento: number): Observable<ProfessorI[]> {
    return this.http.get<{ professors: ProfessorResponseI[] }>(`${this.url}/department/${idDepartamento}`).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      retry({ count: 2, delay: 1000 }),
      map((response: { professors: ProfessorResponseI[] }) => {
        const professores: ProfessorI[] = response.professors.map((professor: ProfessorResponseI) => ({
          id: professor.id,
          nome: professor.name,
          cpf: professor.cpf,
          idDepartamento: professor.department.id,
        }))

        return professores
      })
    )
  }

  excluirProfessorPorId(id: number): Observable<void> {
    return this.http.delete<Observable<void>>(`${this.url}/${id}`).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      map(() => void 0)
    )
  }

  buildHttpParams(query: { [key: string]: any }): HttpParams {
    let params = new HttpParams()

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString())
      }
    })

    return params
  }
}
