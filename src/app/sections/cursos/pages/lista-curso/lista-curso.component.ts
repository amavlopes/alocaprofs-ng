import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'

import { catchError, concatMap, EMPTY, finalize, Observable, of, Subject, takeUntil, tap } from 'rxjs'

import { DialogComponent } from '../../../../shared/dialogs/dialog/dialog.component'
import { ButtonModule } from 'primeng/button'
import { ConfirmationService, MenuItem } from 'primeng/api'

import { CursoService } from '../../services/curso.service'
import { CursoI } from '../../interfaces/curso.interface'
import { LoaderComponent } from '../../../../shared/loader/loader.component'
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog/confirm-dialog.component'
import { TabelaComponent } from '../../../../shared/tabela/tabela.component'
import { Coluna } from '../../../../shared/tabela/interfaces/coluna.interface'
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component'
import { NenhumResultadoComponent } from '../../../../shared/nenhum-resultado/nenhum-resultado.component'
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms'
import { InputTextComponent } from '../../../../shared/formulario/input-text/input-text.component'

@Component({
  selector: 'pa-lista-curso',
  imports: [
    CommonModule,
    BreadcrumbComponent,
    ButtonModule,
    DialogComponent,
    ConfirmDialogComponent,
    ReactiveFormsModule,
    InputTextComponent,
    LoaderComponent,
    TabelaComponent,
    NenhumResultadoComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './lista-curso.component.html',
})
export class ListaCursoComponent implements OnDestroy, OnInit {
  private fb = inject(FormBuilder)
  private roteador = inject(Router)
  private servicoConfirmacao: ConfirmationService = inject(ConfirmationService)
  private servicoCurso = inject(CursoService)
  private destroy$ = new Subject<void>()

  estaCarregandoPagina = true
  mostrarEstadoInicialVazio!: boolean
  mostrarDialog = false
  items: MenuItem[] = []
  home: MenuItem | undefined
  tituloErro = 'Erro ao buscar curso'
  mensagemErro = ''
  indice = 0
  registros = 10
  cursos: CursoI[] = []
  colunas: Coluna[] = []
  filtros = this.fb.group({
    nome: this.fb.control(''),
    departmentoId: this.fb.control(''),
  })

  constructor() {
    this.definirBreadcrumb()

    this.definirColunasTabela()
  }

  get nome(): FormControl {
    return this.filtros.controls.nome as FormControl
  }

  ngOnInit() {
    this.carregarCursos()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  definirBreadcrumb(): void {
    this.items = [{ icon: 'pi pi-home', route: '/' }]
  }

  definirColunasTabela(): void {
    this.colunas = [
      {
        campo: 'id',
        cabecalho: 'Código',
        largura: '7rem',
      },
      {
        campo: 'nome',
        cabecalho: 'Nome',
      },
    ]
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

  carregarCursos() {
    this.obterCursosHttp$()
      .pipe(finalize(() => (this.estaCarregandoPagina = false)))
      .subscribe((cursos: CursoI[]) => {
        this.cursos = cursos

        this.mostrarEstadoInicialVazio = cursos.length === 0
      })
  }

  atualizarLista(): void {
    this.obterCursosHttp$(this.nome.value).subscribe((cursos: CursoI[]) => {
      this.cursos = cursos

      this.mostrarEstadoInicialVazio = false
    })
  }

  pesquisar(): void {
    this.atualizarLista()
  }

  limpar(): void {
    this.filtros.reset()
    this.atualizarLista()
  }

  adicionarCurso(): void {
    this.roteador.navigate(['/cursos/cadastro'])
  }

  editarCurso(curso: CursoI) {
    this.roteador.navigate(['/cursos/edicao', curso.id])
  }

  confirmarExclusao(curso: CursoI) {
    this.servicoConfirmacao.confirm({
      closable: true,
      closeOnEscape: true,
      header: 'Excluir curso',
      message: `Tem certeza que deseja excluir <b>${curso.nome}</b>?`,
      accept: () => {
        this.excluirCurso(curso.id)
      },
      reject: () => {},
    })
  }

  excluirCurso(id: number): void {
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
      .subscribe((cursos: CursoI[]) => {
        if (!cursos.length) this.mostrarEstadoInicialVazio = true

        this.cursos = cursos
      })
  }
}
