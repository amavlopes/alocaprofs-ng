import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import { catchError, EMPTY, finalize, Observable, Subject, switchMap, takeUntil } from 'rxjs'

import { MessageService } from 'primeng/api'

import { CursoService } from '../../services/curso.service'
import { CursoI } from '../../interfaces/curso.interface'
import { DialogComponent } from '../../../../shared/dialog/dialog.component'
import { FormularioCursoComponent } from '../../components/formulario-curso/formulario-curso.component'
import { LoaderComponent } from '../../../../shared/loader/loader.component'

@Component({
  selector: 'pa-edicao-curso',
  imports: [CommonModule, FormularioCursoComponent, DialogComponent, LoaderComponent],
  templateUrl: './edicao-curso.component.html',
  styleUrl: './edicao-curso.component.css',
})
export class EdicaoCursoComponent {
  private servicoMensagem: MessageService = inject(MessageService)
  private roteador = inject(Router)
  private rotaAtiva = inject(ActivatedRoute)
  private servicoCurso = inject(CursoService)
  private destroy$ = new Subject<void>()

  curso$!: Observable<CursoI>
  cursoId!: number
  operacaoPendente = false
  mostrarDialog = false
  tituloErro = ''
  mensagemErro = ''

  ngOnInit(): void {
    this.carregarCurso()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  carregarCurso(): void {
    this.curso$ = this.rotaAtiva.paramMap.pipe(
      switchMap((params) => {
        this.cursoId = Number(params.get('cursoId'))

        return this.servicoCurso.obterCursoPorId(this.cursoId).pipe(
          catchError((e) => {
            this.tituloErro = 'Erro ao carregar curso'
            this.mensagemErro = e.message
            this.mostrarDialog = true

            return EMPTY
          })
        )
      })
    )
  }

  observarEvtSalvar(curso: CursoI): void {
    this.operacaoPendente = true

    this.servicoCurso
      .atualizarCurso(curso)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.operacaoPendente = false)),
        catchError((e) => {
          this.tituloErro = 'Erro ao atualizar curso'
          this.mensagemErro = e.message
          this.mostrarDialog = true

          return EMPTY
        })
      )
      .subscribe((curso: CursoI) => {
        this.servicoMensagem.add({
          severity: 'success',
          summary: `Curso atualizado com sucesso`,
          detail: curso.nome,
        })

        this.roteador.navigate(['cursos'])
      })
  }

  observarEvtLimpar(): void {}
}
