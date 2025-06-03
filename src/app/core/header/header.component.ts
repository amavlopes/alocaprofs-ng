import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { Router, RouterModule } from '@angular/router'

import { MenuItem } from 'primeng/api'
import { MenubarModule } from 'primeng/menubar'

import { LogoComponent } from '../logo/logo.component'

@Component({
  selector: 'pa-header',
  imports: [CommonModule, RouterModule, LogoComponent, MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private roteador: Router = inject(Router)

  items: MenuItem[] | undefined

  ngOnInit(): void {
    this.items = [
      {
        label: 'Cursos',
        icon: 'pi pi-book',
        routerLink: '/cursos',
      },
      {
        label: 'Departamentos',
        icon: 'pi pi-sitemap',
        routerLink: '/departamentos',
      },
      {
        label: 'Professores',
        icon: 'pi pi-user-edit',
        routerLink: '/professores',
      },
      {
        label: 'Alocações',
        icon: 'pi pi-calendar-clock',
        routerLink: '/alocacoes',
      },
    ]
  }
}
