import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'

import { FluidModule } from 'primeng/fluid'

@Component({
  selector: 'pa-filtro-tabela-container',
  imports: [CommonModule, FluidModule],
  templateUrl: './filtro-tabela-container.component.html',
  styleUrl: './filtro-tabela-container.component.css',
})
export class FiltroTabelaContainerComponent {}
