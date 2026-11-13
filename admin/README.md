# Doe+ Admin (protótipo navegável)

Front-end web do **painel do agente de saúde**, usado pelo hemocentro para acompanhar triagens, decidir
correções, atender doadores e coordenar campanhas.

> **Estado atual:** protótipo para revisão da equipe. Todos os dados são fictícios e ficam só em memória
> no navegador. **Não há chamadas à API** e nada é gravado no servidor. As decisões estruturais ainda em
> aberto (sistema separado ou não, como o hemocentro acessa os dados) estão em
> [`DECISOES.md`](DECISOES.md).

## Como rodar

**Com Docker (junto com o resto do projeto):** `./run.sh --local` na raiz já sobe o painel em
http://localhost:5174, e o `run.sh` lista todos os links de acesso no log.

**Sem Docker** (Node 22+):

```bash
cd admin
npm install
npm run dev        # http://localhost:5174
```

Outros comandos:

```bash
npm run typecheck  # checagem de tipos
npm run build      # build de produção em admin/dist
```

Para entrar: qualquer e-mail válido e qualquer senha, depois qualquer código de 6 dígitos e a escolha da
unidade. A sessão fica no `localStorage` e o menu do perfil permite **restaurar os dados de demonstração**.

### Retestes reais no painel local

A tela **Retestes solicitados** usa o proxy do servidor Vite para acessar a API. Configure
`HEMOCENTRO_SERVICE_API_KEY` no ambiente do backend e do serviço `admin`; a chave é adicionada pelo proxy
e não é exposta ao navegador. Sem essa variável, a tela informa que a integração não está disponível.

## Como revisar

- A faixa escura no topo mostra que é um protótipo e tem o interruptor **Mostrar MVP / Fase 2**, que exibe ou
  esconde as etiquetas de escopo em cada tela e no menu.
- **Ctrl + K** abre a busca global (doadores e páginas).
- As ações têm efeito visível: aprovar uma correção reduz o contador do menu, grava uma linha na
  **Auditoria**, registrar uma doação soma uma bolsa ao **Estoque**, e assim por diante.
- Exportações (Doadores, Auditoria, Relatórios) geram CSV de verdade, com CPF mascarado.
- Trocar de unidade para **Olinda** ou **Jaboatão** mostra a visão de quem tem o papel de Agente
  (Equipe e Configurações ficam somente leitura).

## Telas e escopo proposto

| Área | Tela | Rota | Escopo |
|---|---|---|---|
| Acesso | Login, verificação em 2 etapas, escolha de unidade, recuperar acesso, primeiro acesso | `/login`, `/2fa`, `/unidade`, `/recuperar`, `/primeiro-acesso` | MVP |
| Operação | Visão geral | `/visao-geral` | MVP (widgets de estoque e agenda: Fase 2) |
| Operação | Triagens e detalhe do doador | `/triagens`, `/triagens/:id` | MVP |
| Operação | Correções de respostas | `/correcoes` | MVP |
| Operação | Atendimento (check-in e triagem presencial) | `/atendimento` | MVP (registro da coleta: Fase 2) |
| Operação | Agenda | `/agenda` | Fase 2 |
| Banco de sangue | Pedidos de sangue | `/pedidos` | MVP |
| Banco de sangue | Estoque | `/estoque` | Fase 2 |
| Comunidade | Doadores | `/doadores` | MVP |
| Comunidade | Campanhas | `/campanhas` | MVP |
| Gestão | Equipe e permissões | `/equipe` | MVP |
| Gestão | Auditoria | `/auditoria` | MVP |
| Gestão | Relatórios | `/relatorios` | Fase 2 |
| Gestão | Configurações da unidade | `/configuracoes` | Fase 2 |

**Critério:** o MVP é o que depende de dados que o app do doador já produz (triagens, correções,
carteirinha, pedidos, cadastro). A Fase 2 é o que o hemocentro costuma já ter em outro sistema (agenda,
estoque, relatórios) e só entra se fizer sentido substituí-lo ou integrar com ele.

## Estrutura

```
admin/
├── src/
│   ├── App.tsx              # rotas
│   ├── styles.css           # tokens e componentes (mesma paleta do app: #E0323C, Lexend)
│   ├── components/          # Shell (menu, topo, busca), Logo, ui (cards, modais, chips…)
│   ├── data/mock.ts         # dados fictícios e tipos
│   ├── state/store.tsx      # estado em memória + ações (decidir, registrar, exportar…)
│   └── pages/               # uma página por área
└── DECISOES.md              # questões estruturais em aberto
```

Stack: React 19, TypeScript, Vite, React Router, lucide-react e a fonte Lexend. Nenhuma dependência de UI
pesada; os gráficos são HTML/CSS.

## Ligando à API (próximo passo)

`state/store.tsx` concentra todas as leituras e mudanças de estado. Para integrar, a ideia é trocar cada
ação por uma chamada `/api/admin/*` e manter as telas como estão. O backend ainda **não** tem: papéis de
agente, auditoria, campanhas, moderação de pedidos nem agendamento. Ver `DECISOES.md`.

## Segurança

- Sem segredos, tokens ou dados reais no código.
- O protótipo não autentica de verdade: não o publique em um endereço acessível. Fora do Docker o servidor de desenvolvimento escuta só em `localhost`; no Docker a porta é publicada apenas em `127.0.0.1`.
