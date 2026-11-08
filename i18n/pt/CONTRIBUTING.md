<sub>[English](../../CONTRIBUTING.md) | [Tiếng Việt](../vi/CONTRIBUTING.md) | [한국어](../ko/CONTRIBUTING.md) | [简体中文](../zh/CONTRIBUTING.md) | [日本語](../ja/CONTRIBUTING.md) | [Deutsch](../de/CONTRIBUTING.md) | [Français](../fr/CONTRIBUTING.md) | [Español](../es/CONTRIBUTING.md) | [हिन्दी](../hi/CONTRIBUTING.md) | **Português (Brasil)**</sub>

# Como contribuir

> Esta tradução pode estar desatualizada em relação à versão em inglês. Em caso de divergência, prevalece a [versão em inglês](../../CONTRIBUTING.md).

Obrigado por ajudar. Relatos de bugs, correções na documentação e pull requests são todos bem-vindos.

Espera-se que todas as pessoas que participam sigam o [código de conduta](./CODE_OF_CONDUCT.md).

## Antes de começar

- **Um bug ou uma correção pequena?** Abra uma pull request diretamente, ou uma issue se não tiver certeza de que é um bug.
- **Uma nova funcionalidade ou uma mudança na API pública?** Abra primeiro uma issue para combinarmos o formato
  antes de você escrever o código.

## Configuração

Use a versão do Node indicada em [`.nvmrc`](../../.nvmrc) (`nvm use`) e depois:

```sh
npm install            # also installs a pre-push hook that runs `npm run check`
npm run dev            # playground (src/App.vue) with live Polaris components
npm run docs:dev       # documentation site
```

## Regras básicas

1. **Nunca edite `src/lib/generated/` nem `docs/components/` à mão.** Eles são sobrescritos pelos
   geradores. Altere `scripts/generate.mjs` / `scripts/generate-docs.mjs` em vez disso, depois execute
   `npm run generate && npm run docs:generate` e faça commit do resultado.
2. **Um novo componente de formulário precisa de v-model?** Adicione uma linha em `src/lib/overrides.ts` (o
   drift guard de `overrides.spec.ts` aponta exatamente o que está faltando).
3. **Um exemplo de documentação escrito à mão?** Adicione `docs/examples/<tag>.md` (demos interativas complexas ficam em
   `docs/examples/demos/*.vue`, já que SFCs não são afetados pelas alterações do markdown-it); o gerador da documentação
   o incorpora automaticamente. Boas práticas escritas à mão ficam em `docs/best-practices/<tag>.md`.
4. **Verifique o comportamento do Polaris em um navegador real.** Afirmações sobre os componentes do Polaris (regras de slots,
   peculiaridades de renderização) precisam ser conferidas no runtime real do CDN (`polaris-2.js`), não apenas no
   jsdom. Veja [`docs/guide/quirks.md`](../../docs/guide/quirks.md) para as descobertas já verificadas.
5. **Adicione um teste** para qualquer mudança de comportamento em `src/lib/runtime/` ou nos geradores.

## Antes de abrir uma pull request

Execute as mesmas verificações que a CI executa:

```sh
npm run generate && npm run docs:generate   # generated code must be up to date
npm run check                               # oxlint + eslint + vue-tsc
npx vitest run
npm run build:lib
npm run docs:build                          # if you touched docs or the docs generator
```

Depois:

- **Adicione uma linha ao `CHANGELOG.md`** em `## [Unreleased]` (em `Added`, `Changed`, `Fixed` ou
  `Removed`) para qualquer coisa que um usuário do pacote perceberia. Mudanças apenas na documentação ou internas
  não precisam disso. O CHANGELOG é escrito em inglês.
- **Dê à PR um título no estilo [Conventional Commits](https://www.conventionalcommits.org/)**:
  `fix: ...`, `feat: ...`, `docs: ...`, `chore: ...`, `test: ...`. Marque mudanças incompatíveis com `!`
  (`feat!: ...`).
- Mantenha uma única mudança por pull request.

## O que acontece depois que você abre uma pull request

- Se esta for sua primeira contribuição, o GitHub Actions aguarda um mantenedor aprovar a execução da CI.
  É uma proteção do GitHub para pull requests vindas de forks, não um julgamento sobre a sua mudança.
- O mantenedor revisa, faz o merge e publica a mudança na próxima versão. As versões são publicadas pelo
  mantenedor (veja [Publicação de versões](./README.md#publicação-de-versões)).

## Segurança

Encontrou uma vulnerabilidade? Não abra uma issue; veja a [política de segurança](./SECURITY.md).

## Licença

Ao contribuir, você concorda que suas contribuições sejam licenciadas sob a [licença MIT](../../LICENSE).
