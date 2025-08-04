import { CommonModule } from '@angular/common'
import { Component, inject, OnDestroy, OnInit } from '@angular/core'

import { catchError, concatMap, EMPTY, finalize, noop, Observable, of, Subject, takeUntil, tap } from 'rxjs'

import { ButtonModule } from 'primeng/button'
import { ConfirmationService, MenuItem } from 'primeng/api'

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component'
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog/confirm-dialog.component'
import { DialogComponent } from '../../../../shared/dialogs/dialog/dialog.component'
import { LoaderComponent } from '../../../../shared/loader/loader.component'
import { NenhumResultadoComponent } from '../../../../shared/nenhum-resultado/nenhum-resultado.component'
import { TabelaComponent } from '../../../../shared/tabela/tabela.component'
import { DepartamentoService } from '../../services/departamento.service'
import { DepartamentoI } from '../../interfaces/departamento.interface'
import { Coluna } from '../../../../shared/tabela/interfaces/coluna.interface'
import { Router } from '@angular/router'
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms'
import { InputTextComponent } from '../../../../shared/formulario/input-text/input-text.component'
import { DebounceClickDirective } from '../../../../shared/directives/debounce-click.directive'

@Component({
  selector: 'pa-lista-departamento',
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
    DebounceClickDirective
  ],
  providers: [ConfirmationService],
  templateUrl: './lista-departamento.component.html'
})
export class ListaDepartamentoComponent implements OnDestroy, OnInit {
  private fb = inject(FormBuilder)
  private roteador = inject(Router)
  private servicoConfirmacao: ConfirmationService = inject(ConfirmationService)
  private servicoDepartamento = inject(DepartamentoService)
  private destroy$ = new Subject<void>()

  estaCarregandoPagina = true
  mostrarEstadoInicialVazio!: boolean
  mostrarDialog = false
  items: MenuItem[] = []
  home: MenuItem | undefined
  tituloErro = 'Erro ao buscar departamento'
  mensagemErro = ''
  indice = 0
  registros = 10
  departamentos: DepartamentoI[] = []
  colunas: Coluna[] = []
  filtros = this.fb.group({
    nome: this.fb.control(''),
    departmentoId: this.fb.control('')
  })

  constructor() {
    this.definirBreadcrumb()

    this.definirColunasTabela()
  }

  get nome(): FormControl {
    return this.filtros.controls.nome as FormControl
  }

  ngOnInit() {
    this.carregarDepartamentos()
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
        largura: '7rem'
      },
      {
        campo: 'nome',
        cabecalho: 'Nome'
      }
    ]
  }

  obterDepartamentosHttp$(termo = ''): Observable<DepartamentoI[]> {
    return this.servicoDepartamento.obterDepartamentos(termo).pipe(
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

  carregarDepartamentos() {
    this.obterDepartamentosHttp$()
      .pipe(finalize(() => (this.estaCarregandoPagina = false)))
      .subscribe((departamentos: DepartamentoI[]) => {
        this.departamentos = departamentos

        this.mostrarEstadoInicialVazio = departamentos.length === 0
      })
  }

  atualizarLista(): void {
    this.obterDepartamentosHttp$(this.nome.value).subscribe((departamentos: DepartamentoI[]) => {
      this.departamentos = departamentos

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

  adicionarDepartamento(): void {
    this.roteador.navigate(['/departamentos/cadastro'])
  }

  editarDepartamento(departamento: unknown) {
    this.roteador.navigate(['/departamentos/edicao', (departamento as DepartamentoI).id])
  }

  confirmarExclusao(departamentoEvt: unknown) {
    const departamento = departamentoEvt as DepartamentoI

    this.servicoConfirmacao.confirm({
      closable: true,
      closeOnEscape: true,
      header: 'Excluir departamento',
      message: `Tem certeza que deseja excluir <b>${departamento.nome}</b>?`,
      accept: () => {
        this.excluirDepartamento(departamento.id)
      },
      reject: noop
    })
  }

  excluirDepartamento(id: number): void {
    this.servicoDepartamento
      .excluirDepartamentoPorId(id)
      .pipe(
        catchError((e) => {
          this.tituloErro = 'Erro ao excluir departamento'
          this.mensagemErro = e.message
          this.mostrarDialog = true

          return EMPTY
        }),
        concatMap(() => this.obterDepartamentosHttp$()),
        takeUntil(this.destroy$)
      )
      .subscribe((departamentos: DepartamentoI[]) => {
        if (!departamentos.length) this.mostrarEstadoInicialVazio = true

        this.departamentos = departamentos
      })
  }
}
