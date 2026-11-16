---
title: "NavMenu (ui-nav-menu) – App Bridge para Vue 3"
description: "Navegação de um app incorporado da Shopify com Vue 3: a Shopify documenta o s-app-nav, que funciona como tag sem wrapper, e o NavMenu renderiza o antigo ui-nav-menu do App Bridge."
---

# Navegação do app {#app-nav}

Antes de começar, veja [Instalação](/pt/app-bridge/#install).

A navegação do app configura os itens de navegação do seu app no admin da Shopify, como descreve a [referência do NavMenu](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) da Shopify.

A Shopify documenta o `<s-app-nav>` com filhos `<s-link>` para a navegação do app; veja o
[guia de apps incorporados](/pt/guide/shopify-embedded-app#app-navigation) e a
[referência de app nav](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-nav) da Shopify.
Ele também não tem componente React; o
[guia de migração para React](https://shopify.dev/docs/api/app-bridge/migration-guide-react) da Shopify
diz para renderizá-lo diretamente. Por isso esta biblioteca não tem um componente para ele, e a
tag sem wrapper funciona com a regra `isCustomElement` de `s-` que já existe.

`NavMenu` renderiza o antigo `ui-nav-menu`, para apps que ainda o usam:

```vue
<script setup lang="ts">
import { NavMenu } from 'polaris-vue-elements/app-bridge'
</script>

<template>
  <NavMenu>
    <a href="/" rel="home">Home</a>
    <a href="/templates">Templates</a>
  </NavMenu>
</template>
```

Ainda não foi verificado como qualquer um dos dois elementos funciona em conjunto com o Vue Router.

## Props e eventos {#reference}

### NavMenu (`ui-nav-menu`) {#reference-nav-menu}

`NavMenu` não tem props e não emite eventos: `UINavMenuAttributes` define apenas filhos, que o `NavMenu` renderiza a partir do slot padrão. Os tipos não descrevem esses filhos.

| Slot | Descrição |
| --- | --- |
| `default` | Os links de navegação, como `<a href="/" rel="home">` no exemplo acima. |

### `s-app-nav` {#reference-app-nav}

`s-app-nav` não tem atributos nos tipos. Seus filhos são os itens de navegação, dados como elementos de link: cada link cria um item no menu de navegação do app, e um link com `rel="home"` define a página inicial padrão.

Os tipos descrevem os atributos desses links:

| Atributo | Tipo | Descrição |
| --- | --- | --- |
| `href` | `string` (obrigatório) | O caminho do item de navegação, relativo ao seu app, como `/products` ou `/settings`. Ao clicar, o app navega para essa rota sem recarregar a página inteira; deve corresponder a uma rota no roteamento do seu app. |
| `rel` | `"home"` | Marca o link como a página inicial padrão do app. Esse link fica oculto no menu de navegação, e apenas um link deve ter `rel="home"`. |
| `children` | `string` | O rótulo visível do item. Os tipos recomendam rótulos curtos (uma ou duas palavras) que nomeiem o destino, como "Products" ou "Settings". |
