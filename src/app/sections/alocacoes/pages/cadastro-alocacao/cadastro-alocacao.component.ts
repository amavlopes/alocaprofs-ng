import { CommonModule } from '@angular/common'
import { Component, inject, OnDestroy } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component'
import { DialogComponent } from '../../../../shared/dialogs/dialog/dialog.component'
import { FormularioAlocacaoComponent } from '../../components/formulario-alocacao/formulario-alocacao.component'
import { MenuItem, MessageService } from 'primeng/api'
import { Router } from '@angular/router'
import { AlocacaoService } from '../../services/alocacao.service'
import { catchError, EMPTY, finalize, Subject, takeUntil } from 'rxjs'
import { AlocacaoI } from '../../interfaces/alocacao.interface'

@Component({
  selector: 'pa-cadastro-alocacao',
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent, FormularioAlocacaoComponent, DialogComponent],
  templateUrl: './cadastro-alocacao.component.html',
})
export class CadastroAlocacaoComponent implements OnDestroy {
  private servicoMensagem: MessageService = inject(MessageService)
  private roteador = inject(Router)
  private servicoAlocacao = inject(AlocacaoService)
  private destroy$ = new Subject<void>()

  operacaoPendente = false
  items: MenuItem[] = []
  mostrarDialog = false
  tituloErro = 'Erro ao cadastrar alocação'
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
      { icon: '', label: 'Alocações', route: '/alocacoes' },
    ]
  }

  aoClicarSalvar(professor: AlocacaoI): void {
    if (this.operacaoPendente) return

    this.operacaoPendente = true

    const { id, ...novoProfessor } = professor

    this.servicoAlocacao
      .criarAlocacao(novoProfessor)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.operacaoPendente = false)),
        catchError((e: Error) => {
          this.mensagemErro = e.message
          this.mostrarDialog = true

          return EMPTY
        })
      )
      .subscribe((_) => {
        this.servicoMensagem.add({
          severity: 'success',
          summary: `Alocação cadastrada com sucesso`,
        })

        this.roteador.navigate(['/alocacoes'])
      })
  }
}
