import { Component, OnInit, viewChild, OnDestroy } from '@angular/core'
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { CommonModule } from '@angular/common'

import { debounceTime, fromEvent, Observable, of, Subscription, switchMap } from 'rxjs'

import { InputTextModule } from 'primeng/inputtext'
import { TextareaModule } from 'primeng/textarea'
import { Button, ButtonModule } from 'primeng/button'

@Component({
  selector: 'pa-cadastro-curso',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, TextareaModule, ButtonModule],
  templateUrl: './cadastro-curso.component.html',
  styleUrl: './cadastro-curso.component.css',
})
export class CadastroCursoComponent implements OnInit, OnDestroy {
  minLength = 6
  maxLength = 100
  formulario: FormGroup
  inscricao: Subscription = new Subscription()
  botaoSalvar = viewChild<Button>('botaoSalvar')
  botaoLimpar = viewChild<Button>('botaoLimpar')

  constructor(private construtorFormulario: FormBuilder) {
    this.formulario = this.construtorFormulario.group(
      {
        nome: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
        descricao: [''],
      },
      {
        updateOn: 'blur',
      }
    )
  }

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
          debounceTime(150),
          switchMap(() => this.cadastrarCurso())
        )
        .subscribe(() => {})
    )
  }

  tratarEventoLimpar(): void {
    this.inscricao.add(
      fromEvent(this.botaoLimpar()?.el.nativeElement, 'click')
        .pipe(debounceTime(150))
        .subscribe(() => this.limparFormulario())
    )
  }

  cadastrarCurso(): Observable<unknown> {
    return of('RETORNO API')
  }

  limparFormulario(): void {
    this.formulario.reset()
  }
}
