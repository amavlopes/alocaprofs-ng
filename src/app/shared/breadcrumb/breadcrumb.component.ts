import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'

import { RouterModule } from '@angular/router'
import { MenuItem } from 'primeng/api'
import { BreadcrumbModule } from 'primeng/breadcrumb'

@Component({
  standalone: true,
  selector: 'pa-breadcrumb',
  imports: [CommonModule, BreadcrumbModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent {
  @Input({ required: true }) items!: MenuItem[]
}
