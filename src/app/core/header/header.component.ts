import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { RouterModule } from '@angular/router'

import { MenuItem } from 'primeng/api'
import { MenubarModule } from 'primeng/menubar'

@Component({
  selector: 'pa-header',
  imports: [CommonModule, RouterModule, MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined

  ngOnInit(): void {
    this.items = [
      {
        label: 'Cursos',
        icon: 'pi pi-book',
        route: '/cursos',
      },
      {
        label: 'Departamentos',
        icon: 'pi pi-sitemap',
        route: '/departamentos',
      },
      {
        label: 'Professores',
        icon: 'pi pi-user-edit',
        route: '/professores',
      },
      {
        label: 'Alocações',
        icon: 'pi pi-calendar-clock',
        route: '/alocacoes',
      },
    ]
  }
}
