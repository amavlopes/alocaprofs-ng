import { Component, Input } from '@angular/core'

import { DialogModule } from 'primeng/dialog'

@Component({
  selector: 'pa-dialog',
  imports: [DialogModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  @Input({ required: true }) id!: string
  @Input({ required: true }) tituloErro!: string
  @Input({ required: true }) mensagemErro!: string
  @Input() mostrarDialog = false
  @Input() largura = '20rem'
}
