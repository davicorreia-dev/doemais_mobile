# Doe+ Mobile

App mobile de doação de sangue: **Expo / React Native** (iOS, Android e web) + **API Node.js**
(Express, Prisma, PostgreSQL).

```
doemais_mobile/
├── frontend/            # app Expo (SDK 58, React Native 0.88)
├── backend/             # API Express + Prisma (veja backend/README.md)
├── admin/               # painel do agente de saúde (React + Vite, protótipo; veja admin/README.md)
├── docker-compose.yml   # banco + backend + Expo + painel admin, para desenvolvimento
└── run.sh               # atalho: ./run.sh --local | --render
```

## Início rápido (Docker)

Requisitos: Docker com Compose v2 e o app **Expo Go SDK 58** no celular
(Play Store / App Store). Celular e PC precisam estar na **mesma rede Wi-Fi**.

```bash
./run.sh --local    # banco + backend + Expo + painel admin, usando a API local (padrão)
./run.sh --render   # Expo + painel admin, usando a API publicada no Render
./run.sh --local -d # argumentos extras vão para o "docker compose up"
```

| O quê | Onde |
|---|---|
| App no celular | QR code em `docker compose logs frontend` ou `exp://<IP-DO-PC>:8081` no Expo Go |
| App na web | `http://localhost:8081` |
| API local | `http://<IP-DO-PC>:3000` (`/health` para checar) |
| Painel admin | `http://localhost:5174` (só neste PC; dados fictícios) |
| Banco local | só dentro do Docker (porta 5432 não é exposta), volume `pgdata` |

O `run.sh` detecta o IP do PC (Linux e macOS). Se pegar o IP errado (VPN, várias placas):
`HOST_IP=192.168.x.x ./run.sh --local`.
No Windows use o WSL2, ou defina `HOST_IP` e `API_URL` e rode
`docker compose --profile local up --build`.

### Comandos úteis

```bash
docker compose logs -f frontend                 # QR code e logs do app
docker compose logs -f backend                  # logs da API
docker compose --profile local down             # para tudo
docker compose --profile local down -v          # para tudo e apaga o banco local
docker compose --profile local exec db psql -U doemais   # acessa o banco local
```

### Trocando entre `--local` e `--render`

- Feche o app **por completo** no Expo Go e abra de novo (ou use "Reload"). Sem isso ele continua
  com o JS antigo e chama a API do modo anterior.
- **Local e Render são ambientes separados**: bancos diferentes e segredos JWT diferentes.
  Um token de um ambiente não vale no outro e os usuários de um não existem no outro.
  Faça login/cadastro de novo.
- A API usada vem de `EXPO_PUBLIC_API_URL_OVERRIDE` (definida pelo compose) e tem prioridade
  sobre qualquer `frontend/.env.local`. Esse arquivo só vale rodando o Expo fora do Docker.

### Problemas comuns

| Sintoma | Causa provável / o que fazer |
|---|---|
| Expo Go: "Project is incompatible with this version of Expo Go" | O Expo Go precisa ser o do **SDK 58** (atualize o app). |
| Carrega para sempre / "falha no download do update remoto" | Porta 8081 não publicada ou bloqueada. Veja `docker compose ps` e o firewall. Se sobrou container antigo: `docker compose --profile local down` e `./run.sh`. |
| `Failed to connect to <IP>:3000` | Está no modo `--render` com o app ainda no JS do modo local (reabra o app), ou o firewall bloqueia a 3000. |
| Celular não alcança o PC | Libere 8081 e 3000 no firewall (Linux: `sudo ufw allow 8081/tcp && sudo ufw allow 3000/tcp`); desative "isolamento de clientes" (AP isolation) no roteador; confirme que estão na mesma rede. |
| QR code com IP errado | Force com `HOST_IP=...`. |
| `port is already allocated` (8081/3000) | Tem outro Expo/backend rodando fora do Docker. Pare-o antes. |
| Erro de CORS na web contra o Render | O Render só libera as origens configuradas no `CORS_ORIGIN` dele; adicione `http://localhost:8081` lá. |

### O que o Docker faz (e não faz)

- É **só para desenvolvimento**: senha padrão do banco, API exposta na rede, Metro em modo dev.
  Não use este compose em produção.
- O backend aplica as migrations do Prisma (`prisma migrate deploy`) toda vez que sobe.
- O frontend monta `./frontend` no container: editar o código recarrega o app (hot reload).
  Se mudar `package.json`, rode `./run.sh` de novo (ele reconstrói a imagem e renova o `node_modules`).
- Variáveis do Expo no container: `EXPO_OFFLINE=1` evita um prompt de login interativo que travava o
  Expo Go; por isso o Expo avisa "unable to sign manifest" (inofensivo em desenvolvimento).

## Segurança e JWT

- Cada máquina gera o próprio `ACCESS_TOKEN_SECRET` no `.env` da raiz (ignorado pelo git) na primeira
  execução do `run.sh`. **Nunca commite o `.env`.** Apagar o arquivo gera um segredo novo e invalida
  os tokens locais.
- Access token: JWT HS256 com `doadorId`; refresh token: aleatório, guardado no banco, revogado no
  logout e na troca de senha. Detalhes em [backend/README.md](backend/README.md).
- Não imprima senhas ou tokens em `console.log`/logs (já removidos do login e do cadastro).
- Veja também [SECURITY.md](SECURITY.md).

## Rodando sem Docker

- **Backend:** [backend/README.md](backend/README.md) (precisa de Node 22+, PostgreSQL e um `.env`).
- **Frontend:** `cd frontend && npm install --legacy-peer-deps && npx expo start --lan`.
  Copie `frontend/.env.example` para `frontend/.env.local` para apontar para a sua API.
  Node **22.13+** é exigido pelo Expo SDK 58.

## Atualização para o Expo SDK 58

O projeto foi migrado do SDK 54 para o 58 (React Native 0.88, React 19.3). O que mudou na prática:

- Node 22.13+ é obrigatório (os Dockerfiles usam `node:22-slim`).
- O Android é sempre **edge-to-edge**: o `StatusBar` do RN não aceita mais `backgroundColor`/`translucent`.
  Use `components/StatusBarBackground` para pintar a área da barra de status.
- Use o `SafeAreaView` de `react-native-safe-area-context` (o do React Native não funciona em Android edge-to-edge).
- `newArchEnabled` e `android.edgeToEdgeEnabled` saíram do `app.json` (não existem mais).
- **OTA / builds:** o `app.json` usa `runtimeVersion` com política `appVersion`. Antes de publicar build
  ou update do SDK 58, aumente o `version` do app, senão um update de JS do SDK 58 pode ser entregue a
  builds antigos (SDK 54) e quebrá-los.

## Contribuindo

Veja [CONTRIBUTING.md](CONTRIBUTING.md).
