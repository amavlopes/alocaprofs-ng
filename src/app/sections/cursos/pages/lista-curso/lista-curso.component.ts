import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'

import { catchError, finalize, Observable, of, Subject } from 'rxjs'

import { DialogModule } from 'primeng/dialog'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ConfirmationService } from 'primeng/api'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'

import { CursoService } from '../../services/curso.service'
import { CursoI } from '../../interfaces/curso.interface'

@Component({
  selector: 'pa-lista-curso',
  imports: [
    CommonModule,
    DialogModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './lista-curso.component.html',
  styleUrl: './lista-curso.component.css',
})
export class ListaCursoComponent implements AfterViewInit, OnDestroy {
  private servicoCurso = inject(CursoService)
  private destroy$ = new Subject<void>()

  loading = true
  mostrarDialog = false
  tituloErro = 'Erro ao buscar curso'
  mensagemErro = ''
  cursos$!: Observable<CursoI[]>

  ngAfterViewInit(): void {
    this.cursos$ = this.carregarCursos()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  carregarCursos(nome: string = ''): Observable<CursoI[]> {
    return this.servicoCurso.listar(nome).pipe(
      finalize(() => (this.loading = false)),
      catchError((e) => {
        this.mensagemErro = e.message
        this.mostrarDialog = true

        return of([])
      })
    )
  }
}
