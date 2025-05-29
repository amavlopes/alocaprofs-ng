import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { PrimeNG } from 'primeng/config'

import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'pa-root',
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private primeng: PrimeNG) {}

  ngOnInit() {
    this.primeng.ripple.set(true)
  }
}
