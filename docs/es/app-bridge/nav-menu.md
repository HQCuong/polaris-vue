---
title: "NavMenu (ui-nav-menu) – App Bridge para Vue 3"
description: "Navegación de una app integrada de Shopify con Vue 3: Shopify documenta s-app-nav, que funciona como etiqueta sin wrapper, y NavMenu renderiza el antiguo ui-nav-menu de App Bridge."
---

# Navegación de la app {#app-nav}

Antes de empezar, consulta [Instalación](/es/app-bridge/#install).

La navegación de la app configura los elementos de navegación de tu app en el admin de Shopify, como lo describe la [referencia de NavMenu](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) de Shopify.

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

## Props y eventos {#reference}

### NavMenu (`ui-nav-menu`) {#reference-nav-menu}

`NavMenu` no tiene props ni emite eventos: `UINavMenuAttributes` solo define hijos, que `NavMenu` renderiza desde su slot por defecto. Los tipos no describen estos hijos.

| Slot | Descripción |
| --- | --- |
| `default` | Los enlaces de navegación, como `<a href="/" rel="home">` en el ejemplo de arriba. |

### `s-app-nav` {#reference-app-nav}

`s-app-nav` no tiene atributos en los tipos. Sus hijos son los elementos de navegación, dados como elementos de enlace: cada enlace crea un elemento en el menú de navegación de la app, y un enlace con `rel="home"` establece la página de inicio por defecto.

Los tipos describen los atributos de estos enlaces:

| Atributo | Tipo | Descripción |
| --- | --- | --- |
| `href` | `string` (obligatorio) | La ruta del elemento de navegación, relativa a tu app, como `/products` o `/settings`. Al hacer clic, la app navega a esta ruta sin recargar toda la página; debe coincidir con una ruta del enrutamiento de tu app. |
| `rel` | `"home"` | Marca el enlace como la página de inicio por defecto de la app. Ese enlace se oculta del menú de navegación, y solo un enlace debe tener `rel="home"`. |
| `children` | `string` | La etiqueta visible del elemento. Los tipos aconsejan etiquetas cortas (una o dos palabras) que nombren el destino, como "Products" o "Settings". |
