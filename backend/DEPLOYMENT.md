# 🚀 Guia de Deployment - Render

## Pré-requisitos

- Conta no [Render.com](https://render.com)
- Repositório GitHub com o código da aplicação
- PostgreSQL Database (Render fornece)

## Arquivos de Configuração Criados

Os seguintes arquivos foram criados para facilitar o deployment:

### 1. **render.yaml**
Arquivo de configuração principal que define:
- Tipo de serviço web
- Variáveis de ambiente
- Comando de build com migrações automáticas
- Configuração do banco de dados PostgreSQL

### 2. **.env.example**
Modelo de variáveis de ambiente necessárias:
- `DATABASE_URL`: URL de conexão PostgreSQL
- `NODE_ENV`: Ambiente (production/development)
- `JWT_SECRET` e `JWT_REFRESH_SECRET`: Chaves de segurança
- Outras configurações personalizadas

### 3. **build.sh**
Script automatizado que:
- Instala dependências
- Gera cliente Prisma
- Executa migrações do banco de dados
- Compila TypeScript

### 4. **Procfile**
Define o comando de inicialização da aplicação

### 5. **.npmrc**
Otimiza a instalação de dependências npm com retry policies

### 6. **.dockerignore**
Define arquivos a ignorar em builds (se usar Docker)

---

## Passos para Deploy

### Opção 1: Deploy via GitHub (Recomendado)

1. **Faça push do repositório para GitHub**
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Acesse [render.com](https://render.com) e faça login**

3. **Clique em "Create" → "Web Service"**

4. **Configure a conexão com GitHub**
   - Selecione o repositório
   - Escolha a branch principal (main/master)

5. **Na página de configuração:**
   - **Name**: `doemais-api`
   - **Root Directory**: `backend` (se usar monorepo)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build && npx prisma migrate deploy`
   - **Start Command**: `npm run start`

6. **Configure as variáveis de ambiente:**
   - Acesse "Environment" e adicione as variáveis do `.env.example`
   - **Importante**: Gere valores seguros para `JWT_SECRET` e `JWT_REFRESH_SECRET`

7. **Configure o PostgreSQL Database:**
   - Clique em "Create" → "PostgreSQL"
   - Nome: `doemais-db`
   - Escolha plano desejado
   - O `DATABASE_URL` será preenchido automaticamente

8. **Clique em "Create Web Service"**

---

### Opção 2: Deploy via render.yaml (Avançado)

Se usar este método:

1. **Garanta que `render.yaml` está no root do repositório** ou **no branch correto**

2. **Acesse [render.com/deploy](https://render.com/deploy)**

3. **Conecte com GitHub e selecione o repositório**

4. **O Render lerá automaticamente o `render.yaml` e criará os serviços**

---

## Variáveis de Ambiente - Valores Necessários

Após o deployment, configure as seguintes variáveis:

```env
NODE_ENV=production
PORT=3000

# Gere valores seguros para JWT
JWT_SECRET=gerar-com-openssl-rand-hex-32
JWT_REFRESH_SECRET=gerar-com-openssl-rand-hex-32
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Database (preenchida automaticamente se usar PostgreSQL do Render)
DATABASE_URL=postgresql://...

# API Configuration
API_URL=https://seu-dominio.onrender.com
```

**Para gerar chaves seguras no terminal:**
```bash
openssl rand -hex 32
```

---

## Pós-Deployment

### 1. **Verifique o Log**
```bash
# No dashboard do Render, clique em "Logs" para verificar
# Deve aparecer "Servidor rodando na porta 3000"
```

### 2. **Teste a API**
```bash
curl https://seu-nome-da-app.onrender.com/health
```

### 3. **Monitore Performance**
- Acesse o dashboard do Render
- Verifique CPU, Memória e requisições
- Escalabilidade está disponível em planos pagos

---

## Troubleshooting

### ❌ Build falha com erro de Prisma
**Solução**: Certifique-se que:
- `DATABASE_URL` está configurada corretamente
- O PostgreSQL do Render foi criado e está conectando
- Rode: `npx prisma generate` localmente primeiro

### ❌ Aplicação crash logo após deploy
**Solução**:
- Verifique os logs no dashboard
- Garanta que todas as variáveis de ambiente estão definidas
- Confirme que `npm run start` executa `node dist/server.js`

### ❌ Erro: "Cannot find module"
**Solução**:
- Delete `node_modules` e `package-lock.json` localmente
- Execute `npm install`
- Faça commit e push novamente

### ❌ Banco de dados não persiste entre deploys
**Solução**:
- Render PostgreSQL persiste dados automaticamente
- Use o `DATABASE_URL` fornecido pelo Render
- Não use banco de dados em memória

---

## Dicas de Segurança

✅ **Faça:**
- Gere chaves JWT seguras e únicas
- Use diferentes credenciais para development/production
- Mantenha `.env` local e nunca faça commit
- Monitore logs regularmente
- Configure HTTPS automático (Render faz)

❌ **Não faça:**
- Committar arquivos `.env` com credenciais reais
- Usar mesma chave JWT para múltiplos ambientes
- Deixar database URLs em logs públicos
- Usar plano Free para aplicações críticas

---

## Próximos Passos

1. **Configurar domínio customizado**
   - Acesse Settings → Custom Domain
   - Configure DNS records do seu domínio

2. **Ativar Auto-Deploy**
   - Settings → Auto-Deploy: Enabled (padrão)
   - A cada push, o Render faz deploy automático

3. **Configurar alertas**
   - Monitore CPU, memória e taxas de erro
   - Configure notifications em caso de crash

---

**Dúvidas?** Consulte a [documentação oficial do Render](https://docs.render.com)
