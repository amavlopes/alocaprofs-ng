import { CommonModule } from '@angular/common'
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'

import { catchError, debounceTime, EMPTY, filter, finalize, forkJoin, Observable, Subject, takeUntil, tap } from 'rxjs'

import { ButtonModule } from 'primeng/button'

import { DialogComponent } from '../../../../shared/dialogs/dialog/dialog.component'
import { MensagemValidacaoComponent } from '../../../../shared/formulario/mensagem-validacao/mensagem-validacao.component'
import { SelectComponent } from '../../../../shared/formulario/select/select.component'
import { ProfessorService } from '../../../professores/services/professor.service'
import { CursoService } from '../../../cursos/services/curso.service'
import { FormularioAlocacaoI } from './interfaces/formulario-alocacao.interface'
import { AlocacaoI } from '../../interfaces/alocacao.interface'
import { ProfessorI } from '../../../professores/interfaces/professor.interface'
import { CursoI } from '../../../cursos/interfaces/curso.interface'
import { DiaSemanaI } from '../../interfaces/dia-semana.interface'
import { DiaSemana } from '../../models/dia-semana'
import { InputTimeComponent } from '../../../../shared/formulario/input-time/input-time.component'

@Component({
  selector: 'pa-formulario-alocacao',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectComponent,
    ButtonModule,
    DialogComponent,
    MensagemValidacaoComponent,
    InputTimeComponent,
  ],
  templateUrl: './formulario-alocacao.component.html',
})
export class FormularioAlocacaoComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder)
  private servicoCurso = inject(CursoService)
  private servicoProfessor = inject(ProfessorService)
  private salvar$ = new Subject<void>()
  private destroy$ = new Subject<void>()

  carregandoCursos = true
  carregandoProfessores = true
  mostrarDialog = false
  tituloErro = 'Erro ao obter alocações'
  mensagemErro = ''
  dias: DiaSemanaI[] = DiaSemana.carregar()
  cursos!: CursoI[]
  professores!: ProfessorI[]
  formulario: FormGroup<FormularioAlocacaoI> = this.fb.group({
    idAlocacao: this.fb.control(''),
    diaSemana: this.fb.control('', [Validators.required]),
    horarioInicial: this.fb.control('', [Validators.required]),
    horarioFinal: this.fb.control('', [Validators.required]),
    idCurso: this.fb.control('', [Validators.required]),
    idProfessor: this.fb.control('', [Validators.required]),
  })

  @Input({ required: true }) id!: string
  @Input({ required: true }) operacaoPendente = false
  @Input() alocacao!: AlocacaoI
  @Output() evtSalvar = new EventEmitter<AlocacaoI>()
  @Output() evtLimpar = new EventEmitter<void>()

  get idAlocacao(): FormControl {
    return this.formulario.get('idAlocacao') as FormControl
  }

  get diaSemana(): FormControl {
    return this.formulario.get('diaSemana') as FormControl
  }

  get horarioInicial(): FormControl {
    return this.formulario.get('horarioInicial') as FormControl
  }

  get horarioFinal(): FormControl {
    return this.formulario.get('horarioFinal') as FormControl
  }

  get idCurso(): FormControl {
    return this.formulario.get('idCurso') as FormControl
  }

  get idProfessor(): FormControl {
    return this.formulario.get('idProfessor') as FormControl
  }

  ngOnInit(): void {
    this.carregarFiltros()
    this.carregarFormulario()

    this.observarEvtSalvar()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  obterCursosHttp$(): Observable<CursoI[]> {
    return this.servicoCurso.obterCursos().pipe(
      finalize(() => (this.carregandoCursos = false)),
      catchError((e) => {
        this.tituloErro = 'Erro ao obter cursos'
        this.mensagemErro = e.message
        this.mostrarDialog = true

        return EMPTY
      }),
      takeUntil(this.destroy$)
    )
  }

  obterProfessoresHttp$(): Observable<ProfessorI[]> {
    return this.servicoProfessor.obterProfessores().pipe(
      finalize(() => (this.carregandoProfessores = false)),
      catchError((e) => {
        this.tituloErro = 'Erro ao obter professores'
        this.mensagemErro = e.message
        this.mostrarDialog = true

        return EMPTY
      }),
      takeUntil(this.destroy$)
    )
  }

  carregarFiltros() {
    forkJoin({
      cursos: this.obterCursosHttp$(),
      professores: this.obterProfessoresHttp$(),
    }).subscribe(({ cursos, professores }: { cursos: CursoI[]; professores: ProfessorI[] }) => {
      this.cursos = cursos
      this.professores = professores
    })
  }

  carregarFormulario(): void {
    if (!this.alocacao) return

    this.idAlocacao.setValue(this.alocacao.id)
    this.diaSemana.setValue(this.alocacao.diaSemana)
    this.horarioInicial.setValue(this.alocacao.horarioInicial)
    this.horarioFinal.setValue(this.alocacao.horarioFinal)
    this.idCurso.setValue(this.alocacao.idCurso)
    this.idProfessor.setValue(this.alocacao.idProfessor)
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
        const professor: AlocacaoI = {
          id: Number(this.idAlocacao.value),
          diaSemana: Number(this.diaSemana.value),
          horarioInicial: this.horarioInicial.value,
          horarioFinal: this.horarioFinal.value,
          idCurso: this.idCurso.value,
          idProfessor: this.idProfessor.value,
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
