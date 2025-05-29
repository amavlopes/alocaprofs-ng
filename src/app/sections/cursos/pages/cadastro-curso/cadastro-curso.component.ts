import { Component, OnInit, viewChild, OnDestroy, inject } from '@angular/core'
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { CommonModule } from '@angular/common'
import {
  catchError,
  debounceTime,
  EMPTY,
  filter,
  finalize,
  fromEvent,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs'

import { InputTextModule } from 'primeng/inputtext'
import { TextareaModule } from 'primeng/textarea'
import { Button, ButtonModule } from 'primeng/button'
import { MessageModule } from 'primeng/message'
import { DialogModule } from 'primeng/dialog'

import { CursoService } from '../../services/curso.service'
import { CursoI } from '../../interfaces/response/curso.interface'

@Component({
  selector: 'pa-cadastro-curso',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    MessageModule,
    DialogModule,
  ],
  templateUrl: './cadastro-curso.component.html',
  styleUrl: './cadastro-curso.component.css',
})
export class CadastroCursoComponent implements OnInit, OnDestroy {
  private construtorFormulario = inject(FormBuilder)
  private servicoCurso = inject(CursoService)
  private destroy$ = new Subject<void>()

  loading = false
  formularioSubmetido = false
  minLength = 6
  maxLength = 120
  mostrarDialog = false
  mensagemErro = ''
  inscricoes: Subscription = new Subscription()
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

  get nome(): FormControl {
    return this.formulario.get('nome') as FormControl
  }

  get descricao(): FormControl {
    return this.formulario.get('descricao') as FormControl
  }

  ngOnInit(): void {
    this.tratarEventoSalvar()
    this.tratarEventoLimpar()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  tratarEventoSalvar(): void {
    fromEvent(this.botaoSalvar()?.el.nativeElement, 'click')
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100),
        tap(() => this.formulario.markAllAsTouched()),
        filter(() => this.formulario.valid),
        switchMap(() => {
          this.loading = true

          return this.servicoCurso.criar({ nome: this.nome.value }).pipe(
            finalize(() => (this.loading = false)),
            catchError((e) => {
              this.mensagemErro = e.message
              this.mostrarDialog = true

              return EMPTY
            })
          )
        })
      )
      .subscribe((curso: CursoI) => {
        // TO DO: Redirecionar para lista de cursos e abrir toast de sucesso
        console.log('Sucesso: ', curso)
      })
  }

  tratarEventoLimpar(): void {
    fromEvent(this.botaoLimpar()?.el.nativeElement, 'click')
      .pipe(takeUntil(this.destroy$), debounceTime(100))
      .subscribe(() => this.limparFormulario())
  }

  limparFormulario(): void {
    this.formulario.reset()
  }
}
