import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { catchError, map, Observable, retry, tap, throwError } from 'rxjs'
import { CursoI } from '../interfaces/curso.interface'
import { CursoT } from '../types/curso.type'
import { CursoResponseT } from '../types/curso-response.type'

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  url: string = 'http://localhost:7000'

  private http = inject(HttpClient)

  criar(curso: CursoT): Observable<CursoI> {
    const request = { name: curso.nome }

    return this.http.post<{ course: CursoResponseT }>(`${this.url}/courses`, request).pipe(
      tap((response: { course: CursoResponseT }) => console.log(response.course)),
      map((response: { course: CursoResponseT }) => {
        const curso = { id: response.course.id, nome: response.course.name }
        return curso
      }),
      catchError((e) => throwError(() => new Error(e.error.message)))
    )
  }
}
