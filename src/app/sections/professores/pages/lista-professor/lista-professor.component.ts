import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'

import { catchError, concatMap, EMPTY, finalize, forkJoin, Observable, Subject, takeUntil, tap } from 'rxjs'

import { ConfirmationService, MenuItem } from 'primeng/api'
import { ButtonModule } from 'primeng/button'

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component'
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog/confirm-dialog.component'
import { DialogComponent } from '../../../../shared/dialogs/dialog/dialog.component'
import { LoaderComponent } from '../../../../shared/loader/loader.component'
import { NenhumResultadoComponent } from '../../../../shared/nenhum-resultado/nenhum-resultado.component'
import { TabelaComponent } from '../../../../shared/tabela/tabela.component'
import { ProfessorService } from '../../services/professor.service'
import { ProfessorI } from '../../interfaces/professor.interface'
import { Coluna } from '../../../../shared/tabela/interfaces/coluna.interface'
import { SelectComponent } from '../../../../shared/formulario/select/select.component'
import { DepartamentoService } from '../../../departamentos/services/departamento.service'
import { DepartamentoI } from '../../../departamentos/interfaces/departamento.interface'
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms'
import { InputTextComponent } from '../../../../shared/formulario/input-text/input-text.component'

@Component({
  selector: 'pa-lista-professor',
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
    InputTextComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './lista-professor.component.html',
})
export class ListaProfessorComponent {
  private fb = inject(FormBuilder)
  private roteador = inject(Router)
  private servicoConfirmacao: ConfirmationService = inject(ConfirmationService)
  private servicoProfessor = inject(ProfessorService)
  private servicoDepartamento = inject(DepartamentoService)
  private destroy$ = new Subject<void>()

  estaCarregandoPagina = true
  mostrarEstadoInicialVazio!: boolean
  mostrarDialog = false
  items: MenuItem[] = []
  tituloErro = 'Erro ao buscar professor'
  mensagemErro = ''
  indice = 0
  registros = 10
  professores: ProfessorI[] = []
  departamentos: DepartamentoI[] = []
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

  get departmentoId(): FormControl {
    return this.filtros.controls.departmentoId as FormControl
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
        campo: 'id',
        cabecalho: 'Código',
        largura: '7rem',
      },
      {
        campo: 'nome',
        cabecalho: 'Nome',
      },
      {
        campo: 'cpf',
        cabecalho: 'CPF',
      },
    ]
  }

  obterProfessoresHttp$(nome?: string, idDepartamento?: string): Observable<ProfessorI[]> {
    return this.servicoProfessor.obterProfessores(nome, idDepartamento).pipe(
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

  obterDepartamentosHttp$() {
    return this.servicoDepartamento.obterDepartamentos().pipe(
      catchError((e: Error) => {
        this.mensagemErro = e.message
        this.mostrarDialog = true

        return EMPTY
      }),
      takeUntil(this.destroy$)
    )
  }

  carregarPagina() {
    forkJoin({
      professores: this.obterProfessoresHttp$(),
      departamentos: this.obterDepartamentosHttp$(),
    })
      .pipe(finalize(() => (this.estaCarregandoPagina = false)))
      .subscribe(({ professores, departamentos }: { professores: ProfessorI[]; departamentos: DepartamentoI[] }) => {
        this.professores = professores
        this.departamentos = departamentos
        this.mostrarEstadoInicialVazio = professores.length === 0
      })
  }

  atualizarLista(): void {
    this.obterProfessoresHttp$(this.nome.value, this.departmentoId.value).subscribe((professores: ProfessorI[]) => {
      this.professores = professores

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

  adicionarProfessor(): void {
    this.roteador.navigate(['/professores/cadastro'])
  }

  editarProfessor(curso: ProfessorI) {
    this.roteador.navigate(['/professores/edicao', curso.id])
  }

  confirmarExclusao(professor: ProfessorI) {
    this.servicoConfirmacao.confirm({
      closable: true,
      closeOnEscape: true,
      header: 'Excluir professor',
      message: `Tem certeza que deseja excluir <b>${professor.nome}</b>?`,
      accept: () => {
        this.excluirProfessor(professor.id)
      },
      reject: () => {},
    })
  }

  excluirProfessor(id: number): void {
    this.servicoProfessor
      .excluirProfessorPorId(id)
      .pipe(
        catchError((e) => {
          this.tituloErro = 'Erro ao excluir professor'
          this.mensagemErro = e.message
          this.mostrarDialog = true

          return EMPTY
        }),
        concatMap(() => this.obterProfessoresHttp$()),
        takeUntil(this.destroy$)
      )
      .subscribe((professores: ProfessorI[]) => {
        if (!professores.length) this.mostrarEstadoInicialVazio = true

        this.professores = professores
      })
  }
}
