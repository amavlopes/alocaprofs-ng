import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { AlocacaoI } from '../interfaces/alocacao.interface'
import { catchError, map, Observable, retry, throwError } from 'rxjs'
import { AlocacaoResponseI } from '../interfaces/response/alocacao-response.interface'

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
