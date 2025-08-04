import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'

import { LazyLoadEvent } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { TableModule } from 'primeng/table'

import { Coluna } from './interfaces/coluna.interface'

@Component({
  selector: 'pa-tabela',
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './tabela.component.html',
  styleUrl: './tabela.component.css'
})
export class TabelaComponent {
  @Input({ required: true }) id!: string
  @Input({ required: true }) items!: unknown[]
  @Input({ required: true }) colunas!: Coluna[]
  @Input() linhasExpansiveis = false
  @Input() indiceRegistro: undefined | number = 0
  @Input() registrosPorPagina: undefined | number = 10

  @Output() aoClicarEmEditar = new EventEmitter<unknown>()
  @Output() aoClicarEmExcluir = new EventEmitter<unknown>()
  @Output() indiceRegistroChange = new EventEmitter<number>()

  editar(item: unknown): void {
    this.aoClicarEmEditar.emit(item)
  }

  excluir(item: unknown): void {
    this.aoClicarEmExcluir.emit(item)
  }

  aoMudarDePagina(event: LazyLoadEvent) {
    this.indiceRegistro = event.first
    this.registrosPorPagina = event.rows

    this.indiceRegistroChange.emit(this.indiceRegistro)
  }
}
