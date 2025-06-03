import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'

import { ButtonModule } from 'primeng/button'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe.ts.pipe'

@Component({
  selector: 'pa-confirm-dialog',
  imports: [CommonModule, ConfirmDialogModule, ButtonModule, SafeHtmlPipe],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {
  @Input() id!: string
  @Input() largura = '25rem'
}
