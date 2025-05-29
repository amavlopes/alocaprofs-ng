import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'

import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'pa-pagina-nao-encontrada',
  imports: [CommonModule, ButtonModule],
  templateUrl: './pagina-nao-encontrada.component.html',
  styleUrl: './pagina-nao-encontrada.component.css',
})
export class PaginaNaoEncontradaComponent {
  private roteador: Router = inject(Router)

  voltarAoInicio() {
    this.roteador.navigate(['/inicio'])
  }
}
