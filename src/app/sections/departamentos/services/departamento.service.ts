import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'

import { catchError, map, Observable, retry, throwError } from 'rxjs'

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

  obterDepartamentos(nome?: string): Observable<DepartamentoI[]> {
    nome = nome?.trim()
    const opcoes = nome ? { params: new HttpParams().set('name', nome) } : {}

    return this.http.get<{ departments: DepartamentoResponseI[] }>(this.url, opcoes).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      retry({ count: 2, delay: 1000 }),
      map((response: { departments: DepartamentoResponseI[] }) => {
        const departmentos = response.departments.map((departmento: DepartamentoResponseI) => ({
          id: departmento.id,
          nome: departmento.name,
          descricao: departmento.description,
        }))

        return departmentos
      })
    )
  }
}
