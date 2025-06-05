import { DiaSemana } from './../models/dia-semana'
import { DiaSemanaE } from './../enums/dia-semana.enum'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { AlocacaoI } from '../interfaces/alocacao.interface'
import { catchError, map, Observable, retry, throwError } from 'rxjs'
import { AlocacaoResponseI } from '../interfaces/response/alocacao-response.interface'
import { criarHttpParams } from '../../../shared/utilities/criar-http-params.utility'
import { AlocacaoParametrosI } from '../interfaces/alocacao-parametros.interface'
import { ItemListaAlocacaoI } from '../interfaces/item-lista-alocacao.interface'

@Injectable({
  providedIn: 'root',
})
export class AlocacaoService {
  url: string = 'http://localhost:7000/allocations'

  private http = inject(HttpClient)

  criarAlocacao(alocacao: Omit<AlocacaoI, 'id'>): Observable<AlocacaoI> {
    const request = this.criarRequest(alocacao)

    return this.http.post<{ allocation: AlocacaoResponseI }>(this.url, request).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      map((response: { allocation: AlocacaoResponseI }) => this.mapearResponse(response.allocation))
    )
  }

  obterAlocacoes(parametros?: AlocacaoParametrosI): Observable<ItemListaAlocacaoI[]> {
    const params = criarHttpParams({
      day: parametros?.diaSemana,
      courseId: parametros?.idCurso,
      professorId: parametros?.idProfessor,
    })

    return this.http.get<{ allocations: AlocacaoResponseI[] }>(this.url, { params }).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      retry({ count: 2, delay: 1000 }),
      map((response: { allocations: AlocacaoResponseI[] }) => {
        const alocacoes: ItemListaAlocacaoI[] = response.allocations.map((allocation: AlocacaoResponseI) => ({
          id: allocation.id,
          diaSemana: DiaSemana.retornarDia(allocation.day),
          inicio: allocation.startHour,
          fim: allocation.endHour,
          curso: allocation.course.name,
          professor: allocation.professor.name,
        }))

        return alocacoes
      })
    )
  }

  obterAlocacaoPorId(id: number): Observable<AlocacaoI> {
    return this.http.get<{ allocation: AlocacaoResponseI }>(`${this.url}/${id}`).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      retry({ count: 2, delay: 1000 }),
      map((response: { allocation: AlocacaoResponseI }) => this.mapearResponse(response.allocation))
    )
  }

  atualizarAlocacao(alocacao: AlocacaoI): Observable<AlocacaoI> {
    const request = this.criarRequest(alocacao)

    return this.http.put<{ allocation: AlocacaoResponseI }>(`${this.url}/${alocacao.id}`, request).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      map((response: { allocation: AlocacaoResponseI }) => this.mapearResponse(response.allocation))
    )
  }

  private criarRequest(alocacao: Omit<AlocacaoI, 'id'>) {
    return {
      day: alocacao.diaSemana,
      startHour: alocacao.horarioInicial,
      endHour: alocacao.horarioFinal,
      courseId: alocacao.idCurso,
      professorId: alocacao.idProfessor,
    }
  }

  private mapearResponse(allocation: AlocacaoResponseI): AlocacaoI {
    return {
      id: allocation.id,
      diaSemana: allocation.day,
      horarioInicial: allocation.startHour,
      horarioFinal: allocation.endHour,
      idCurso: allocation.course.id,
      idProfessor: allocation.professor.id,
    }
  }
}
