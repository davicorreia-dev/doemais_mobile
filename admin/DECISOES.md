# Decisões estruturais do painel admin

Documento de discussão. Reúne as perguntas em aberto sobre o painel do agente de saúde, os cenários
possíveis e os argumentos a favor e contra cada um. **Nada aqui está decidido.**

## 1. Contexto

- O app do doador (Expo/React Native) e a API (Express, Prisma, PostgreSQL) já existem.
- A API hoje só autentica **doadores**. O modelo `Doador` não tem papel/perfil.
- O banco já tem modelos próximos ao que o painel precisa: `Triagem_Resultado`, `Solicitacao_Correcao`
  (com status, responsável e observação de resolução), `Hemocentro`, `Agendamento`, `Doacao` e
  `Estoque_Sangue`. Não existem ainda: usuários de hemocentro, auditoria, campanhas, moderação de pedidos
  de sangue e agendamento no app.
- A triagem clínica final é presencial. A triagem do app é uma **pré-triagem**.

## 2. O painel fica em sistema separado?

| Cenário | Quando faz sentido | Riscos |
|---|---|---|
| **A. Mesmo repositório e mesma API; app web admin separado** (`backend/`, `frontend/`, `admin/`) | Equipe pequena, prazo curto, o projeto opera tudo | Um erro no admin pode afetar a API dos doadores |
| **B. Repositório e deploy separados, mesma API** | O admin terá ciclo de vida próprio (outra equipe, outro cliente) | Mais custo para manter contratos e versões sincronizados |
| **C. Sistema totalmente à parte (outro SaaS)** | O hemocentro já usa um sistema e não quer um segundo | Dependência da integração e da disponibilidade do outro lado |
| **D. Sem painel próprio, só API e exportação** | O hemocentro quer o dado dentro do sistema que já usa | Perde-se campanhas, correções e validação da carteirinha |

**Argumentos para A com fronteiras de B:** app e domínio separados, tokens com emissor e audiência
diferentes (um token de doador nunca vale como token de agente), rotas `/api/admin/*` com middleware
próprio. Assim dá para extrair para outro repositório depois sem reescrever.

**Contra-argumento:** se a equipe de enfermagem já passa o dia em outro sistema, uma aba a mais pode
simplesmente não ser usada. Nesse caso C ou D ganham, e o painel vira só o que o outro sistema não faz.

## 3. Como o hemocentro acessa os dados dos pacientes?

1. **O projeto expõe uma API** consumida pelo hemocentro, com chave por unidade. Dá controle ao projeto;
   exige alguém do outro lado capaz de integrar.
2. **O projeto envia para a API do hemocentro** (push/webhook). Encaixa no fluxo deles, mas depende do
   formato e da disponibilidade do sistema deles.
3. **Portal com perfil de acesso e exportação.** Mais rápido, funciona hoje; o CSV exportado sai do
   controle do projeto.
4. **Híbrido:** portal primeiro, integração depois, por uma camada adaptadora. A integração vira apenas
   um segundo cliente da mesma API interna.

Pontos a pesar: o portal cria a expectativa de ser o **sistema de registro**; se o hemocentro só quer
receber dados, o portal é escopo que ninguém pediu.

## 4. LGPD e responsabilidade

Dado de saúde é dado pessoal sensível (LGPD, art. 11). Isso muda as respostas acima:

- **Quem é o controlador?** Se for o hemocentro, o projeto é operador e precisa de contrato. Se for o
  projeto, o hemocentro é um terceiro recebendo dados.
- **Minimização:** o hemocentro vê o doador que agendou ou compartilhou a triagem, ou a base inteira?
  O mais defensável é apenas quem escolheu compartilhar.
- **Consentimento:** o texto de LGPD do app hoje cobre o uso interno. Compartilhar respostas com o
  hemocentro provavelmente exige consentimento próprio e explícito.
- **Pré-triagem:** o painel deve tratá-la como tal, não como registro médico.
- **Exportação:** limitar por papel, registrar quem exportou o quê, mascarar CPF.
- **Retenção e auditoria:** quanto tempo guardar, quem acessa, o que é registrado.

## 5. Papéis, unidades e autenticação

- Separar o agente em tabelas próprias (`Agente`, `Unidade`, `Papel`) em vez de colocar um `role` em
  `Doador`, para que um erro de permissão nunca promova um doador.
- Pensar em **múltiplas unidades** desde o início: o modelo `Hemocentro` já existe e todo dado do agente
  deve ser filtrado pela unidade.
- Autenticação em duas etapas é quase obrigatória com dado sensível. Login gov.br é opcional e depende de
  credenciamento.
- Papéis propostos no protótipo: **Gestor**, **Agente** e **Leitura**.

## 6. Escopo: o que é MVP e o que é Fase 2

O painel desenhado inclui funções que o app do doador **não tem hoje** (agenda, estoque, registro de
coleta). Se o hemocentro já faz isso em outro sistema, duplicar seria pior do que integrar.

- **MVP (dados que só o projeto tem):** triagens, correções, validação da carteirinha no balcão, pedidos de
  sangue, campanhas, doadores, equipe e auditoria.
- **Fase 2 (só se o hemocentro quiser):** agenda, estoque, registro da coleta, relatórios completos e
  configurações avançadas.

## 7. Perguntas em aberto

1. Existe um hemocentro parceiro hoje? Qual, e ele já usa algum sistema de gestão?
2. Esse sistema tem API ou integração, ou só exporta planilhas?
3. Quem é o controlador dos dados? Existe contrato ou termo?
4. O doador **escolhe** compartilhar a triagem com o hemocentro, ou entra automaticamente?
5. A equipe de enfermagem precisa de tudo isso ou só do que acontece **no balcão** (conferir carteirinha,
   ver a pré-triagem e decidir)?
6. O app vai ganhar agendamento? Se sim, a tela de agenda deixa de ser suposição.
7. Quem vai operar o painel (suporte, deploy, criação de usuários)? Isso pesa a favor de A ou de B.
8. O que o backend precisa ganhar primeiro: tabelas de agente e papel, auditoria, ou os endpoints
   `/api/admin/*`?

## 8. Caminho sugerido (para discussão)

1. Fechar as perguntas 1 a 4 antes de escrever qualquer endpoint.
2. Construir o painel em cima de uma API interna bem definida (contrato primeiro).
3. Entregar o MVP como portal; deixar a integração com o sistema do hemocentro como segundo cliente.
4. Só levar a Fase 2 adiante se o hemocentro confirmar que quer substituir ou complementar o que já tem.
