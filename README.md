# 🎓 AlocaProfs

### Solução ágil para alocação de professores

Projeto para validar conceitos referente à disciplina de **Arquitetura de Front-End**, lecionada pelo professor Keven Leone da Pós-Graduação de **Engenharia de Software 2024.1** do Centro Universitário Frassinetti do Recife (**UniFAFIRE**).

AlocaProfs é uma aplicação web que simplifica e otimiza o processo de alocação de professores
e organização do quadro de horários.
Com interface amigável e recursos inteligentes, ajuda instituições de ensino a distribuir cargas horárias, evitar conflitos e otimizar a gestão acadêmica de forma ágil e eficiente.

---

## 🚀 Principais funcionalidades:

- ✅ Gestão de **Cursos**.
- ✅ Gestão de **Departamentos**.
- ✅ Gestão de **Professores**.
- ✅ Gestão de **Alocações de Professores**.

---

## 🧱 Tecnologias Utilizadas

- **Angular v19 (CLI v19.2.4)**
- **Typescript**
- **RxJS**
- **HTML**
- **CSS (Tailwind CSS)**
- **Jasmine**

---

## 🔗 Dependência da API

Esta aplicação consome dados de uma API externa. Para que a aplicação funcione corretamente, é necessário que a **API Professor Allocation** esteja em execução.

#### 1. Clone e execute a API

Antes de rodar esta aplicação Angular, siga os passos abaixo para executar a API:

```bash
  git clone https://github.com/amavlopes/professor-allocation-api.git
  cd professor-allocation-api

  # siga as instruções do README da API para configurá-la e executá-la
```

---

## 🏃 Como executar o projeto

#### 1. Clone o projeto:

```bash
  git clone https://github.com/amavlopes/alocaprofs-ng.git
```

#### 2. Entre no diretório do projeto:

```bash
  cd alocaprofs-ng
```

#### 3. Instale todas as dependências:

```bash
  npm install
```

#### 4. Execute a aplicação:

```bash
  npm run start
```

---

## 🧪 Executando testes com Cypress

#### 1. Com interface

##### Após executar a API, execute o comando:

```bash
  npm run cy:open
```

##### Escolha o browser, depois "Start E2E Testing...' e escolha o spec da lista. (exemplo: curso-crud.cy.ts)

#### 2. Em modo headless

##### Execute o comado abaixo, com um dos arquivos em 'cypress/e2e':

```bash
  # Exemplo: npm run cy:run -- cypress/e2e/curso-crud.cy.ts
  npm run cy:spec -- <CAMINHO_ARQUIVO_CYPRESS>
```

---

⌨️ com ❤️ por [Amanda Avelino](https://github.com/amavlopes) 😊
