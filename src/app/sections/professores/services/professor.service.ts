import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'

import { ProfessorI } from '../interfaces/professor.interface'
import { catchError, map, Observable, retry, throwError } from 'rxjs'
import { ProfessorResponseI } from '../interfaces/response/professor-response.interface'
import { ProfessorParametrosI } from '../interfaces/professor-parametros.interface'
import { criarHttpParams } from '../../../shared/utilities/criar-http-params.utility'

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  url: string = 'http://localhost:7000/professors'

  private http = inject(HttpClient)

  criarProfessor(professor: Omit<ProfessorI, 'id'>): Observable<ProfessorI> {
    const request = this.criarResquest(professor)

    return this.http.post<{ professor: ProfessorResponseI }>(this.url, request).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      map((response: { professor: ProfessorResponseI }) => this.mapearResponse(response.professor))
    )
  }

  obterProfessores(parametros?: ProfessorParametrosI): Observable<ProfessorI[]> {
    const params = criarHttpParams({
      name: parametros?.nome?.trim(),
      departmentId: parametros?.idDepartamento,
    })

    return this.http.get<{ professors: ProfessorResponseI[] }>(this.url, { params }).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      retry({ count: 2, delay: 1000 }),
      map((response: { professors: ProfessorResponseI[] }) => {
        const professores: ProfessorI[] = response.professors.map((professor: ProfessorResponseI) =>
          this.mapearResponse(professor)
        )

        return professores
      })
    )
  }

  obterProfessoresPorDepartamento(idDepartamento: number): Observable<ProfessorI[]> {
    return this.http.get<{ professors: ProfessorResponseI[] }>(`${this.url}/department/${idDepartamento}`).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      retry({ count: 2, delay: 1000 }),
      map((response: { professors: ProfessorResponseI[] }) => {
        const professores: ProfessorI[] = response.professors.map((professor: ProfessorResponseI) =>
          this.mapearResponse(professor)
        )

        return professores
      })
    )
  }

  obterProfessorPorId(id: number): Observable<ProfessorI> {
    return this.http.get<{ professor: ProfessorResponseI }>(`${this.url}/${id}`).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      retry({ count: 2, delay: 1000 }),
      map((response: { professor: ProfessorResponseI }) => this.mapearResponse(response.professor))
    )
  }

  atualizarProfessor(professor: ProfessorI): Observable<ProfessorI> {
    const request = this.criarResquest(professor)

    return this.http.put<{ professor: ProfessorResponseI }>(`${this.url}/${professor.id}`, request).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      map((response: { professor: ProfessorResponseI }) => this.mapearResponse(response.professor))
    )
  }

  excluirProfessorPorId(id: number): Observable<void> {
    return this.http.delete<Observable<void>>(`${this.url}/${id}`).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      map(() => void 0)
    )
  }

  private criarResquest(professor: Omit<ProfessorI, 'id'>) {
    return { name: professor.nome, cpf: professor.cpf, departmentId: professor.idDepartamento }
  }

  private mapearResponse(professor: ProfessorResponseI): ProfessorI {
    return {
      id: professor.id,
      nome: professor.name,
      cpf: professor.cpf,
      idDepartamento: professor.department.id,
    }
  }
}
