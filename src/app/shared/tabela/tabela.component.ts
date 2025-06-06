import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'

import { ButtonModule } from 'primeng/button'
import { TableModule } from 'primeng/table'

import { Coluna } from './interfaces/coluna.interface'

@Component({
  selector: 'pa-tabela',
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './tabela.component.html',
  styleUrl: './tabela.component.css',
})
export class TabelaComponent {
  @Input({ required: true }) id!: string
  @Input({ required: true }) items!: Array<any>
  @Input({ required: true }) colunas!: Coluna[]
  @Input() linhasExpansiveis: boolean = false
  @Input() indiceRegistro = 0
  @Input() registrosPorPagina = 10

  @Output() aoClicarEmEditar = new EventEmitter<any>()
  @Output() aoClicarEmExcluir = new EventEmitter<any>()
  @Output() indiceRegistroChange = new EventEmitter<number>()

  editar(item: any): void {
    this.aoClicarEmEditar.emit(item)
  }

  excluir(item: any): void {
    this.aoClicarEmExcluir.emit(item)
  }

  aoMudarDePagina(event: any) {
    this.indiceRegistro = event.first
    this.registrosPorPagina = event.rows

    this.indiceRegistroChange.emit(this.indiceRegistro)
  }
}
