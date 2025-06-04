import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { AlocacaoI } from '../interfaces/alocacao.interface'
import { catchError, EMPTY, map, Observable, throwError } from 'rxjs'
import { AlocacaoResponseI } from '../interfaces/response/alocacao-response.interface'

@Injectable({
  providedIn: 'root',
})
export class AlocacaoService {
  url: string = 'http://localhost:7000/allocations'

  private http = inject(HttpClient)

  criarAlocacao(professor: Omit<AlocacaoI, 'id'>): Observable<AlocacaoI> {
    const request = {
      day: professor.diaSemana,
      startHour: professor.horarioInicial,
      endHour: professor.horarioFinal,
      courseId: professor.idCurso,
      professorId: professor.idProfessor,
    }

    return this.http.post<{ allocation: AlocacaoResponseI }>(this.url, request).pipe(
      catchError((e) => throwError(() => new Error(e.error.message || e.message))),
      map((response: { allocation: AlocacaoResponseI }) => ({
        id: response.allocation.id,
        diaSemana: response.allocation.day,
        horarioInicial: response.allocation.startHour,
        horarioFinal: response.allocation.endHour,
        idCurso: response.allocation.courseId,
        idProfessor: response.allocation.professorId,
      }))
    )
  }

  transformarStringParaDate(horario: string) {
    const arrayHora = horario.split(':')
    const hora = parseInt(arrayHora[0])
    const minuto = parseInt(arrayHora[1])
    const segundo = 0

    return new Date(1970, 0, 1, hora, minuto, segundo)
  }
}
