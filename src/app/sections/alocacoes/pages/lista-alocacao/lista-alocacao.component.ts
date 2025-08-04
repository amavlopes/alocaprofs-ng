import { CommonModule } from '@angular/common'
import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms'

import { catchError, concatMap, EMPTY, finalize, forkJoin, noop, Observable, Subject, takeUntil, tap } from 'rxjs'

import { ConfirmationService, MenuItem } from 'primeng/api'
import { ButtonModule } from 'primeng/button'

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component'
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog/confirm-dialog.component'
import { DialogComponent } from '../../../../shared/dialogs/dialog/dialog.component'
import { SelectComponent } from '../../../../shared/formulario/select/select.component'
import { LoaderComponent } from '../../../../shared/loader/loader.component'
import { NenhumResultadoComponent } from '../../../../shared/nenhum-resultado/nenhum-resultado.component'
import { TabelaComponent } from '../../../../shared/tabela/tabela.component'
import { Router } from '@angular/router'
import { ProfessorService } from '../../../professores/services/professor.service'
import { CursoService } from '../../../cursos/services/curso.service'
import { ProfessorI } from '../../../professores/interfaces/professor.interface'
import { CursoI } from '../../../cursos/interfaces/curso.interface'
import { Coluna } from '../../../../shared/tabela/interfaces/coluna.interface'
import { AlocacaoI } from '../../interfaces/alocacao.interface'
import { AlocacaoParametrosI } from '../../interfaces/alocacao-parametros.interface'
import { AlocacaoService } from '../../services/alocacao.service'
import { ItemListaAlocacaoI } from '../../interfaces/item-lista-alocacao.interface'
import { DiaSemanaI } from '../../interfaces/dia-semana.interface'
import { DiaSemana } from '../../models/dia-semana'
import { DebounceClickDirective } from '../../../../shared/directives/debounce-click.directive'

