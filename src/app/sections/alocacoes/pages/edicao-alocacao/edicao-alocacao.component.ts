import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import { catchError, EMPTY, finalize, Observable, Subject, switchMap, takeUntil } from 'rxjs'

import { MenuItem, MessageService } from 'primeng/api'

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component'
import { DialogComponent } from '../../../../shared/dialogs/dialog/dialog.component'
import { LoaderComponent } from '../../../../shared/loader/loader.component'
import { FormularioAlocacaoComponent } from '../../components/formulario-alocacao/formulario-alocacao.component'
import { AlocacaoService } from '../../services/alocacao.service'
import { AlocacaoI } from '../../interfaces/alocacao.interface'

@Component({
  selector: 'pa-edicao-alocacao',
  imports: [CommonModule, BreadcrumbComponent, FormularioAlocacaoComponent, DialogComponent, LoaderComponent],
  templateUrl: './edicao-alocacao.component.html'
})
export class EdicaoAlocacaoComponent implements OnInit, OnDestroy {
  private servicoMensagem: MessageService = inject(MessageService)
  private roteador = inject(Router)
  private rotaAtiva = inject(ActivatedRoute)
  private servicoAlocacao = inject(AlocacaoService)
  private destroy$ = new Subject<void>()

  alocacao$!: Observable<AlocacaoI>
  alocacaoId!: number
  estaCarregando = true
  operacaoPendente = false
  mostrarDialog = false
  items: MenuItem[] = []
  tituloErro = ''
  mensagemErro = ''

  constructor() {
    this.definirBreadcrumb()
  }

  ngOnInit(): void {
    this.carregarAlocacao()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  definirBreadcrumb(): void {
    this.items = [
      { icon: 'pi pi-home', route: '/' },
      { icon: '', label: 'Alocações', route: '/alocacoes' }
    ]
  }

  carregarAlocacao(): void {
    this.alocacao$ = this.rotaAtiva.paramMap.pipe(
      switchMap((params) => {
        this.alocacaoId = Number(params.get('alocacaoId'))

        return this.servicoAlocacao.obterAlocacaoPorId(this.alocacaoId).pipe(
          catchError((e) => {
            this.tituloErro = 'Erro ao carregar alocação'
            this.mensagemErro = e.message
            this.mostrarDialog = true

            return EMPTY
          })
        )
      })
    )
  }

  aoClicarSalvar(alocacao: AlocacaoI): void {
    if (this.operacaoPendente) return

    this.operacaoPendente = true

    this.servicoAlocacao
      .atualizarAlocacao(alocacao)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.operacaoPendente = false)),
        catchError((e) => {
          this.tituloErro = 'Erro ao atualizar alocação'
          this.mensagemErro = e.message
          this.mostrarDialog = true

          return EMPTY
        })
      )
      .subscribe(() => {
        this.servicoMensagem.add({
          severity: 'success',
          summary: `Alocação atualizada com sucesso`
        })

        this.roteador.navigate(['/alocacoes'])
      })
  }
}
