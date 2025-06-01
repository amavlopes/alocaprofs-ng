import { CommonModule } from '@angular/common'
import { Component, inject, OnDestroy } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'

import { Subject, takeUntil, finalize, catchError, EMPTY } from 'rxjs'

import { MessageService, MenuItem } from 'primeng/api'

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component'
import { DialogComponent } from '../../../../shared/dialog/dialog.component'
import { FormularioProfessorComponent } from '../../components/formulario-professor/formulario-professor.component'
import { ProfessorI } from '../../interfaces/professor.interface'
import { ProfessorService } from '../../services/professor.service'

@Component({
  selector: 'pa-cadastro-professor',
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent, FormularioProfessorComponent, DialogComponent],
  templateUrl: './cadastro-professor.component.html',
})
export class CadastroProfessorComponent implements OnDestroy {
  private servicoMensagem: MessageService = inject(MessageService)
  private roteador = inject(Router)
  private servicoProfessor = inject(ProfessorService)
  private destroy$ = new Subject<void>()

  operacaoPendente = false
  mostrarDialog = false
  items: MenuItem[] = []
  tituloErro = 'Erro ao cadastrar professor'
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
      { icon: '', label: 'Professores', route: '/professores' },
    ]
  }

  aoClicarSalvar(professor: ProfessorI): void {
    if (this.operacaoPendente) return

    this.operacaoPendente = true

    const { id, ...novoProfessor } = professor

    this.servicoProfessor
      .criarProfessor(novoProfessor)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.operacaoPendente = false)),
        catchError((e) => {
          this.tituloErro = 'Erro ao criar professor'
          this.mensagemErro = e.message
          this.mostrarDialog = true

          return EMPTY
        })
      )
      .subscribe((professor: ProfessorI) => {
        this.servicoMensagem.add({
          severity: 'success',
          summary: `Professor cadastrado com sucesso`,
          detail: professor.nome,
        })

        this.roteador.navigate(['/professores'])
      })
  }
}
