import { Component, OnDestroy, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'

import { catchError, EMPTY, finalize, Subject, takeUntil } from 'rxjs'

import { CursoService } from '../../services/curso.service'
import { DialogComponent } from '../../../../shared/dialog/dialog.component'
import { CursoI } from '../../interfaces/curso.interface'
import { MessageService } from 'primeng/api'
import { FormularioCursoComponent } from '../../components/formulario-curso/formulario-curso.component'

@Component({
  selector: 'pa-cadastro-curso',
  imports: [CommonModule, ReactiveFormsModule, FormularioCursoComponent, DialogComponent],
  templateUrl: './cadastro-curso.component.html',
  styleUrl: './cadastro-curso.component.css',
})
export class CadastroCursoComponent implements OnDestroy {
  private servicoMensagem: MessageService = inject(MessageService)
  private roteador = inject(Router)
  private servicoCurso = inject(CursoService)
  private destroy$ = new Subject<void>()

  salvandoCurso = false
  mostrarDialog = false
  tituloErro = 'Erro ao cadastrar curso'
  mensagemErro = ''

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  observarEvtSalvar(curso: CursoI): void {
    this.salvandoCurso = true

    const { id, ...cursoACadastrar } = curso

    this.servicoCurso
      .criarCurso(cursoACadastrar)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.salvandoCurso = false)),
        catchError((e) => {
          this.tituloErro = 'Erro ao carregar curso'
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
