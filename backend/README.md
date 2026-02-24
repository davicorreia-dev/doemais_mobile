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

## 4. Endpoints da API

A API já possui os seguintes endpoints de autenticação, validados por DTOs:

### **POST /api/auth/register**
- **Descrição:** Cadastra um novo doador.  
- **Body:** `RegisterDoadorDto`  
- **Retorno:** `201 Created` e os dados do doador.  

### **POST /api/auth/login**
- **Descrição:** Autentica um doador e gera um token de acesso.  
- **Body:** `LoginDoadorDto`  
- **Retorno:** `200 OK`, um JWT e os dados básicos do doador.  

### **POST /api/auth/refresh**
- **Descrição:** Utiliza o `refreshToken` para obter um novo e válido `accessToken`, mantendo a sessão ativa sem exigir novo login.
- **Body:** `RefreshTokenDto`  
- **Retorno:** `200 OK` e o novo `accessToken`.  

### **POST /api/auth/logout**
- **Descrição:** Revoga o `refreshToken` no banco de dados, invalidando imediatamente a sessão de longa duração para aquele dispositivo.
- **Body:** `RefreshTokenDto`  
- **Retorno:** `200 OK` e mensagem de sucesso. 

---

## 5. Tratamento de Erros Centralizado

Para garantir consistência, manutenibilidade e respostas padronizadas em caso de erros, o projeto implementa um sistema de tratamento de erros centralizado. Isso evita a repetição de lógica de try-catch nos controladores e serviços, promovendo um código mais limpo e escalável.

### 5.1. Como Funciona
**Classes de Erro Personalizadas (src/utils/errors.ts):**

- `CustomError`: Classe base que estende `Error` e inclui um `statusCode` HTTP.
- Classes derivadas: `ConflictError (409)`, `UnauthorizedError (401)`, `BadRequestError (400)`, entre outras.
- Exemplo de uso nos serviços: `throw new ConflictError('Usuário com este e-mail ou CPF já existe.');`.

**Middleware Global de Erros (src/middlewares/error.middleware.ts):**

 - Captura todos os erros passados via `next(error)` nos controladores ou middlewares.
 - Verifica se o erro é uma instância de `CustomError` para retornar o `statusCode` e `message` apropriados.
 - Para erros inesperados, retorna um `500 Internal Server Error` genérico.
 - Formato de resposta de erro: `{ message: "Descrição do erro" }`.
 - Logs de erros são feitos no console para depuração.

**Integração:**

- Os serviços lançam erros personalizados.
- Os controladores usam `next(error)` para propagar erros.
- O middleware é registrado no final da cadeia em `app.ts`: `app.use(errorMiddleware);`.
- O middleware de validação (`validation.middleware.ts`) também usa `BadRequestError` para erros de DTO.
