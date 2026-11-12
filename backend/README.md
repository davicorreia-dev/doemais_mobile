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

> **Atalho:** na raiz do repositório, `./run.sh --local` sobe banco + backend + app com Docker
> (veja o [README principal](../README.md)). O guia abaixo é para rodar o backend sem Docker.

### 3.1. Pré-requisitos
- Node.js (versão 22.x ou superior)  
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
2. Crie um arquivo **.env** na raiz do projeto e adicione a URL de conexão do seu banco de dados, a chave de acesso e os tempos de expiração.

```env
# .env
DATABASE_URL="postgresql://<usuario>:<senha>@<host>:<porta>/<banco>"
ACCESS_TOKEN_SECRET="sua_chave_secreta_aqui"
ACCESS_TOKEN_EXPIRATION_SECONDS=300
REFRESH_TOKEN_EXPIRATION_DAYS=7
CORS_ORIGIN=http://localhost:3001
```

**Execute as Migrações do Prisma:**

```bash
npx prisma migrate deploy
```

Isso aplicará as migrations existentes no banco de dados. Se ainda não tiver criado o banco, use `npx prisma migrate dev --name init` apenas no ambiente de desenvolvimento local.

**Variáveis de ambiente**

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `DATABASE_URL` | sim | – | Conexão PostgreSQL |
| `ACCESS_TOKEN_SECRET` | sim | – | Segredo de assinatura do JWT (longo e aleatório, ex.: `openssl rand -hex 32`). Nunca commitar |
| `ACCESS_TOKEN_EXPIRATION_SECONDS` | não | `7d` | Validade do access token (segundos ou formato `15m`, `1h`, `7d`) |
| `REFRESH_TOKEN_EXPIRATION_DAYS` | não | `7` | Validade do refresh token |
| `PORT` | não | `3000` | Porta da API |
| `NODE_ENV` | não | `development` | Em `production`, o link de reset de senha **não** é logado |
| `CORS_ORIGIN` | não | `http://localhost:3001` | Origem(ns) extra(s) permitida(s) no CORS; várias separadas por vírgula |
| `FRONTEND_URL` | não | `http://localhost:8081` | Base do link de redefinição de senha |

Origens `localhost` em 3000, 3001, 8080, 8081 e 8082 (e `127.0.0.1` em 8081/8082) já são liberadas.

### 3.3. Execução da Aplicação

Para iniciar o servidor em modo de desenvolvimento com recarregamento automático:
```bash
npm run dev
```

Para compilar o TypeScript e iniciar o servidor em modo de produção:
```bash
npm run build
npm start
```

O servidor estará disponível em: `http://localhost:3000`

## 4. Segurança e Autenticação Global

O projeto adota a filosofia **"Secure by Default"** para garantir que nenhuma rota sensível seja exposta por esquecimento.

### 4.0. Tokens (resumo)
- **Access token:** JWT assinado com `ACCESS_TOKEN_SECRET` (HS256), payload `{ doadorId }`, validade em `ACCESS_TOKEN_EXPIRATION_SECONDS`.
- **Refresh token:** string aleatória de 64 bytes, salva na tabela `RefreshToken`; `/refresh` emite novo access token;
  logout e troca de senha apagam os refresh tokens.
- O logout não invalida um access token já emitido (JWT é stateless): ele vale até expirar.
  Por isso prefira validades curtas (15 min a 1 h) em produção.
- Tokens de ambientes diferentes (local x Render) não se misturam porque os segredos são diferentes.

### 4.1. Middleware de Autenticação
Diferente da abordagem tradicional de aplicar middlewares em cada rota, o `authMiddleware` é injetado globalmente no `app.ts`. 

- **Rotas Protegidas:** Por padrão, todas as rotas da API exigem um header `Authorization: Bearer <token>`.
- **Rotas Públicas:** Apenas os endpoints de `/api/auth` (login, register, refresh, logout, password-reset) são adicionados à lista de exceções no `app.ts`.
- **Injeção de Contexto:** Tokens válidos decodificam o `doadorId` e o injetam diretamente no objeto `req`. Isso permite que qualquer controlador acesse o ID do usuário logado via `req.doadorId`.

---

## 5. Endpoints da API

### **Públicos (Autenticação)**
- `POST /api/auth/register`: Cadastro de novo doador.
- `POST /api/auth/login`: Autentica e gera os tokens de acesso.
- `POST /api/auth/refresh`: Renova o `accessToken` expirado.
- `POST /api/auth/logout`: Encerra a sessão e revoga o `refreshToken`.
- `POST /api/auth/password-reset/request`: Pede a redefinição de senha. Resposta idêntica para e-mails existentes e inexistentes (não revela quem tem conta).
- `POST /api/auth/password-reset/confirm`: Troca a senha com o token recebido (token de uso único, validade de 1 h, guardado só como hash SHA-256). Revoga todos os refresh tokens do usuário.

> Sem integração de e-mail ainda: fora de `production`, o link de reset é impresso no log do backend.

### **Protegidos (Usuário)**
- `GET /api/doadores/me`: Retorna o perfil completo do doador autenticado (excluindo dados sensíveis como senha).
- `GET /api/doadores/certificate`: Gera e retorna um certificado de doação em formato PDF.
- `PUT /api/doadores/me`: Atualiza o perfil do doador autenticado.

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
