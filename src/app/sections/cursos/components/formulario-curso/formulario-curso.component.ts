import { CommonModule } from '@angular/common'
import { Component, EventEmitter, inject, Input, OnInit, Output, viewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'

import { debounceTime, filter, fromEvent, Subject, takeUntil, tap } from 'rxjs'

import { Button, ButtonModule } from 'primeng/button'

import { InputTextComponent } from '../../../../shared/input-text/input-text.component'
import { TextareaComponent } from '../../../../shared/textarea/textarea.component'
import { CursoI } from '../../interfaces/curso.interface'

@Component({
  selector: 'pa-formulario-curso',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextComponent, TextareaComponent, ButtonModule],
  templateUrl: './formulario-curso.component.html',
  styleUrl: './formulario-curso.component.css',
})
export class FormularioCursoComponent implements OnInit {
  private construtorFormulario = inject(FormBuilder)
  private destroy$ = new Subject<void>()

  carregando: boolean = true
  minLength = 6
  maxLength = 120
  botaoSalvar = viewChild<Button>('botaoSalvar')
  botaoLimpar = viewChild<Button>('botaoLimpar')
  formulario: FormGroup = this.construtorFormulario.group(
    {
      idCurso: [''],
      nome: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      descricao: [''],
    },
    {
      updateOn: 'blur',
    }
  )

  @Input() id!: string
  @Input() loading: boolean = false
  @Input() curso!: CursoI
  @Output() evtSalvar: EventEmitter<CursoI> = new EventEmitter()
  @Output() evtLimpar: EventEmitter<void> = new EventEmitter()

  get idCurso(): FormControl {
    return this.formulario.get('idCurso') as FormControl
  }

  get nome(): FormControl {
    return this.formulario.get('nome') as FormControl
  }

  get descricao(): FormControl {
    return this.formulario.get('descricao') as FormControl
  }

  ngOnInit(): void {
    this.carregarFormulario()

    this.observarEvtSalvar()
    this.observarEvtLimpar()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  carregarFormulario(): void {
    this.idCurso.setValue(this.curso?.id)
    this.nome.setValue(this.curso?.nome)

    this.formulario.updateValueAndValidity()
  }

  observarEvtSalvar(): void {
    fromEvent(this.botaoSalvar()?.el.nativeElement, 'click')
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100),
        tap(() => this.formulario.markAllAsTouched()),
        filter(() => this.formulario.valid),
        tap(() => {
          const curso = { id: this.idCurso.value, nome: this.nome.value }
          this.evtSalvar.emit(curso)
        })
      )
      .subscribe()
  }

  observarEvtLimpar(): void {
    fromEvent(this.botaoLimpar()?.el.nativeElement, 'click')
      .pipe(takeUntil(this.destroy$), debounceTime(100))
      .subscribe(() => {
        this.limparFormulario()
        this.evtLimpar.emit()
      })
  }

  limparFormulario(): void {
    this.formulario.reset()
  }
}
