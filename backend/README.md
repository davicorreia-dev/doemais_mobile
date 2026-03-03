# Backend da Aplicação Doe+

Bem-vindo(a) ao backend da aplicação móvel **Doe+**.  
Este serviço foi desenvolvido em **Node.js** com **TypeScript** e uma arquitetura de web service, seguindo as boas práticas de código como **KISS**, **DRY** e **CUPID**.  
Ele foi projetado para ser a API que se comunica com o aplicativo móvel **React Native**.

---

## 1. Tecnologias Utilizadas

- **Linguagem:** TypeScript  
- **Framework Web:** Express  
- **ORM:** Prisma  
- **Banco de Dados:** PostgreSQL  
- **Autenticação:** JWT (JSON Web Tokens)  
- **Criptografia:** BCrypt  
- **Validação:** Class-validator e Class-transformer  

---

## 2. Estrutura de Pastas

A estrutura do projeto é modular e segue o princípio da separação de responsabilidades.

```
/backend
├── /src
│   ├── /config       # Configurações de conexão (Prisma) e variáveis de ambiente
│   ├── /controllers  # Camada que lida com requisições e respostas HTTP
│   ├── /dtos         # Data Transfer Objects para validação de dados
│   ├── /middlewares  # Funções que interceptam requisições (validação, autenticação)
│   ├── /routes       # Definição dos endpoints da API
│   ├── /services     # Lógica de negócio e comunicação com o banco de dados
│   ├── /utils        # Funções utilitárias (hashing de senhas, JWT)
│   └── app.ts        # Ponto central da aplicação
│
├── .env              # Variáveis de ambiente
├── .gitignore        # Arquivos e pastas a serem ignorados pelo Git
├── package.json      # Dependências e scripts do projeto
├── tsconfig.json     # Configurações do TypeScript
├── prisma            # Schema do banco de dados e migrações

```

---

## 3. Guia de Instalação e Execução

### 3.1. Pré-requisitos
- Node.js (versão 18.x ou superior)  
- npm  
- PostgreSQL  
- Git  

### 3.2. Configuração do Projeto

**Clone o repositório:**
```bash
git clone https://github.com/davicorreia-dev/backend-mobile_doemais.git
cd backend
```

**Instale as dependências:**
```bash
npm install
```

**Configure o Banco de Dados:**

1. Crie um banco de dados PostgreSQL para o projeto (ex: `doemais_dev`).  
2. Crie um arquivo **.env** na raiz do projeto e adicione a URL de conexão do seu banco de dados, além da chave JWT.

```env
# .env
DATABASE_URL="postgresql://<usuario>:<senha>@<host>:<porta>/<banco>"
JWT_SECRET="sua_chave_secreta_aqui"
```

**Execute as Migrações do Prisma:**

```
npx prisma migrate dev --name init
```

Isso irá criar as tabelas no seu banco de dados com base no schema definido.

### 3.3. Execução da Aplicação

Para iniciar o servidor em modo de desenvolvimento, com auto-reload:
```bash
npm run dev
```

O servidor estará disponível em: http://localhost:3000

## 4. Segurança e Autenticação Global

O projeto adota a filosofia **"Secure by Default"** para garantir que nenhuma rota sensível seja exposta por esquecimento.

### 4.1. Middleware de Autenticação
Diferente da abordagem tradicional de aplicar middlewares em cada rota, o `authMiddleware` é injetado globalmente no `app.ts`. 

- **Rotas Protegidas:** Por padrão, todas as rotas da API exigem um header `Authorization: Bearer <token>`.
- **Rotas Públicas:** Apenas os endpoints de `/api/auth` (login, register, refresh, logout) são adicionados à lista de exceções no `app.ts`.
- **Injeção de Contexto:** Tokens válidos decodificam o `doadorId` e o injetam diretamente no objeto `req`. Isso permite que qualquer controlador acesse o ID do usuário logado via `req.doadorId`.

---

## 5. Endpoints da API

Abaixo estão os endpoints de autenticação, todos validados por **DTOs** e protegidos pela estratégia de tokens:

### **Públicos (Auth)**
- `POST /api/auth/register`: Cadastro de novo doador. Retorna `201 Created`.
- `POST /api/auth/login`: Autentica o usuário e gera o par de tokens (`accessToken` e `refreshToken`).
- `POST /api/auth/refresh`: Utiliza um `refreshToken` válido para emitir um novo `accessToken`.
- `POST /api/auth/logout`: Remove o `refreshToken` do banco de dados, invalidando a sessão.

### **Protegidos**
- *Qualquer nova rota (ex: `/api/doadores`, `/api/agendamentos`) criada no sistema estará automaticamente protegida pelo JWT.*

---

## 6. Tratamento de Erros Centralizado

Para garantir consistência e manutenibilidade, o projeto implementa um sistema de tratamento de erros centralizado que evita blocos `try-catch` repetitivos.

### 6.1. Classes de Erro (src/utils/errors.ts)
- `CustomError`: Classe base com `statusCode`.
- `ConflictError (409)`: Usado em duplicação de E-mail ou CPF.
- `UnauthorizedError (401)`: Usado para falhas de login ou tokens inválidos/expirados.
- `BadRequestError (400)`: Erros de validação de dados enviados pelo cliente.

### 6.2. Middleware Global de Erros
Registrado em `app.ts`, este middleware captura todas as exceções lançadas nos serviços ou controladores e retorna uma resposta padronizada:
`{ "message": "Descrição amigável do erro" }`.
