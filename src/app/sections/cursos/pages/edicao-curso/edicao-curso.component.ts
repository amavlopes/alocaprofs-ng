import { CommonModule } from '@angular/common'
import { Component, inject, viewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { catchError, debounceTime, EMPTY, filter, finalize, fromEvent, Subject, switchMap, takeUntil, tap } from 'rxjs'

import { Button, ButtonModule } from 'primeng/button'
import { MessageService } from 'primeng/api'

import { CursoService } from '../../services/curso.service'
import { CursoI } from '../../interfaces/curso.interface'
import { DialogComponent } from '../../../../shared/dialog/dialog.component'
import { TextareaComponent } from '../../../../shared/textarea/textarea.component'
import { InputTextComponent } from '../../../../shared/input-text/input-text.component'

@Component({
  selector: 'pa-edicao-curso',
  imports: [CommonModule, ReactiveFormsModule, InputTextComponent, TextareaComponent, ButtonModule, DialogComponent],
  templateUrl: './edicao-curso.component.html',
  styleUrl: './edicao-curso.component.css',
})
export class EdicaoCursoComponent {
  private servicoMensagem: MessageService = inject(MessageService)
  private construtorFormulario = inject(FormBuilder)
  private roteador = inject(Router)
  private rotaAtiva = inject(ActivatedRoute)
  private servicoCurso = inject(CursoService)
  private destroy$ = new Subject<void>()

  cursoId!: number
  salvandoCurso = false
  carregandoPagina = false
  minLength = 6
  maxLength = 120
  mostrarDialog = false
  tituloErro = ''
  mensagemErro = ''
  botaoSalvar = viewChild<Button>('botaoSalvar')
  botaoLimpar = viewChild<Button>('botaoLimpar')
  formulario: FormGroup = this.construtorFormulario.group(
    {
      id: null,
      nome: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      descricao: [''],
    },
    {
      updateOn: 'blur',
    }
  )
  validacoes = [
    {
      tipo: 'required',
      mensagem: 'O campo nome é obrigatório',
    },
    {
      tipo: 'minlength',
      mensagem: `O campo nome deve ter no mínimo ${this.minLength} caracteres`,
    },
    {
      tipo: 'maxlength',
      mensagem: `O campo nome deve ter no máximo ${this.maxLength} caracteres`,
    },
  ]

  get id(): FormControl {
    return this.formulario.get('id') as FormControl
  }

  get nome(): FormControl {
    return this.formulario.get('nome') as FormControl
  }

  get descricao(): FormControl {
    return this.formulario.get('descricao') as FormControl
  }

  ngOnInit(): void {
    this.carregarCurso()

    this.observarEvtSalvar()
    this.observarEvtLimpar()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  carregarCurso(): void {
    this.carregandoPagina = true

    this.rotaAtiva.paramMap
      .pipe(
        switchMap((params) => {
          this.cursoId = Number(params.get('cursoId'))
          return this.servicoCurso.obterCursoPorId(this.cursoId).pipe(
            finalize(() => (this.carregandoPagina = false)),
            catchError((e) => {
              this.tituloErro = 'Erro ao carregar curso'
              this.mensagemErro = e.message
              this.mostrarDialog = true

              return EMPTY
            })
          )
        })
      )
      .subscribe((curso: CursoI) => {
        this.id.setValue(curso?.id)
        this.nome.setValue(curso?.nome)
      })
  }

  observarEvtSalvar(): void {
    fromEvent(this.botaoSalvar()?.el.nativeElement, 'click')
      .pipe(
        debounceTime(100),
        tap(() => this.formulario.markAllAsTouched()),
        filter(() => this.formulario.valid),
        switchMap(() => {
          this.salvandoCurso = true

          return this.servicoCurso.atualizarCurso({ id: this.id.value, nome: this.nome.value }).pipe(
            finalize(() => (this.salvandoCurso = false)),
            catchError((e) => {
              this.mensagemErro = e.message
              this.mostrarDialog = true

              return EMPTY
            })
          )
        }),
        takeUntil(this.destroy$)
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

  observarEvtLimpar(): void {
    fromEvent(this.botaoLimpar()?.el.nativeElement, 'click')
      .pipe(takeUntil(this.destroy$), debounceTime(100))
      .subscribe(() => this.limparFormulario())
  }

  limparFormulario(): void {
    this.formulario.reset()
  }
}
