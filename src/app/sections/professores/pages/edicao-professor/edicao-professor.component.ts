import { ProfessorService } from './../../services/professor.service'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'

import { catchError, EMPTY, finalize, Observable, Subject, switchMap, takeUntil } from 'rxjs'

import { MenuItem, MessageService } from 'primeng/api'
import { ActivatedRoute, Router } from '@angular/router'

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component'
import { DialogComponent } from '../../../../shared/dialogs/dialog/dialog.component'
import { LoaderComponent } from '../../../../shared/loader/loader.component'
import { FormularioProfessorComponent } from '../../components/formulario-professor/formulario-professor.component'
import { ProfessorI } from '../../interfaces/professor.interface'

@Component({
  selector: 'pa-edicao-professor',
  imports: [CommonModule, BreadcrumbComponent, FormularioProfessorComponent, DialogComponent, LoaderComponent],
  templateUrl: './edicao-professor.component.html',
})
export class EdicaoProfessorComponent {
  private servicoMensagem: MessageService = inject(MessageService)
  private roteador = inject(Router)
  private rotaAtiva = inject(ActivatedRoute)
  private servicoProfessor = inject(ProfessorService)
  private destroy$ = new Subject<void>()

  professor$!: Observable<ProfessorI>
  professorId!: number
  estaCarregando = true
  operacaoPendente = false
  mostrarDialog = false
  items: MenuItem[] = []
  tituloErro = ''
  mensagemErro = ''

  constructor() {
    this.definirBreadcrumb()
  }

  ngOnInit(): void {
    this.carregarProfessor()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  definirBreadcrumb(): void {
    this.items = [
      { icon: 'pi pi-home', route: '/' },
      { icon: '', label: 'Professores', route: '/professores' },
    ]
  }

  carregarProfessor(): void {
    this.professor$ = this.rotaAtiva.paramMap.pipe(
      switchMap((params) => {
        this.professorId = Number(params.get('professorId'))

        return this.servicoProfessor.obterProfessorPorId(this.professorId).pipe(
          catchError((e) => {
            this.tituloErro = 'Erro ao carregar professor'
            this.mensagemErro = e.message
            this.mostrarDialog = true

            return EMPTY
          })
        )
      })
    )
  }

  aoClicarSalvar(professor: ProfessorI): void {
    if (this.operacaoPendente) return

    this.operacaoPendente = true

    this.servicoProfessor
      .atualizarProfessor(professor)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.operacaoPendente = false)),
        catchError((e) => {
          this.tituloErro = 'Erro ao atualizar professor'
          this.mensagemErro = e.message
          this.mostrarDialog = true

          return EMPTY
        })
      )
      .subscribe((professor: ProfessorI) => {
        this.servicoMensagem.add({
          severity: 'success',
          summary: `Professor atualizado com sucesso`,
        })

        this.roteador.navigate(['/professores'])
      })
  }
}
