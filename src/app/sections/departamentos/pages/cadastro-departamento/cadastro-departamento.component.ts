import { CommonModule } from '@angular/common'
import { Component, inject, OnDestroy } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'

import { catchError, EMPTY, finalize, Subject, takeUntil } from 'rxjs'

import { MenuItem, MessageService } from 'primeng/api'

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component'
import { DialogComponent } from '../../../../shared/dialogs/dialog/dialog.component'
import { DepartamentoI } from '../../interfaces/departamento.interface'
import { DepartamentoService } from './../../services/departamento.service'
import { FormularioDepartamentoComponent } from '../../components/formulario-departamento/formulario-departamento.component'

@Component({
  selector: 'pa-cadastro-departamento',
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent, FormularioDepartamentoComponent, DialogComponent],
  templateUrl: './cadastro-departamento.component.html',
})
export class CadastroDepartamentoComponent implements OnDestroy {
  private servicoMensagem: MessageService = inject(MessageService)
  private roteador = inject(Router)
  private servicoDepartamento = inject(DepartamentoService)
  private destroy$ = new Subject<void>()

  operacaoPendente = false
  mostrarDialog = false
  items: MenuItem[] = []
  tituloErro = 'Erro ao cadastrar departamento'
  mensagemErro = ''

  constructor() {
    this.definirBreadcrumb()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  definirBreadcrumb(): void {
    this.items = [
      { icon: 'pi pi-home', route: '/' },
      { icon: '', label: 'Departamentos', route: '/departamentos' },
    ]
  }

  aoClicarSalvar(departamento: DepartamentoI): void {
    if (this.operacaoPendente) return

    this.operacaoPendente = true

    const { id, ...novoDepartamento } = departamento

    this.servicoDepartamento
      .criarDepartamento(novoDepartamento)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.operacaoPendente = false)),
        catchError((e) => {
          this.tituloErro = 'Erro ao criar departamento'
          this.mensagemErro = e.message
          this.mostrarDialog = true

          return EMPTY
        })
      )
      .subscribe((departamento: DepartamentoI) => {
        this.servicoMensagem.add({
          severity: 'success',
          summary: `Departamento cadastrado com sucesso`,
        })

        this.roteador.navigate(['/departamentos'])
      })
  }
}