@Component({
  selector: 'pa-lista-alocacao',
  imports: [
    CommonModule,
    BreadcrumbComponent,
    ButtonModule,
    DialogComponent,
    ConfirmDialogComponent,
    LoaderComponent,
    TabelaComponent,
    NenhumResultadoComponent,
    SelectComponent,
    ReactiveFormsModule,
    DebounceClickDirective
  ],
  providers: [ConfirmationService],
  templateUrl: './lista-alocacao.component.html'
})
export class ListaAlocacaoComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder)
  private roteador = inject(Router)
  private servicoConfirmacao: ConfirmationService = inject(ConfirmationService)
  private servicoCurso = inject(CursoService)
  private servicoProfessor = inject(ProfessorService)
  private servicoAlocacao = inject(AlocacaoService)
  private destroy$ = new Subject<void>()

  estaCarregandoPagina = true
  mostrarEstadoInicialVazio!: boolean
  mostrarDialog = false
  items: MenuItem[] = []
  tituloErro = 'Erro ao buscar alocações'
  mensagemErro = ''
  indice = 0
  registros = 10
  listaAlocacao: ItemListaAlocacaoI[] = []
  dias: DiaSemanaI[] = DiaSemana.carregar()
  cursos: CursoI[] = []
  professores: ProfessorI[] = []
  colunas: Coluna[] = []
  filtros = this.fb.group({
    diaSemana: this.fb.control(''),
    idCurso: this.fb.control(''),
    idProfessor: this.fb.control('')
  })

  constructor() {
    this.definirBreadcrumb()
    this.definirColunasTabela()
  }

  get diaSemana(): FormControl {
    return this.filtros.controls.diaSemana as FormControl
  }

  get idCurso(): FormControl {
    return this.filtros.controls.idCurso as FormControl
  }

  get idProfessor(): FormControl {
    return this.filtros.controls.idProfessor as FormControl
  }

  ngOnInit() {
    this.carregarPagina()
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
        campo: 'diaSemana',
        cabecalho: 'Dia',
        largura: '8rem'
      },
      {
        campo: 'inicio',
        cabecalho: 'Início',
        largura: '8rem'
      },
      {
        campo: 'fim',
        cabecalho: 'Fim',
        largura: '8rem'
      },
      {
        campo: 'professor',
        cabecalho: 'Professor'
      }
    ]
  }

  obterCursosHttp$(): Observable<CursoI[]> {
    return this.servicoCurso.obterCursos().pipe(
      catchError((e) => {
        this.tituloErro = 'Erro ao obter cursos'
        this.mensagemErro = e.message
        this.mostrarDialog = true

        return EMPTY
      }),
      tap(() => {
        if (this.indice !== 0) this.indice = 0
      }),
      takeUntil(this.destroy$)
    )
  }

  obterProfessoresHttp$(): Observable<ProfessorI[]> {
    return this.servicoProfessor.obterProfessores().pipe(
      catchError((e) => {
        this.tituloErro = 'Erro ao obter professores'
        this.mensagemErro = e.message
        this.mostrarDialog = true

        return EMPTY
      }),
      tap(() => {
        if (this.indice !== 0) this.indice = 0
      }),
      takeUntil(this.destroy$)
    )
  }

  obterAlocacoesHttp$(parametros?: AlocacaoParametrosI): Observable<ItemListaAlocacaoI[]> {
    return this.servicoAlocacao.obterAlocacoes(parametros).pipe(
      catchError((e) => {
        this.mensagemErro = e.message
        this.mostrarDialog = true

        return EMPTY
      }),
      tap(() => {
        if (this.indice !== 0) this.indice = 0
      }),
      takeUntil(this.destroy$)
    )
  }

  carregarPagina() {
    forkJoin({
      cursos: this.obterCursosHttp$(),
      professores: this.obterProfessoresHttp$(),
      listaAlocacao: this.obterAlocacoesHttp$()
    })
      .pipe(finalize(() => (this.estaCarregandoPagina = false)))
      .subscribe(
        ({
          cursos,
          professores,
          listaAlocacao
        }: {
          cursos: CursoI[]
          professores: ProfessorI[]
          listaAlocacao: ItemListaAlocacaoI[]
        }) => {
          this.cursos = cursos
          this.professores = professores
          this.listaAlocacao = listaAlocacao
          this.mostrarEstadoInicialVazio = professores.length === 0
        }
      )
  }

  atualizarLista(): void {
    const parametros = {
      diaSemana: this.diaSemana.value,
      idCurso: this.idCurso.value,
      idProfessor: this.idProfessor.value
    }

    this.obterAlocacoesHttp$(parametros).subscribe((listaAlocacao: ItemListaAlocacaoI[]) => {
      this.listaAlocacao = listaAlocacao

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

  adicionarAlocacao(): void {
    this.roteador.navigate(['/alocacoes/cadastro'])
  }

  editarAlocacao(alocacao: unknown) {
    this.roteador.navigate(['/alocacoes/edicao', (alocacao as AlocacaoI).id])
  }

  confirmarExclusao(alocacaoEvt: unknown) {
    const alocacao = alocacaoEvt as ItemListaAlocacaoI

    this.servicoConfirmacao.confirm({
      closable: true,
      closeOnEscape: true,
      header: 'Excluir alocação',
      message: `Tem certeza que deseja excluir a alocação da <b>${alocacao.diaSemana}</b> das <b>${alocacao.inicio}</b> às <b>${alocacao.fim}</b>, com o professor <b>${alocacao.professor}</b> do curso <b>${alocacao.curso}</b>?`,
      accept: () => {
        this.excluirAlocacao(alocacao.id)
      },
      reject: noop
    })
  }

  excluirAlocacao(id: number): void {
    this.servicoAlocacao
      .excluirAlocacaoPorId(id)
      .pipe(
        catchError((e) => {
          this.tituloErro = 'Erro ao excluir alocação'
          this.mensagemErro = e.message
          this.mostrarDialog = true

          return EMPTY
        }),
        concatMap(() => this.obterAlocacoesHttp$()),
        takeUntil(this.destroy$)
      )
      .subscribe((listaAlocacao: ItemListaAlocacaoI[]) => {
        if (!listaAlocacao.length) this.mostrarEstadoInicialVazio = true

        this.listaAlocacao = listaAlocacao
      })
  }
}
