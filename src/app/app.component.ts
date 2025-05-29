import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { PrimeNG } from 'primeng/config'

import { ToastComponent } from './core/toast/toast.component'
import { HeaderComponent } from './core/header/header.component'

@Component({
  selector: 'pa-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private primeng: PrimeNG) {}

  ngOnInit() {
    this.primeng.ripple.set(true)
  }
}
