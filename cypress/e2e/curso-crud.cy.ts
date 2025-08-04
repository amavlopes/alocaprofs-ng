import { CursoResponseI } from '../../src/app/sections/cursos/interfaces/response/curso-response.interface'

describe('Cadastro de Curso', () => {
  const apiUrlEnv = Cypress.env('apiUrl')
  const apiUrl = `${apiUrlEnv}/courses`

  const campoNome = '#cadastro_curso_formulario_nome_input'
  const campoDescricao = '#cadastro_curso_formulario_descricao_textarea'
  const botaoSalvar = '#cadastro_curso_formulario_botao_salvar'
  const botaoLimpar = '#cadastro_curso_formulario_botao_limpar'
  const validacaoNome = '#cadastro_curso_formulario_validacao_nome_required'

  let nomeCurso: string
  let descricaoCurso: string

  beforeEach(() => {
    cy.visit('/cursos/cadastro')
  })

  afterEach(() => {
    cy.request('GET', apiUrl).then((res) => {
      const cursos = res.body.courses.filter((c: CursoResponseI) => c.name === nomeCurso)
      cursos.forEach((c: CursoResponseI) => {
        cy.request('DELETE', `${apiUrl}/${c.id}`)
      })
    })
  })

  it('deve cadastrar um curso com sucesso', () => {
    criarCurso()

    cy.get(campoNome).should('exist').type(nomeCurso)
    cy.get(campoDescricao).should('exist').type(descricaoCurso)
    cy.get(botaoSalvar).should('be.visible').click()

    cy.url().should('include', '/cursos')

    cy.contains('Curso cadastrado com sucesso').should('be.visible')

    cy.contains(nomeCurso).should('be.visible')
  })

  it('deve validar erro ao tentar salvar sem preencher o nome', () => {
    cy.get(botaoSalvar).click()

    cy.get(validacaoNome).should('be.visible').and('contain', 'O campo nome é obrigatório')

    cy.url().should('include', '/cursos/cadastro')
  })

  it('deve limpar os campos do formulário ao clicar no botão Limpar', () => {
    criarCurso()

    cy.get(campoNome).should('exist').type(nomeCurso).should('have.value', nomeCurso)
    cy.get(campoDescricao).should('exist').type(descricaoCurso).should('have.value', descricaoCurso)
    cy.get(botaoLimpar).should('exist').click()

    cy.get(campoNome).should('have.value', '')
    cy.get(campoDescricao).should('have.value', '')
  })

  function criarCurso() {
    nomeCurso = `Curso Cypress ${Date.now()}`
    descricaoCurso = 'Curso criado no teste automatizado'
  }
})
