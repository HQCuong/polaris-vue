---
title: Navegação do app
description: A Shopify documenta o <s-app-nav> com filhos <s-link> para a navegação do app; veja o guia de apps incorporados e a referência de app nav da Shopify.
---

# Navegação do app {#app-nav}

Antes de começar, veja [Instalação](/pt/app-bridge/#install).

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
