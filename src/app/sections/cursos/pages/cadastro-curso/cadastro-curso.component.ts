import { Component, OnDestroy, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'

import { catchError, EMPTY, finalize, Subject, takeUntil } from 'rxjs'

import { MenuItem, MessageService } from 'primeng/api'

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component'
import { DialogComponent } from '../../../../shared/dialogs/dialog/dialog.component'
import { CursoI } from '../../interfaces/curso.interface'
import { CursoService } from '../../services/curso.service'
import { FormularioCursoComponent } from '../../components/formulario-curso/formulario-curso.component'

@Component({
  selector: 'pa-cadastro-curso',
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent, FormularioCursoComponent, DialogComponent],
  templateUrl: './cadastro-curso.component.html',
})
export class CadastroCursoComponent implements OnDestroy {
  private servicoMensagem: MessageService = inject(MessageService)
  private roteador = inject(Router)
  private servicoCurso = inject(CursoService)
  private destroy$ = new Subject<void>()

  operacaoPendente = false
  mostrarDialog = false
  items: MenuItem[] = []
  tituloErro = 'Erro ao cadastrar curso'
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
      { icon: '', label: 'Cursos', route: '/cursos' },
    ]
  }

  aoClicarSalvar(curso: CursoI): void {
    if (this.operacaoPendente) return

    this.operacaoPendente = true

    const { id, ...novoCurso } = curso

    this.servicoCurso
      .criarCurso(novoCurso)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.operacaoPendente = false)),
        catchError((e) => {
          this.tituloErro = 'Erro ao criar curso'
          this.mensagemErro = e.message
          this.mostrarDialog = true

          return EMPTY
        })
      )
      .subscribe((curso: CursoI) => {
        this.servicoMensagem.add({
          severity: 'success',
          summary: `Curso cadastrado com sucesso`,
        })

        this.roteador.navigate(['/cursos'])
      })
  }
}
