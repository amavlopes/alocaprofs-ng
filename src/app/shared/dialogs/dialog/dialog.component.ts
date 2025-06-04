import { Component, Input } from '@angular/core'

import { DialogModule } from 'primeng/dialog'
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe.ts.pipe'

@Component({
  selector: 'pa-dialog',
  imports: [DialogModule, SafeHtmlPipe],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  @Input({ required: true }) id!: string
  @Input({ required: true }) tituloErro!: string
  @Input({ required: true }) mensagemErro!: string
  @Input() mostrarDialog = false
  @Input() largura = '25rem'
}
