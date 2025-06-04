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
  {
    path: 'departamentos',
    children: [
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full',
      },
      {
        path: 'lista',
        title: 'AlocaProfs - Departamentos',
        loadComponent: () =>
          import('./sections/departamentos/pages/lista-departamento/lista-departamento.component').then(
            (m) => m.ListaDepartamentoComponent
          ),
      },
      {
        path: 'cadastro',
        title: 'AlocaProfs - Cadastrar Departamento',
        loadComponent: () =>
          import('./sections/departamentos/pages/cadastro-departamento/cadastro-departamento.component').then(
            (m) => m.CadastroDepartamentoComponent
          ),
      },
      {
        path: 'edicao/:departamentoId',
        title: 'AlocaProfs - Editar Departamento',
        loadComponent: () =>
          import('./sections/departamentos/pages/edicao-departamento/edicao-departamento.component').then(
            (m) => m.EdicaoDepartamentoComponent
          ),
      },
    ],
  },
  {
    path: 'professores',
    children: [
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full',
      },
      {
        path: 'lista',
        title: 'AlocaProfs - Professores',
        loadComponent: () =>
          import('./sections/professores/pages/lista-professor/lista-professor.component').then(
            (m) => m.ListaProfessorComponent
          ),
      },
      {
        path: 'cadastro',
        title: 'AlocaProfs - Cadastrar Professor',
        loadComponent: () =>
          import('./sections/professores/pages/cadastro-professor/cadastro-professor.component').then(
            (m) => m.CadastroProfessorComponent
          ),
      },
      {
        path: 'edicao/:professorId',
        title: 'AlocaProfs - Editar Professor',
        loadComponent: () =>
          import('./sections/professores/pages/edicao-professor/edicao-professor.component').then(
            (m) => m.EdicaoProfessorComponent
          ),
      },
    ],
  },
  {
    path: 'alocacoes',
    children: [
      {
        path: '',
        redirectTo: 'cadastro',
        pathMatch: 'full',
      },
      {
        path: 'cadastro',
        title: 'AlocaProfs - Cadastrar Alocação',
        loadComponent: () =>
          import('./sections/alocacoes/pages/cadastro-alocacao/cadastro-alocacao.component').then(
            (m) => m.CadastroAlocacaoComponent
          ),
      },
    ],
  },
  { path: '**', component: PaginaNaoEncontradaComponent },
]
