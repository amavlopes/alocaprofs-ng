import { AfterViewInit, Component, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'

import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  fromEvent,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs'

import { DialogComponent } from '../../../../shared/dialog/dialog.component'
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
    DialogComponent,
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
  private roteador = inject(Router)
  private servicoConfirmacao: ConfirmationService = inject(ConfirmationService)
  private servicoCurso = inject(CursoService)
  private destroy$ = new Subject<void>()

  loading = true
  mostrarDialog = false
  tituloErro = 'Erro ao buscar curso'
  mensagemErro = ''
  cursos$!: Observable<CursoI[]>
  first = 0
  rows = 10
  @ViewChild('pesquisaPorNome') pesquisaPorNome!: ElementRef

  ngAfterViewInit(): void {
    this.cursos$ = this.observarEvtPesquisaPorNome()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  observarEvtPesquisaPorNome(): Observable<CursoI[]> {
    return fromEvent<any>(this.pesquisaPorNome.nativeElement, 'keyup').pipe(
      map((evento) => evento.target.value),
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((nome) => this.carregarCursos(nome))
    )
  }

  carregarCursos(nome: string = ''): Observable<CursoI[]> {
    return this.servicoCurso.obterCursos(nome).pipe(
      finalize(() => (this.loading = false)),
      catchError((e) => {
        this.mensagemErro = e.message
        this.mostrarDialog = true

        return of([])
      })
    )
  }

  adicionarCurso(): void {
    this.roteador.navigate(['cursos/cadastro'])
  }

  atualizarCurso(curso: CursoI) {
    this.roteador.navigate(['cursos/edicao', curso.id])
  }

  confirmarExclusao(curso: CursoI) {
    this.servicoConfirmacao.confirm({
      closable: true,
      closeOnEscape: true,
      header: 'Excluir curso?',
      message: `Tem certeza que deseja excluir o curso de ${curso.nome}?`,
      accept: () => {
        this.excluirCurso(curso.id)
      },
      reject: () => {},
    })
  }

  excluirCurso(id: number): void {
    this.loading = true

    this.servicoCurso
      .excluirCursoPorId(id)
      .pipe(
        finalize(() => (this.loading = false)),
        catchError((e) => {
          this.tituloErro = 'Erro ao excluir curso'
          this.mensagemErro = e.message
          this.mostrarDialog = true

          return []
        }),
        tap(() => {
          this.cursos$ = this.carregarCursos()
          this.first = 0
        }),
        takeUntil(this.destroy$)
      )
      .subscribe()
  }

  aoMudarDePagina(event: any) {
    this.first = event.first
    this.rows = event.rows
  }
}
