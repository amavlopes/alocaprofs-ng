import { Component, OnDestroy, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'

import { catchError, EMPTY, finalize, Subject, takeUntil } from 'rxjs'

import { CursoService } from '../../services/curso.service'
import { DialogComponent } from '../../../../shared/dialog/dialog.component'
import { CursoI } from '../../interfaces/curso.interface'
import { MenuItem, MessageService } from 'primeng/api'
import { FormularioCursoComponent } from '../../components/formulario-curso/formulario-curso.component'
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component'

@Component({
  selector: 'pa-cadastro-curso',
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent, FormularioCursoComponent, DialogComponent],
  templateUrl: './cadastro-curso.component.html',
  styleUrl: './cadastro-curso.component.css',
})
export class CadastroCursoComponent implements OnDestroy {
  private servicoMensagem: MessageService = inject(MessageService)
  private roteador = inject(Router)
  private servicoCurso = inject(CursoService)
  private destroy$ = new Subject<void>()

  salvando = false
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
      { icon: 'pi pi-home', route: '/inicio' },
      { icon: '', label: 'Cursos', route: '/cursos' },
    ]
  }

  observarEvtSalvar(curso: CursoI): void {
    this.salvando = true

    const { id, ...cursoACadastrar } = curso

    this.servicoCurso
      .criarCurso(cursoACadastrar)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.salvando = false)),
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
          detail: curso.nome,
        })

        this.roteador.navigate(['cursos'])
      })
  }

  observarEvtLimpar(): void {}
}
