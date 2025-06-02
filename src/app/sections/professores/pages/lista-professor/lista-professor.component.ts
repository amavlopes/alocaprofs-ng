import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'

import { catchError, EMPTY, finalize, forkJoin, Observable, of, Subject, takeUntil, tap } from 'rxjs'

import { ConfirmationService, MenuItem } from 'primeng/api'
import { ButtonModule } from 'primeng/button'

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component'
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog/confirm-dialog.component'
import { DialogComponent } from '../../../../shared/dialogs/dialog/dialog.component'
import { LoaderComponent } from '../../../../shared/loader/loader.component'
import { NenhumResultadoComponent } from '../../../../shared/nenhum-resultado/nenhum-resultado.component'
import { FiltroTabelaContainerComponent } from '../../../../shared/tabela/components/filtro-tabela-container/filtro-tabela-container.component'
import { InputSearchComponent } from '../../../../shared/tabela/components/input-search/input-search.component'
import { TabelaComponent } from '../../../../shared/tabela/tabela.component'
import { ProfessorService } from '../../services/professor.service'
import { ProfessorI } from '../../interfaces/professor.interface'
import { Coluna } from '../../../../shared/tabela/interfaces/coluna.interface'
import { SelectComponent } from '../../../../shared/formulario/select/select.component'
import { DepartamentoService } from '../../../departamentos/services/departamento.service'
import { DepartamentoI } from '../../../departamentos/interfaces/departamento.interface'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'pa-lista-professor',
  imports: [
    CommonModule,
    BreadcrumbComponent,
    ButtonModule,
    DialogComponent,
    ConfirmDialogComponent,
    FiltroTabelaContainerComponent,
    InputSearchComponent,
    LoaderComponent,
    TabelaComponent,
    NenhumResultadoComponent,
    SelectComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './lista-professor.component.html',
})
export class ListaProfessorComponent {
  private roteador = inject(Router)
  private servicoProfessor = inject(ProfessorService)
  private servicoDepartamento = inject(DepartamentoService)
  private destroy$ = new Subject<void>()

  estaCarregandoPagina = true
  mostrarEstadoInicialVazio!: boolean
  mostrarDialog = false
  items: MenuItem[] = []
  home: MenuItem | undefined
  tituloErro = 'Erro ao buscar professor'
  mensagemErro = ''
  indice = 0
  registros = 10
  professores: ProfessorI[] = []
  departamentos: DepartamentoI[] = []
  hum = new FormControl('')
  colunas: Coluna[] = []

  constructor() {
    this.definirBreadcrumb()

    this.definirColunasTabela()
  }

  ngOnInit() {
    this.carregarListaEFiltros()

    console.log
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

  obterProfessoresHttp$(termo: string = ''): Observable<ProfessorI[]> {
    return this.servicoProfessor.obterProfessores(termo).pipe(
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

  obterProfessoresPorDepartamentoHttp$(idDepartamento: number): Observable<ProfessorI[]> {
    return this.servicoProfessor.obterProfessoresPorDepartamento(idDepartamento).pipe(
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

  carregarListaEFiltros() {
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

  pesquisarPorNome(termo: string): void {
    this.obterProfessoresHttp$(termo).subscribe((professores: ProfessorI[]) => {
      this.professores = professores

      this.mostrarEstadoInicialVazio = false
    })
  }

  aoSelecionarDepartamento(idDepartamento: number): void {
    if (idDepartamento) {
      this.obterProfessoresPorDepartamentoHttp$(idDepartamento).subscribe(
        (professores: ProfessorI[]) => (this.professores = professores)
      )
    } else {
      this.obterProfessoresHttp$().subscribe((professores: ProfessorI[]) => (this.professores = professores))
    }
  }

  adicionarProfessor(): void {
    this.roteador.navigate(['/professores/cadastro'])
  }
}
