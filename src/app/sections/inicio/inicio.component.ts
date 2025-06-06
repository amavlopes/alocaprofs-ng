import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

import { CardModule } from 'primeng/card'

import { LogoComponent } from '../../core/logo/logo.component'

@Component({
  selector: 'pa-inicio',
  imports: [CommonModule, LogoComponent, CardModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent {}
