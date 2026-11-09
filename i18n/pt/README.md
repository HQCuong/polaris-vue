<div align="center">

<sub>[English](../../README.md) | [Tiếng Việt](../vi/README.md) | [한국어](../ko/README.md) | [简体中文](../zh/README.md) | [日本語](../ja/README.md) | [Deutsch](../de/README.md) | [Français](../fr/README.md) | [Español](../es/README.md) | [हिन्दी](../hi/README.md) | **Português (Brasil)**</sub>

<br>

<a href="https://polaris-vue-elements.dev/pt/">
  <img src="https://polaris-vue-elements.dev/og.png" alt="polaris-vue-elements: wrappers tipados de Vue 3 para os web components do Shopify Polaris" width="720">
</a>

<br>
<br>

[![npm version](https://img.shields.io/npm/v/polaris-vue-elements?color=008060&label=npm)](https://www.npmjs.com/package/polaris-vue-elements)
[![npm downloads](https://img.shields.io/npm/dm/polaris-vue-elements?color=008060)](https://www.npmjs.com/package/polaris-vue-elements)
[![CI](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml/badge.svg)](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/npm/l/polaris-vue-elements?color=008060)](../../LICENSE)

**[Documentação](https://polaris-vue-elements.dev/pt/)** ·
[Primeiros passos](https://polaris-vue-elements.dev/pt/guide/getting-started) ·
[Componentes](https://polaris-vue-elements.dev/pt/components/) ·
[Guia de app incorporado](https://polaris-vue-elements.dev/pt/guide/shopify-embedded-app) ·
[Changelog](../../CHANGELOG.md)

</div>

---

> Esta tradução pode estar desatualizada em relação à versão em inglês. Em caso de divergência, prevalece a [versão em inglês](../../README.md).

Componentes wrapper de Vue 3 tipados para os [web components do Shopify Polaris](https://shopify.dev/docs/api/app-home/web-components): os custom elements `s-*` usados para criar apps do Shopify App Home (incorporados ao admin da Shopify).

O runtime do Polaris é carregado a partir do CDN da Shopify (o canal estável `polaris-2.js` recebe atualizações compatíveis automaticamente). Esta biblioteca oferece, por cima dele, uma superfície Vue idiomática e totalmente tipada.

## Recursos

- **Props e events tipados para todos os 62 componentes**, gerados a partir do Custom Elements Manifest oficial da Shopify (`@shopify/polaris-types`): props com tipos união como `variant`, autocompletar nos templates e listeners `@click` / `@aftershow` tipados.
- **`v-model` em 17 componentes de formulário** (`STextField`, `SCheckbox`, `SSelect`, `SChoiceList`, …), cada um mapeado para o par correto de propriedade/evento.
- **Controle imperativo de overlays.** O `SModal` expõe um `$el` tipado (`ModalElement`), então `modal.value?.$el.showOverlay()` passa na verificação de tipos, junto com o padrão declarativo `commandFor` / `command` do Polaris.
- **Degrada com elegância, nunca bloqueia.** Props desconhecidas são repassadas via `$attrs`, slots são encaminhados como estão e componentes novos do Polaris sempre podem ser usados como tags `s-*` puras. Um wrapper desatualizado significa apenas tipos ausentes para recursos novos, nunca que os existentes deixem de funcionar.

## Instalação

```sh
npm install polaris-vue-elements
```

O Vue `^3.5` é uma peer dependency.

### Configuração do runtime (obrigatória)

Os wrappers são apenas de apresentação. O seu app hospedeiro carrega o runtime do Polaris a partir do CDN da Shopify e informa ao Vue que as tags `s-*` são custom elements:

```html
<!-- index.html -->
<script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
```

```ts
// vite.config.ts
vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('s-'),
    },
  },
})
```

> **Observação:** `polaris-2.js` é o canal estável da Shopify e traz o novo design visual do admin. Apps que ainda usam `polaris-1.js` continuam funcionando: a API de componentes da 2.0 é a mesma da 1.1, exceto por algumas adições. Veja [Polaris 2.0 e o novo design do admin](https://polaris-vue-elements.dev/pt/guide/getting-started#polaris-2-0-and-the-new-admin-design).

## Início rápido

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, STextField } from 'polaris-vue-elements'

const name = ref('')
</script>

<template>
  <STextField v-model="name" label="Name" />
  <SButton variant="primary" @click="console.log(name)">Save</SButton>
</template>
```

> **Dica:** prefere escrever as próprias tags `<s-button>` do Polaris? Adicione `"types": ["polaris-vue-elements/elements"]` ao seu `tsconfig.json`, e o Volar / `vue-tsc` também verificam os tipos das tags `<s-*>` puras (apenas tipos; o `v-model` continua exclusivo dos wrappers). Veja [Tipando tags `<s-*>` puras](https://polaris-vue-elements.dev/pt/guide/getting-started#_7-typing-raw-s-tags-optional).

## Documentação

Tudo está em **[polaris-vue-elements.dev](https://polaris-vue-elements.dev/pt/)**:

- [Primeiros passos](https://polaris-vue-elements.dev/pt/guide/getting-started): configuração, `v-model`, overlays e tags puras tipadas.
- [Crie um app incorporado da Shopify com Vue 3](https://polaris-vue-elements.dev/pt/guide/shopify-embedded-app): App Bridge, `fetch` autenticado, navegação e a barra de salvamento.
- [Peculiaridades conhecidas](https://polaris-vue-elements.dev/pt/guide/quirks): comportamentos do Polaris verificados em um navegador real.
- [Variáveis CSS](https://polaris-vue-elements.dev/pt/guide/css-variables): os design tokens do Polaris (`--p-color-*`, `--p-space-*`, …) como um `polaris-vue-elements/tokens.css` importável para o seu próprio CSS de layout.
- [Referência de componentes](https://polaris-vue-elements.dev/pt/components/): props, events, slots, boas práticas e exemplos interativos de todos os 62 componentes.

O código-fonte do site está em [`docs/`](../../docs); execute-o localmente com `npm run docs:dev`.

## Como funciona

Tudo o que pode ser derivado do manifest da Shopify é gerado automaticamente; o julgamento humano fica em um único arquivo pequeno.

```
@shopify/polaris-types (custom-elements.json)   ← source of truth
        │  npm run generate
        ▼
src/lib/generated/        ← metadata, Props/Events/Element types, components (DO NOT EDIT)
src/lib/runtime/          ← createWrapper: one generic factory for all 62 components
src/lib/overrides.ts      ← hand-written: v-model mappings only
```

Testes contra divergência (drift guards) tornam impossível esquecer algo: a CI falha se o código gerado estiver desatualizado, se faltar o wrapper de um componente do manifest ou se um novo componente do tipo formulário não tiver um override de v-model. Um workflow agendado ([`sync-polaris.yml`](../../.github/workflows/sync-polaris.yml)) abre automaticamente uma PR de sincronização quando uma nova versão de `@shopify/polaris-types` é publicada.

<details>
<summary><strong>Atualizar manualmente para uma nova versão do Polaris</strong></summary>

```sh
npm update @shopify/polaris-types
npm run generate          # regenerate wrappers + types
npm run docs:generate     # regenerate component reference docs
git diff                  # review, then note API changes in CHANGELOG.md
```

</details>

## Desenvolvimento

```sh
npm install
npm run dev            # playground (src/App.vue) with live Polaris components
npm run docs:dev       # documentation site
npm run test:unit      # vitest (drift guards + wrapper behavior)
npm run type-check     # vue-tsc
npm run lint           # oxlint + eslint
npm run generate       # regenerate src/lib/generated/ from the manifest
npm run docs:generate  # regenerate docs/components/ from the manifest
npm run build:lib      # build the publishable package into dist/
```

## Como contribuir

Relatos de bugs, correções na documentação e pull requests são bem-vindos. Veja o [guia de contribuição](./CONTRIBUTING.md) para a configuração, as regras básicas e a checklist antes da PR, além do [código de conduta](./CODE_OF_CONDUCT.md). Para reportar uma vulnerabilidade, veja a [política de segurança](./SECURITY.md).

## Publicação de versões

As versões são publicadas a partir da `main` com o push de uma tag de versão. O [`release.yml`](../../.github/workflows/release.yml) cuida do resto: verificações, `npm publish` com procedência (provenance) via npm Trusted Publishing e uma GitHub Release cujas notas vêm do `CHANGELOG.md`.

<details>
<summary><strong>Passos para publicar uma versão (mantenedores)</strong></summary>

1. No [`CHANGELOG.md`](../../CHANGELOG.md), mova as entradas de `## [Unreleased]` para um novo título `## [x.y.z] - YYYY-MM-DD` e atualize os links de comparação no final do arquivo. As PRs de sincronização do polaris-types registram ali automaticamente os componentes adicionados/removidos; adicione à mão as mudanças de props, slots e ícones (remoções são mudanças incompatíveis).
2. `npm version x.y.z --no-git-tag-version`, faça commit dos dois arquivos e faça push para a `main`.
3. `git tag vx.y.z && git push origin vx.y.z`. Tags com sufixo de pré-lançamento (por exemplo, `v0.3.0-rc.0`) são publicadas sob o dist-tag `next`.

</details>

## Licença

[MIT](../../LICENSE). Este projeto não é afiliado à Shopify nem endossado por ela.
