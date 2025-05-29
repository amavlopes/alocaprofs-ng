import { Component, OnInit, viewChild, OnDestroy, inject } from '@angular/core'
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { catchError, debounceTime, EMPTY, fromEvent, Subscription, switchMap } from 'rxjs'

import { InputTextModule } from 'primeng/inputtext'
import { TextareaModule } from 'primeng/textarea'
import { Button, ButtonModule } from 'primeng/button'

import { CursoI } from '../../interfaces/response/curso.interface'
import { CursoService } from '../../services/curso.service'

@Component({
  selector: 'pa-cadastro-curso',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, TextareaModule, ButtonModule],
  templateUrl: './cadastro-curso.component.html',
  styleUrl: './cadastro-curso.component.css',
})
export class CadastroCursoComponent implements OnInit, OnDestroy {
  private construtorFormulario = inject(FormBuilder)
  private servicoCurso = inject(CursoService)

  minLength = 6
  maxLength = 100
  inscricao: Subscription = new Subscription()
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
    this.tratarEventoSalvar()
    this.tratarEventoLimpar()
  }

  ngOnDestroy(): void {
    this.inscricao.unsubscribe()
  }

  tratarEventoSalvar(): void {
    this.inscricao.add(
      fromEvent(this.botaoSalvar()?.el.nativeElement, 'click')
        .pipe(
          debounceTime(300),
          switchMap(() =>
            this.servicoCurso.criar({ nome: this.nome.value }).pipe(
              catchError((e) => {
                // TO DO: Abrir modal com mensagem de erro
                return EMPTY
              })
            )
          )
        )
        .subscribe((curso: CursoI) => {
          // TO DO: Redirecionar para lista de cursos e abrir toast de sucesso
        })
    )
  }

  tratarEventoLimpar(): void {
    this.inscricao.add(
      fromEvent(this.botaoLimpar()?.el.nativeElement, 'click')
        .pipe(debounceTime(100))
        .subscribe(() => this.formulario.reset())
    )
  }
}
