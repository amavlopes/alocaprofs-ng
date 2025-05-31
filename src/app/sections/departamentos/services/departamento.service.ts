import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'

import { catchError, map, Observable, throwError } from 'rxjs'

import { DepartamentoI } from '../interfaces/departamento.interface'
import { DepartamentoResponseI } from '../interfaces/response/departamento-response.interface'

@Injectable({
  providedIn: 'root',
})
export class DepartamentoService {
  url: string = 'http://localhost:7000/departments'

  private http = inject(HttpClient)

  criarDepartamento(departamento: Omit<DepartamentoI, 'id'>): Observable<DepartamentoI> {
    const request = { name: departamento.nome, description: departamento.descricao }

    return this.http.post<{ department: DepartamentoResponseI }>(this.url, request).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      map((response: { department: DepartamentoResponseI }) => ({
        id: response.department.id,
        nome: response.department.name,
        descricao: response.department.description,
      }))
    )
  }
}
