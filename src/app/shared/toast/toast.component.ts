import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'

import { ToastModule } from 'primeng/toast'

@Component({
  selector: 'pa-toast',
  imports: [CommonModule, ToastModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  @Input() posicao: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' =
    'bottom-center'
}
