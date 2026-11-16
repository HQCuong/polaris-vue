---
title: "NavMenu (ui-nav-menu) – App Bridge para Vue 3"
description: "Navegación de una app integrada de Shopify con Vue 3: Shopify documenta s-app-nav, que funciona como etiqueta sin wrapper, y NavMenu renderiza el antiguo ui-nav-menu de App Bridge."
---

# Navegación de la app {#app-nav}

Antes de empezar, consulta [Instalación](/es/app-bridge/#install).

Shopify documenta `<s-app-nav>` con hijos `<s-link>` para la navegación de la app; consulta la
[guía de apps integradas](/es/guide/shopify-embedded-app#app-navigation) y la
[referencia de app nav](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-nav) de Shopify.
Tampoco tiene componente de React; la
[guía de migración a React](https://shopify.dev/docs/api/app-bridge/migration-guide-react) de Shopify
indica que se renderice directamente. Por eso esta biblioteca no tiene un componente para él, y la
etiqueta sin wrapper funciona con la regla `isCustomElement` de `s-` que ya existe.

`NavMenu` renderiza el antiguo `ui-nav-menu`, para las apps que todavía lo usan:

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

Todavía no se ha verificado cómo funciona cualquiera de los dos elementos junto con Vue Router.
