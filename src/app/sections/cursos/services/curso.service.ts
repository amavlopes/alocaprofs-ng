import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { catchError, map, Observable, retry, tap, throwError } from 'rxjs'
import { CursoI } from '../interfaces/response/curso.interface'
import { CursoResponseI } from '../interfaces/response/curso-response.interface'

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  url: string = 'http://localhost:7000'

  private http = inject(HttpClient)

  criar(curso: Omit<CursoI, 'id'>): Observable<CursoI> {
    const request = { name: curso.nome }

    return this.http.post<{ course: CursoResponseI }>(`${this.url}/courses`, request).pipe(
      tap((response: { course: CursoResponseI }) => console.log(response.course)),
      map((response: { course: CursoResponseI }) => {
        const curso = { id: response.course.id, nome: response.course.name }
        return curso
      }),
      catchError((e) => throwError(() => new Error(e.error.message)))
    )
  }
}
