import { AfterViewInit, Component, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'

import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  fromEvent,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
} from 'rxjs'

import { DialogModule } from 'primeng/dialog'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ConfirmationService } from 'primeng/api'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'

import { CursoService } from '../../services/curso.service'
import { CursoI } from '../../interfaces/curso.interface'
import { Router } from '@angular/router'

@Component({
  selector: 'pa-lista-curso',
  imports: [
    CommonModule,
    DialogModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './lista-curso.component.html',
  styleUrl: './lista-curso.component.css',
})
export class ListaCursoComponent implements AfterViewInit, OnDestroy {
  private roteador = inject(Router)
  private servicoCurso = inject(CursoService)
  private destroy$ = new Subject<void>()

  loading = true
  mostrarDialog = false
  tituloErro = 'Erro ao buscar curso'
  mensagemErro = ''
  cursos$!: Observable<CursoI[]>

  @ViewChild('pesquisaPorNome') pesquisaPorNome!: ElementRef

  ngAfterViewInit(): void {
    this.cursos$ = this.observarPesquisaPorNome()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  observarPesquisaPorNome(): Observable<CursoI[]> {
    return fromEvent<any>(this.pesquisaPorNome.nativeElement, 'keyup').pipe(
      map((evento) => evento.target.value),
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((nome) => this.carregarCursos(nome))
    )
  }

  carregarCursos(nome: string = ''): Observable<CursoI[]> {
    return this.servicoCurso.listar(nome).pipe(
      finalize(() => (this.loading = false)),
      catchError((e) => {
        this.mensagemErro = e.message
        this.mostrarDialog = true

        return of([])
      })
    )
  }

  adicionarCurso(): void {
    this.roteador.navigate(['cursos/cadastro'])
  }
}
