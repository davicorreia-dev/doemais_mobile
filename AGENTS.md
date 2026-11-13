# Instruções para agentes

## Commits

Sempre use commits convencionais, curtos e em português: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:` ou `style:`.

- Separe commits por objetivo técnico; não misture interface, API, documentação e manutenção no mesmo commit.
- Antes de criar um commit, revise `git diff --check`, execute a validação pertinente e adicione somente os arquivos daquele objetivo.
- Não faça commit de segredos, arquivos `.env`, artefatos de build ou dependências instaladas localmente.
