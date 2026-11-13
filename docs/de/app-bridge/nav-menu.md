---
title: App-Navigation
description: Shopify dokumentiert <s-app-nav> mit <s-link>-Kindern für die App-Navigation; siehe die Anleitung zu eingebetteten Apps und Shopifys App-Nav-Referenz.
---

# App-Navigation {#app-nav}

Bevor Sie beginnen, lesen Sie [Installation](/de/app-bridge/#install).

Shopify dokumentiert `<s-app-nav>` mit `<s-link>`-Kindern für die App-Navigation; siehe die
[Anleitung zu eingebetteten Apps](/de/guide/shopify-embedded-app#app-navigation) und Shopifys
[App-Nav-Referenz](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-nav).
Auch dafür gibt es keine React-Komponente; Shopifys
[React-Migrationsanleitung](https://shopify.dev/docs/api/app-bridge/migration-guide-react)
sagt, man solle es direkt rendern. Deshalb hat diese Bibliothek keine Komponente dafür, und das rohe Tag
funktioniert mit der vorhandenen `isCustomElement`-Regel für `s-`.

`NavMenu` rendert das ältere `ui-nav-menu`, für Apps, die es noch verwenden:

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

Wie beide Elemente mit Vue Router zusammenarbeiten, wurde noch nicht verifiziert.
