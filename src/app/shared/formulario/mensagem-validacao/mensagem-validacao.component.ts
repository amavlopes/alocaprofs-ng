import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'

@Component({
  selector: 'pa-mensagem-validacao',
  imports: [CommonModule],
  templateUrl: './mensagem-validacao.component.html',
  styleUrl: './mensagem-validacao.component.css',
})
export class MensagemValidacaoComponent {
  @Input({ required: true }) id!: string
  @Input({ required: true }) mensagem!: string
  @Input() tipo: 'normal' | 'erro' | 'sucesso' | 'info' = 'normal'
}
