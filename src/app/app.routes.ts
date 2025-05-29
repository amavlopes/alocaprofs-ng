import { Routes } from '@angular/router'
import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada/pagina-nao-encontrada.component'

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/cursos',
    pathMatch: 'full',
  },
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
        title: 'AlocaProfs - Cursos',
        loadComponent: () =>
          import('./sections/cursos/pages/lista-curso/lista-curso.component').then((m) => m.ListaCursoComponent),
      },
      {
        path: 'cadastro',
        title: 'AlocaProfs - Cadastrar Curso',
        loadComponent: () =>
          import('./sections/cursos/pages/cadastro-curso/cadastro-curso.component').then(
            (m) => m.CadastroCursoComponent
          ),
      },
      {
        path: 'edicao/:cursoId',
        title: 'AlocaProfs - Editar Curso',
        loadComponent: () =>
          import('./sections/cursos/pages/edicao-curso/edicao-curso.component').then((m) => m.EdicaoCursoComponent),
      },
    ],
  },
  { path: '**', component: PaginaNaoEncontradaComponent },
]
