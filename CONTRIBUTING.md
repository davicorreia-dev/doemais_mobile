# Guia de Contribuição – DOE_MAIS

Este documento estabelece as regras formais para contribuições no projeto **Doe+ Mobile**, garantindo qualidade, segurança e conformidade com padrões corporativos.

---

## 📌 Princípios Gerais

- Toda alteração deve ocorrer via **Pull Request**
- Commits diretos na branch `main` são **proibidos**
- Código e documentação são tratados como **ativos corporativos**

---

## 🔄 Fluxo Oficial de Contribuição

1. Criar branch a partir da `main`
2. Nomear a branch conforme padrão definido
3. Implementar a alteração
4. Abrir Pull Request para revisão

---

## 🔐 Requisitos de Segurança

Antes de submeter um Pull Request, é obrigatório garantir que:

- Nenhum secret, token ou credencial foi incluído
- Dados reais de clientes ou ambientes não estão presentes
- Dependências novas foram avaliadas
- A documentação foi atualizada quando necessário

---

## 🟢 Definition of Ready (DoR)

Uma contribuição está pronta para revisão quando:

- O objetivo da mudança está claramente descrito
- O impacto técnico e de negócio foi informado
- Não há dados sensíveis
- A mudança está alinhada às políticas da empresa

---

## ✅ Definition of Done (DoD)

Uma contribuição é considerada concluída quando:

- Revisada e aprovada por responsável técnico
- Revisão de segurança realizada
- Testes automatizados aprovados
- Nenhum alerta crítico de segurança permanece

---

## 🧾 Padrão Corporativo de Commits

As mensagens de commit devem ser **claras, objetivas e padronizadas**, seguindo o formato:

```text
tipo: descrição curta no imperativo
```
| Tipo      | Quando usar                          | Exemplo                                   |
|-----------|--------------------------------------|-------------------------------------------|
| **feat**  | Nova funcionalidade                  | `feat: permitir cadastro de usuários`     |
| **fix**   | Correção de bug                      | `fix: corrigir validação de e-mail`        |
| **docs**  | Alterações em documentação           | `docs: atualizar instruções de instalação`|
| **refactor** | Refatoração sem mudar comportamento | `refactor: reorganizar camada de serviços`|
| **test**  | Criação ou alteração de testes       | `test: adicionar testes de autenticação`  |
| **style** | Formatação (sem alterar lógica)      | `style: ajustar indentação do código`     |
| **perf**  | Melhoria de performance              | `perf: otimizar consulta de usuários`     |
| **chore** | Manutenção                           | `chore: atualizar dependências`           |
| **ci**    | Pipeline e automação                 | `ci: adicionar workflow de CI`            |
| **build** | Build e dependências                 | `build: atualizar configuração de build`  |
| **revert**| Reversão de commit                   | `revert: remover funcionalidade de login` |

---

## 👥 Responsabilidades

- **Desenvolvedores:** qualidade e segurança do código  
- **Revisores:** validação técnica e de segurança  
- **Mantenedores:** decisão final de merge  

---

## ⚖️ Código de Conduta

Comportamento ético, profissional e respeitoso é obrigatório.  
Violações podem resultar em medidas disciplinares.

---

## 📞 Suporte

Dúvidas devem ser tratadas via canais internos oficiais da empresa.
