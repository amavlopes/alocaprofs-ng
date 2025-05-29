import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'

import { catchError, concatMap, EMPTY, finalize, Observable, of, Subject, takeUntil, tap } from 'rxjs'

import { DialogComponent } from '../../../../shared/dialog/dialog.component'
import { ButtonModule } from 'primeng/button'
import { ConfirmationService } from 'primeng/api'
import { FluidModule } from 'primeng/fluid'

import { CursoService } from '../../services/curso.service'
import { CursoI } from '../../interfaces/curso.interface'
import { LoaderComponent } from '../../../../shared/loader/loader.component'
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component'
import { InputSearchComponent } from '../../../../shared/input-search/input-search.component'
import { TabelaComponent } from '../../../../shared/tabela/tabela.component'
import { Coluna } from '../../../../shared/tabela/interfaces/coluna.interface'

@Component({
  selector: 'pa-lista-curso',
  imports: [
    CommonModule,
    ButtonModule,
    FluidModule,
    DialogComponent,
    ConfirmDialogComponent,
    InputSearchComponent,
    LoaderComponent,
    TabelaComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './lista-curso.component.html',
  styleUrl: './lista-curso.component.css',
})
export class ListaCursoComponent implements OnDestroy, OnInit {
  private roteador = inject(Router)
  private servicoConfirmacao: ConfirmationService = inject(ConfirmationService)
  private servicoCurso = inject(CursoService)
  private destroy$ = new Subject<void>()

  loading = true
  mostrarDialog = false
  tituloErro = 'Erro ao buscar curso'
  mensagemErro = ''
  cursos: CursoI[] = []
  indice = 0
  registros = 10
  colunas: Coluna[] = [
    {
      campo: 'id',
      cabecalho: 'Código',
      largura: '6.5rem',
    },
    {
      campo: 'nome',
      cabecalho: 'Nome',
    },
  ]

  ngOnInit() {
    this.carregarCursos()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  obterCursosHttp$(termo: string = ''): Observable<CursoI[]> {
    return this.servicoCurso.obterCursos(termo).pipe(
      catchError((e) => {
        this.mensagemErro = e.message
        this.mostrarDialog = true

        return of([])
      }),
      tap(() => {
        if (this.indice !== 0) this.indice = 0
      }),
      takeUntil(this.destroy$)
    )
  }

  carregarCursos(termo: string = ''): void {
    this.obterCursosHttp$(termo)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((cursos: CursoI[]) => {
        this.cursos = cursos
      })
  }

  pesquisarPorNome(termo: string): void {
    this.carregarCursos(termo)
  }

  adicionarCurso(): void {
    this.roteador.navigate(['cursos/cadastro'])
  }

  editarCurso(curso: CursoI) {
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
        catchError((e) => {
          this.tituloErro = 'Erro ao excluir curso'
          this.mensagemErro = e.message
          this.mostrarDialog = true

          return EMPTY
        }),
        concatMap(() => this.obterCursosHttp$()),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (cursos: CursoI[]) => (this.cursos = cursos),
        complete: () => (this.loading = false),
      })
  }
}
