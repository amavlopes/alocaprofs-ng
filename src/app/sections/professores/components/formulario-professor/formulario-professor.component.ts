import { DepartamentoService } from './../../../departamentos/services/departamento.service'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, inject, Input, OnInit, Output, OnDestroy } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'

import { catchError, debounceTime, EMPTY, filter, finalize, Subject, takeUntil, tap } from 'rxjs'

import { ButtonModule } from 'primeng/button'

import { InputTextComponent } from '../../../../shared/formulario/input-text/input-text.component'
import { SelectComponent } from '../../../../shared/formulario/select/select.component'
import { FormularioProfessorI } from './interfaces/formulario-professor.interface'
import { ProfessorI } from '../../interfaces/professor.interface'
import { DepartamentoI } from '../../../departamentos/interfaces/departamento.interface'
import { DialogComponent } from '../../../../shared/dialogs/dialog/dialog.component'
import { MensagemValidacaoComponent } from '../../../../shared/formulario/mensagem-validacao/mensagem-validacao.component'

@Component({
  selector: 'pa-formulario-professor',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextComponent,
    SelectComponent,
    ButtonModule,
    DialogComponent,
    MensagemValidacaoComponent
  ],
  templateUrl: './formulario-professor.component.html'
})
export class FormularioProfessorComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder)
  private servicoDepartamento = inject(DepartamentoService)
  private salvar$ = new Subject<void>()
  private destroy$ = new Subject<void>()

  minLength = 2
  maxLength = 80
  carregando = true
  mostrarDialog = false
  tituloErro = 'Erro ao obter departamentos'
  mensagemErro = ''
  departamentos!: DepartamentoI[]
  formulario: FormGroup<FormularioProfessorI> = this.fb.group({
    idProfessor: this.fb.control(''),
    nome: this.fb.control('', [
      Validators.required,
      Validators.minLength(this.minLength),
      Validators.maxLength(this.maxLength)
    ]),
    cpf: this.fb.control('', [Validators.required]),
    idDepartamento: this.fb.control('', [Validators.required])
  })

  @Input({ required: true }) id!: string
  @Input({ required: true }) operacaoPendente = false
  @Input() professor!: ProfessorI
  @Output() evtSalvar = new EventEmitter<ProfessorI>()
  @Output() evtLimpar = new EventEmitter<void>()

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
    this.carregarDepartamentos()
    this.carregarFormulario()

    this.observarEvtSalvar()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  carregarDepartamentos() {
    this.servicoDepartamento
      .obterDepartamentos()
      .pipe(
        finalize(() => (this.carregando = false)),
        catchError((e: Error) => {
          this.mensagemErro = e.message
          this.mostrarDialog = true

          return EMPTY
        })
      )
      .subscribe((departamentos: DepartamentoI[]) => {
        this.departamentos = departamentos
      })
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
          id: Number(this.idProfessor.value),
          nome: this.nome.value,
          cpf: this.cpf.value,
          idDepartamento: Number(this.idDepartamento.value)
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
