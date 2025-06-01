import { CommonModule } from '@angular/common'
import { Component, EventEmitter, inject, Input, OnInit, Output, viewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'

import { debounceTime, filter, Subject, takeUntil, tap } from 'rxjs'

import { Button, ButtonModule } from 'primeng/button'

import { InputTextComponent } from '../../../../shared/input-text/input-text.component'
import { TextareaComponent } from '../../../../shared/textarea/textarea.component'
import { CursoI } from '../../interfaces/curso.interface'
import { FormularioCursoI } from './interfaces/formulario-curso.interface'

@Component({
  selector: 'pa-formulario-curso',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextComponent, TextareaComponent, ButtonModule],
  templateUrl: './formulario-curso.component.html',
})
export class FormularioCursoComponent implements OnInit {
  private fb = inject(FormBuilder)
  private salvar$ = new Subject<void>()
  private destroy$ = new Subject<void>()

  minLength = 6
  maxLength = 120
  formulario: FormGroup<FormularioCursoI> = this.fb.group({
    idCurso: this.fb.control(''),
    nome: this.fb.control('', [
      Validators.required,
      Validators.minLength(this.minLength),
      Validators.maxLength(this.maxLength),
    ]),
    descricao: this.fb.control(''),
  })

  @Input() id!: string
  @Input() operacaoPendente: boolean = false
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
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  carregarFormulario(): void {
    if (!this.curso) return

    this.idCurso.setValue(this.curso.id)
    this.nome.setValue(this.curso.nome)
    this.descricao.setValue(this.curso.descricao)

    this.formulario.updateValueAndValidity()
  }

  observarEvtSalvar(): void {
    this.salvar$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        filter(() => !this.operacaoPendente),
        tap(() => this.formulario.markAllAsTouched()),
        filter(() => this.formulario.valid)
      )
      .subscribe(() => {
        const curso: CursoI = {
          id: this.idCurso.value,
          nome: this.nome.value,
          descricao: this.descricao.value,
        }

        this.evtSalvar.emit(curso)
      })
  }

  aoClicarSalvar(): void {
    if (this.operacaoPendente) return

    this.salvar$.next()
  }

  aoClicarLimpar(): void {
    this.formulario.reset()
    this.evtLimpar.emit()
  }
}
