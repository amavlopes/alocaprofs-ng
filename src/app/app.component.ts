import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { PrimeNG } from 'primeng/config'

import { ToastComponent } from './core/toast/toast.component'
import { HeaderComponent } from './core/header/header.component'

@Component({
  selector: 'pa-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private primeng = inject(PrimeNG)

  ngOnInit() {
    this.primeng.ripple.set(true)
  }
}
