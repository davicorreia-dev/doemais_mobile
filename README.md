# Doe+ Mobile

App mobile (Expo / React Native) + API (Node, Express, Prisma, PostgreSQL).

## Rodando com Docker

Requisitos: Docker com Compose v2 e **Expo Go SDK 58** no celular (Play Store / App Store).
O celular e o PC precisam estar na **mesma rede Wi-Fi**.

```bash
./run.sh --local    # banco + backend + Expo, usando a API local (padrão)
./run.sh --render   # só o Expo, usando a API do Render
./run.sh --local -d # argumentos extras vão para o "docker compose up"
```

- Escaneie o QR code (`docker compose logs frontend`) ou abra `exp://<IP-DO-PC>:8081` no Expo Go.
- Web: `http://localhost:8081`. API local: `http://<IP-DO-PC>:3000/health`.
- O `run.sh` detecta o IP do PC (Linux e macOS). Se detectar o errado (VPN, várias placas),
  force com `HOST_IP=192.168.x.x ./run.sh --local`.
- Windows: use WSL2 (rode o `run.sh` dentro dele) ou defina `HOST_IP` e `API_URL`
  e chame `docker compose --profile local up --build`.
- Parar tudo: `docker compose --profile local down` (acrescente `-v` para apagar o banco local).

### Se o celular não conectar
1. Firewall do PC liberando as portas **8081** (Expo) e **3000** (API). Ex. Linux: `sudo ufw allow 8081/tcp && sudo ufw allow 3000/tcp`.
2. Roteador sem "isolamento de clientes" (AP isolation) e PC/celular na mesma rede.
3. Versão do Expo Go diferente do SDK do projeto (58).

### JWT e segredos
- Cada máquina gera o próprio `ACCESS_TOKEN_SECRET` no `.env` da raiz (ignorado pelo git) na
  primeira execução. Nunca commite esse arquivo.
- Local e Render usam segredos diferentes: **um token de um ambiente não vale no outro**.
  Ao alternar `--local` / `--render`, o app pode mostrar erro de sessão uma vez; faça login de novo.
  O app limpa o token inválido sozinho.
- O banco local é separado do Render: os usuários de um não existem no outro.
- Este compose é só para desenvolvimento (senha do banco padrão, API exposta na rede).
  Não use em produção.

### Atualizações do SDK / OTA
O `app.json` usa `runtimeVersion` com política `appVersion`. Antes de publicar um build ou
update do SDK 58, aumente o `version` do app para não enviar JS do SDK 58 a builds antigos (SDK 54).
