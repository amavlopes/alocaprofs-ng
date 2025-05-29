import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: 'cursos',
    children: [
      {
        path: 'cadastro',
        title: 'Cursos - Cadastro',
        loadComponent: () =>
          import('./sections/cursos/pages/cadastro-curso/cadastro-curso.component').then(
            (m) => m.CadastroCursoComponent
          ),
      },
    ],
  },
]
