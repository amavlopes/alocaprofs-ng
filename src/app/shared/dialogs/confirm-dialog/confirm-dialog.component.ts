import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'

import { ButtonModule } from 'primeng/button'
import { ConfirmDialogModule } from 'primeng/confirmdialog'

@Component({
  selector: 'pa-confirm-dialog',
  imports: [CommonModule, ConfirmDialogModule, ButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {
  @Input() id!: string
}
