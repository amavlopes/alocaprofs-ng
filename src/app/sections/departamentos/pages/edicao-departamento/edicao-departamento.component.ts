import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, OnDestroy } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'

import { catchError, EMPTY, finalize, Observable, Subject, switchMap, takeUntil } from 'rxjs'

import { MenuItem, MessageService } from 'primeng/api'

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component'
import { DialogComponent } from '../../../../shared/dialogs/dialog/dialog.component'
import { FormularioDepartamentoComponent } from '../../components/formulario-departamento/formulario-departamento.component'

import { DepartamentoService } from '../../services/departamento.service'
import { DepartamentoI } from '../../interfaces/departamento.interface'
import { LoaderComponent } from '../../../../shared/loader/loader.component'

@Component({
  selector: 'pa-edicao-departamento',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    FormularioDepartamentoComponent,
    DialogComponent,
    LoaderComponent
  ],
  templateUrl: './edicao-departamento.component.html'
})
export class EdicaoDepartamentoComponent implements OnInit, OnDestroy {
  private servicoMensagem: MessageService = inject(MessageService)
  private roteador = inject(Router)
  private rotaAtiva = inject(ActivatedRoute)
  private servicoDepartamento = inject(DepartamentoService)
  private destroy$ = new Subject<void>()

  departamento$!: Observable<DepartamentoI>
  departamentoId!: number
  estaCarregando = true
  operacaoPendente = false
  mostrarDialog = false
  items: MenuItem[] = []
  tituloErro = 'Erro ao cadastrar departamento'
  mensagemErro = ''

  constructor() {
    this.definirBreadcrumb()
  }

  ngOnInit(): void {
    this.carregarDepartamento()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  definirBreadcrumb(): void {
    this.items = [
      { icon: 'pi pi-home', route: '/' },
      { icon: '', label: 'Departamentos', route: '/departamentos' }
    ]
  }

  carregarDepartamento(): void {
    this.departamento$ = this.rotaAtiva.paramMap.pipe(
      switchMap((params) => {
        this.departamentoId = Number(params.get('departamentoId'))

        return this.servicoDepartamento.obterDepartamentoPorId(this.departamentoId).pipe(
          catchError((e) => {
            this.tituloErro = 'Erro ao carregar departamento'
            this.mensagemErro = e.message
            this.mostrarDialog = true

            return EMPTY
          })
        )
      })
    )
  }

  aoClicarSalvar(departamento: DepartamentoI): void {
    if (this.operacaoPendente) return

    this.operacaoPendente = true

    this.servicoDepartamento
      .atualizarDepartamento(departamento)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.operacaoPendente = false)),
        catchError((e) => {
          this.tituloErro = 'Erro ao atualizar departamento'
          this.mensagemErro = e.message
          this.mostrarDialog = true

          return EMPTY
        })
      )
      .subscribe(() => {
        this.servicoMensagem.add({
          severity: 'success',
          summary: `Departamento atualizado com sucesso`
        })

        this.roteador.navigate(['/departamentos'])
      })
  }
}
