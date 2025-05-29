import { Component, OnInit, viewChild, OnDestroy, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { Router } from '@angular/router'

import { catchError, debounceTime, EMPTY, filter, finalize, fromEvent, Subject, switchMap, takeUntil, tap } from 'rxjs'

import { Button, ButtonModule } from 'primeng/button'
import { ToastModule } from 'primeng/toast'

import { CursoService } from '../../services/curso.service'
import { DialogComponent } from '../../../../shared/dialog/dialog.component'
import { CursoI } from '../../interfaces/curso.interface'
import { MessageService } from 'primeng/api'
import { InputTextComponent } from '../../../../shared/input-text/input-text.component'
import { TextareaComponent } from '../../../../shared/textarea/textarea.component'

@Component({
  selector: 'pa-cadastro-curso',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextComponent,
    TextareaComponent,
    ButtonModule,
    DialogComponent,
    ToastModule,
  ],
  templateUrl: './cadastro-curso.component.html',
  styleUrl: './cadastro-curso.component.css',
})
export class CadastroCursoComponent implements OnInit, OnDestroy {
  private servicoMensagem: MessageService = inject(MessageService)
  private construtorFormulario = inject(FormBuilder)
  private roteador = inject(Router)
  private servicoCurso = inject(CursoService)
  private destroy$ = new Subject<void>()

  loading = false
  formularioSubmetido = false
  minLength = 6
  maxLength = 120
  mostrarDialog = false
  tituloErro = 'Erro ao cadastrar curso'
  mensagemErro = ''
  botaoSalvar = viewChild<Button>('botaoSalvar')
  botaoLimpar = viewChild<Button>('botaoLimpar')
  formulario: FormGroup = this.construtorFormulario.group(
    {
      nome: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      descricao: [''],
    },
    {
      updateOn: 'blur',
    }
  )

  get nome(): FormControl {
    return this.formulario.get('nome') as FormControl
  }

  get descricao(): FormControl {
    return this.formulario.get('descricao') as FormControl
  }

  ngOnInit(): void {
    this.observarEvtSalvar()
    this.observarEvtLimpar()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  observarEvtSalvar(): void {
    fromEvent(this.botaoSalvar()?.el.nativeElement, 'click')
      .pipe(
        debounceTime(100),
        tap(() => this.formulario.markAllAsTouched()),
        filter(() => this.formulario.valid),
        switchMap(() => {
          this.loading = true

          return this.servicoCurso.criarCurso({ nome: this.nome.value }).pipe(
            finalize(() => (this.loading = false)),
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
          summary: `Curso cadastrado com sucesso`,
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
