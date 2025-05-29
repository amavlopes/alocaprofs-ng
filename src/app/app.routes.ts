import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: 'cursos',
    children: [
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full',
      },
      {
        path: 'lista',
        title: 'Cursos - Todos os Cursos',
        loadComponent: () =>
          import('./sections/cursos/pages/lista-curso/lista-curso.component').then((m) => m.ListaCursoComponent),
      },
      {
        path: 'cadastro',
        title: 'Cursos - Cadastrar Curso',
        loadComponent: () =>
          import('./sections/cursos/pages/cadastro-curso/cadastro-curso.component').then(
            (m) => m.CadastroCursoComponent
          ),
      },
    ],
  },
]
