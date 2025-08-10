import { ProfessorResponseI } from 'src/app/sections/professores/interfaces/response/professor-response.interface'

describe('Cadastro de Professor', () => {
  const apiUrlEnv = Cypress.env('apiUrl')
  const apiUrl = `${apiUrlEnv}/professors`
  const apiUrlDepartments = `${apiUrlEnv}/departments`

  const campoNome = '#cadastro_professor_formulario_nome_input'
  const campoCpf = '#cadastro_professor_formulario_cpf_input'
  const campoDepartamento = '#cadastro_professor_formulario_departamento'

  const botaoSalvar = '#cadastro_professor_formulario_botao_salvar'
  const botaoLimpar = '#cadastro_professor_formulario_botao_limpar'

  const validacaoNome = '#cadastro_professor_formulario_validacao_nome_required'
  const validacaoCpf = '#cadastro_professor_formulario_validacao_cpf_required'
  const validacaoDepartamento = '#cadastro_professor_formulario_validacao_departamento_required'

  let nomeProfessor: string
  let cpfProfessor: string
  let departamentoId: number
  let departamentoNome: string

  beforeEach(() => {
    cy.request('POST', `${apiUrlEnv}/departments`, {
      name: 'Departamento Cypress'
    })
      .its('body.department')
      .then((department) => {
        departamentoId = department.id
        departamentoNome = department.name
      })

    cy.visit('/professores/cadastro')
  })

  afterEach(() => {
    cy.request('GET', apiUrl).then((res) => {
      const professores = res.body.professors.filter((c: ProfessorResponseI) => c.name === nomeProfessor)
      professores.forEach((c: ProfessorResponseI) => {
        cy.request('DELETE', `${apiUrl}/${c.id}`)
      })
    })

    cy.request('DELETE', `${apiUrlDepartments}/${departamentoId}`).then((res) => {
      expect(res.status).to.eq(204)
      cy.log(`Departamento ${departamentoNome} deletado com sucesso`)
    })
  })

  it('deve cadastrar um professor com sucesso', () => {
    criarProfessor()

    cy.get(campoNome).should('exist').type(nomeProfessor)
    cy.get(campoCpf).should('exist').type(cpfProfessor)
    cy.get(campoDepartamento).find('.p-select-dropdown').click({ force: true })
    cy.contains('Departamento Cypress').should('be.visible').click()

    cy.get(botaoSalvar).should('be.visible').click()

    cy.url().should('include', '/professores')
    cy.contains('Professor cadastrado com sucesso').should('be.visible')

    cy.contains(nomeProfessor).should('be.visible')
    cy.contains(cpfProfessor).should('be.visible')
  })

  it('deve validar erro ao tentar salvar sem preencher o nome', () => {
    cy.get(botaoSalvar).click()

    cy.get(validacaoNome).should('be.visible').and('contain', 'O campo nome é obrigatório')
    cy.get(validacaoCpf).should('be.visible').and('contain', 'O campo CPF é obrigatório')
    cy.get(validacaoDepartamento).should('be.visible').and('contain', 'O campo departamento é obrigatório')

    cy.url().should('include', '/professores/cadastro')
  })

  it('deve limpar os campos do formulário ao clicar no botão Limpar', () => {
    criarProfessor()

    cy.get(campoNome).should('exist').type(nomeProfessor).should('have.value', nomeProfessor)
    cy.get(campoCpf).should('exist').type(cpfProfessor).should('have.value', cpfProfessor)
    cy.get(campoDepartamento).find('.p-select-dropdown').click({ force: true })
    cy.contains('Departamento Cypress').should('be.visible').click()
    cy.get(campoDepartamento).find('.p-select-label').should('contain.text', 'Departamento Cypress')

    cy.get(botaoLimpar).should('exist').click()

    cy.get(campoNome).should('have.value', '')
  })

  function criarProfessor() {
    nomeProfessor = `Professor Cypress ${Date.now()}`
    cpfProfessor = '77101484093'
  }
})
