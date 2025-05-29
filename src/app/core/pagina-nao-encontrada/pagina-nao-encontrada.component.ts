import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'

import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'pa-pagina-nao-encontrada',
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './pagina-nao-encontrada.component.html',
  styleUrl: './pagina-nao-encontrada.component.css',
})
export class PaginaNaoEncontradaComponent {}
