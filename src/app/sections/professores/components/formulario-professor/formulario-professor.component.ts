import { CommonModule } from '@angular/common'
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'

import { debounceTime, filter, Subject, takeUntil, tap } from 'rxjs'

import { ButtonModule } from 'primeng/button'

import { InputTextComponent } from '../../../../shared/formulario/input-text/input-text.component'
import { FormularioProfessorI } from './interfaces/formulario-professor.interface'
import { ProfessorI } from '../../interfaces/professor.interface'

@Component({
  selector: 'pa-formulario-professor',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextComponent, ButtonModule],
  templateUrl: './formulario-professor.component.html',
})
export class FormularioProfessorComponent implements OnInit {
  private fb = inject(FormBuilder)
  private salvar$ = new Subject<void>()
  private destroy$ = new Subject<void>()

  minLength = 2
  maxLength = 80
  formulario: FormGroup<FormularioProfessorI> = this.fb.group({
    idProfessor: this.fb.control(''),
    nome: this.fb.control('', [
      Validators.required,
      Validators.minLength(this.minLength),
      Validators.maxLength(this.maxLength),
    ]),
    cpf: this.fb.control('', [Validators.required]),
    idDepartamento: this.fb.control('', [Validators.required]),
  })

  @Input() id!: string
  @Input() operacaoPendente: boolean = false
  @Input() professor!: ProfessorI
  @Output() evtSalvar: EventEmitter<ProfessorI> = new EventEmitter()
  @Output() evtLimpar: EventEmitter<void> = new EventEmitter()

  get idProfessor(): FormControl {
    return this.formulario.get('idProfessor') as FormControl
  }

  get nome(): FormControl {
    return this.formulario.get('nome') as FormControl
  }

  get cpf(): FormControl {
    return this.formulario.get('cpf') as FormControl
  }

  get idDepartamento(): FormControl {
    return this.formulario.get('idDepartamento') as FormControl
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
    if (!this.professor) return

    this.idProfessor.setValue(this.professor.id)
    this.nome.setValue(this.professor.nome)
    this.cpf.setValue(this.professor.cpf)
    this.idDepartamento.setValue(this.professor.idDepartamento)
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
        const professor: ProfessorI = {
          id: this.idProfessor.value,
          nome: this.nome.value,
          cpf: this.cpf.value,
          idDepartamento: Number(this.idDepartamento.value),
        }

        this.evtSalvar.emit(professor)
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
