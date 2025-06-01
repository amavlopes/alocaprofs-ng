import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'

import { ProfessorI } from '../interfaces/professor.interface'
import { catchError, map, Observable, throwError } from 'rxjs'
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
}
