---
title: "NavMenu (ui-nav-menu) – App Bridge pour Vue 3"
description: "Navigation d'une app Shopify intégrée en Vue 3 : Shopify documente s-app-nav, qui fonctionne comme balise brute, et NavMenu génère l'ancien élément App Bridge ui-nav-menu."
---

# Navigation de l'app {#app-nav}

La navigation de l'app configure les éléments de navigation de votre app dans l'interface d'administration Shopify, comme le décrit la [référence NavMenu](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) de Shopify.

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

## Props et événements {#reference}

### NavMenu (`ui-nav-menu`) {#reference-nav-menu}

`NavMenu` n'a pas de props et n'émet aucun événement : `UINavMenuAttributes` ne définit que des enfants, que `NavMenu` rend depuis son slot par défaut. Les types ne décrivent pas ces enfants.

| Slot | Description |
| --- | --- |
| `default` | Les liens de navigation, comme `<a href="/" rel="home">` dans l'exemple ci-dessus. |

### `s-app-nav` {#reference-app-nav}

`s-app-nav` n'a aucun attribut dans les types. Ses enfants sont les éléments de navigation, fournis comme éléments de lien : chaque lien crée un élément dans le menu de navigation de l'app, et un lien avec `rel="home"` définit la page d'accueil par défaut.

Les types décrivent les attributs de ces liens :

| Attribut | Type | Description |
| --- | --- | --- |
| `href` | `string` (obligatoire) | Le chemin de l'élément de navigation, relatif à votre app, comme `/products` ou `/settings`. Un clic fait naviguer l'app vers cette route sans recharger toute la page ; il doit correspondre à une route du routage de votre app. |
| `rel` | `"home"` | Marque le lien comme page d'accueil par défaut de l'app. Ce lien est masqué dans le menu de navigation, et un seul lien doit avoir `rel="home"`. |
| `children` | `string` | Le libellé visible de l'élément. Les types conseillent des libellés courts (un ou deux mots) qui nomment la destination, comme "Products" ou "Settings". |
