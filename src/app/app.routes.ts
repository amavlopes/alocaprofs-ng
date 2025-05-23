import { Routes } from '@angular/router'

import { CadastroCursoComponent } from './pages/cursos/cadastro-curso/cadastro-curso.component'

export const routes: Routes = [
  {
    path: 'cursos',
    children: [
      {
        path: 'cadastro',
        title: 'Cursos - Cadastro',
        loadComponent: () =>
          import('./pages/cursos/cadastro-curso/cadastro-curso.component').then(
            (m) => m.CadastroCursoComponent
          ),
      },
    ],
  },
]
