import { CommonModule } from '@angular/common'
import { Component, inject, OnDestroy, OnInit } from '@angular/core'

import { catchError, finalize, Observable, of, Subject, takeUntil, tap } from 'rxjs'

import { ButtonModule } from 'primeng/button'
import { ConfirmationService, MenuItem } from 'primeng/api'

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component'
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component'
import { DialogComponent } from '../../../../shared/dialog/dialog.component'
import { FiltroTabelaContainerComponent } from '../../../../shared/filtro-tabela-container/filtro-tabela-container.component'
import { InputSearchComponent } from '../../../../shared/input-search/input-search.component'
import { LoaderComponent } from '../../../../shared/loader/loader.component'
import { NenhumResultadoComponent } from '../../../../shared/nenhum-resultado/nenhum-resultado.component'
import { TabelaComponent } from '../../../../shared/tabela/tabela.component'
import { DepartamentoService } from '../../services/departamento.service'
import { DepartamentoI } from '../../interfaces/departamento.interface'
import { Coluna } from '../../../../shared/tabela/interfaces/coluna.interface'
import { Router } from '@angular/router'

@Component({
  selector: 'pa-lista-departamento',
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
  ],
  providers: [ConfirmationService],
  templateUrl: './lista-departamento.component.html',
})
export class ListaDepartamentoComponent implements OnDestroy, OnInit {
  private roteador = inject(Router)
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

  constructor() {
    this.definirBreadcrumb()

    this.definirColunasTabela()
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
        largura: '7rem',
      },
      {
        campo: 'nome',
        cabecalho: 'Nome',
      },
    ]
  }

  obterDepartamentosHttp$(termo: string = ''): Observable<DepartamentoI[]> {
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

  pesquisarPorNome(termo: string): void {
    this.obterDepartamentosHttp$(termo).subscribe((departamentos: DepartamentoI[]) => {
      this.departamentos = departamentos

      this.mostrarEstadoInicialVazio = false
    })
  }

  adicionarDepartamento(): void {
    this.roteador.navigate(['/departamentos/cadastro'])
  }
}
