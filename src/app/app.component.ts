import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { PrimeNG } from 'primeng/config'

@Component({
  selector: 'pa-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Alocação de Professores'

  constructor(private primeng: PrimeNG) {}

  ngOnInit() {
    this.primeng.ripple.set(true)
  }
}
