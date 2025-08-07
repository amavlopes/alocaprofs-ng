import { DepartamentoResponseI } from 'src/app/sections/departamentos/interfaces/response/departamento-response.interface'

describe('Cadastro de Departaemento', () => {
  const apiUrlEnv = Cypress.env('apiUrl')
  const apiUrl = `${apiUrlEnv}/departments`

  const campoNome = '#cadastro_departamento_formulario_nome_input'
  const campoDescricao = '#cadastro_departamento_formulario_descricao_textarea'
  const botaoSalvar = '#cadastro_departamento_formulario_botao_salvar'
  const botaoLimpar = '#cadastro_departamento_formulario_botao_limpar'
  const validacaoNome = '#cadastro_departamento_formulario_validacao_nome_required'

  let nomeDepartamento: string
  let descricaoDepartamento: string

  beforeEach(() => {
    cy.visit('/departamentos/cadastro')
  })

  afterEach(() => {
    cy.request('GET', apiUrl).then((res) => {
      const departamentos = res.body.departments.filter((c: DepartamentoResponseI) => c.name === nomeDepartamento)
      departamentos.forEach((c: DepartamentoResponseI) => {
        cy.request('DELETE', `${apiUrl}/${c.id}`)
      })
    })
  })

  it('deve cadastrar um departamento com sucesso', () => {
    criarDepartamento()

    cy.get(campoNome).should('exist').type(nomeDepartamento)
    cy.get(campoDescricao).should('exist').type(descricaoDepartamento)
    cy.get(botaoSalvar).should('be.visible').click()

    cy.url().should('include', '/departamentos')

    cy.contains('Departamento cadastrado com sucesso').should('be.visible')

    cy.contains(nomeDepartamento).should('be.visible')
  })

  it('deve validar erro ao tentar salvar sem preencher o nome', () => {
    cy.get(botaoSalvar).click()

    cy.get(validacaoNome).should('be.visible').and('contain', 'O campo nome é obrigatório')

    cy.url().should('include', '/departamentos/cadastro')
  })

  it('deve limpar os campos do formulário ao clicar no botão Limpar', () => {
    criarDepartamento()

    cy.get(campoNome).should('exist').type(nomeDepartamento).should('have.value', nomeDepartamento)
    cy.get(campoDescricao).should('exist').type(descricaoDepartamento).should('have.value', descricaoDepartamento)
    cy.get(botaoLimpar).should('exist').click()

    cy.get(campoNome).should('have.value', '')
    cy.get(campoDescricao).should('have.value', '')
  })

  function criarDepartamento() {
    nomeDepartamento = `Departamento Cypress ${Date.now()}`
    descricaoDepartamento = 'Departamento criado no teste automatizado'
  }
})
