---
title: "Navigation de l'app"
description: "Shopify documente <s-app-nav> avec des enfants <s-link> pour la navigation de l'app ; voir le guide de l'app intégrée et la référence app nav de Shopify."
---

# Navigation de l'app {#app-nav}

Avant de commencer, consultez [Installation](/fr/app-bridge/#install).

Shopify documente `<s-app-nav>` avec des enfants `<s-link>` pour la navigation de l'app ; voir le
[guide de l'app intégrée](/fr/guide/shopify-embedded-app#app-navigation) et la
[référence app nav](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-nav) de Shopify.
Il n'existe pas non plus de composant React ; le
[guide de migration React](https://shopify.dev/docs/api/app-bridge/migration-guide-react)
de Shopify indique de le rendre directement. Cette bibliothèque n'a donc pas de composant pour lui, et la balise brute
fonctionne avec la règle `isCustomElement` existante pour `s-`.

`NavMenu` génère l'ancien `ui-nav-menu`, pour les apps qui l'utilisent encore :

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

Le fonctionnement de l'un ou l'autre de ces éléments avec Vue Router n'a pas encore été vérifié.
