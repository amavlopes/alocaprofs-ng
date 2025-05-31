import { CommonModule } from '@angular/common'
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'

import { ButtonModule } from 'primeng/button'

import { InputTextComponent } from '../../../../shared/input-text/input-text.component'
import { TextareaComponent } from '../../../../shared/textarea/textarea.component'
import { debounceTime, filter, Subject, takeUntil, tap } from 'rxjs'
import { DepartamentoI } from '../../interfaces/departamento.interface'
import { FormularioDepartamentoI } from './interfaces/formulario-departamento.interface'

@Component({
  selector: 'pa-formulario-departamento',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextComponent, TextareaComponent, ButtonModule],
  templateUrl: './formulario-departamento.component.html',
})
export class FormularioDepartamentoComponent implements OnInit {
  private fb = inject(FormBuilder)
  private salvar$ = new Subject<void>()
  private destroy$ = new Subject<void>()

  minLength = 2
  maxLength = 120
  formulario: FormGroup<FormularioDepartamentoI> = this.fb.group({
    idDepartamento: this.fb.control(''),
    nome: this.fb.control('', [
      Validators.required,
      Validators.minLength(this.minLength),
      Validators.maxLength(this.maxLength),
    ]),
    descricao: this.fb.control(''),
  })

  @Input() id!: string
  @Input() operacaoPendente: boolean = false
  @Input() departamento!: DepartamentoI
  @Output() evtSalvar: EventEmitter<DepartamentoI> = new EventEmitter()
  @Output() evtLimpar: EventEmitter<void> = new EventEmitter()

  get idDepartamento(): FormControl {
    return this.formulario.get('idDepartamento') as FormControl
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
    if (!this.departamento) return

    this.idDepartamento.setValue(this.departamento.id)
    this.nome.setValue(this.departamento.nome)
    this.descricao.setValue(this.departamento.descricao)
  }

  observarEvtSalvar(): void {
    this.salvar$
      .pipe(
        debounceTime(500),
        takeUntil(this.destroy$),
        filter(() => !this.operacaoPendente),
        tap(() => this.formulario.markAllAsTouched()),
        filter(() => this.formulario.valid)
      )
      .subscribe(() => {
        const departamento: DepartamentoI = {
          id: this.idDepartamento.value,
          nome: this.nome.value,
          descricao: this.descricao.value,
        }

        this.evtSalvar.emit(departamento)
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
