import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'

@Component({
  selector: 'pa-nenhum-resultado',
  imports: [CommonModule],
  templateUrl: './nenhum-resultado.component.html',
  styleUrl: './nenhum-resultado.component.css',
})
export class NenhumResultadoComponent {
  @Input({ required: true }) id!: string
  @Input() titulo = 'Nenhum resultado encontrado'
  @Input() subtitulo = ''
}
