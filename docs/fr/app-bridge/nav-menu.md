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

## Exemples {#examples}

Ces exemples suivent la documentation de Shopify et n'ont pas encore été testés dans une interface d'administration réelle.

### Navigation de l'app à partir de vos routes Vue Router {#example-app-nav-routes}

Utilisez ceci pour garder la navigation de l'app dans l'admin et vos routes au même endroit : les liens sont générés
à partir de la table des routes.

::: code-group

```ts [router.ts]
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** The label of the route in the app nav. Routes without one are not in the nav. */
    navLabel?: string
  }
}

export const HOME_PATH = '/app'

export const routes: RouteRecordRaw[] = [
  { path: HOME_PATH, component: () => import('./pages/HomePage.vue') },
  {
    path: '/app/templates',
    component: () => import('./pages/TemplatesPage.vue'),
    meta: { navLabel: 'Templates' },
  },
  {
    path: '/app/settings',
    component: () => import('./pages/SettingsPage.vue'),
    meta: { navLabel: 'Settings' },
  },
  // Not in the nav: reached from the templates list.
  { path: '/app/templates/:id', component: () => import('./pages/TemplatePage.vue') },
]

export const router = createRouter({ history: createWebHistory(), routes })
```

```vue [App.vue]
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { HOME_PATH, routes } from './router'

const navLinks = routes.flatMap((route) =>
  route.meta?.navLabel ? [{ href: route.path, label: route.meta.navLabel }] : [],
)
</script>

<template>
  <s-app-nav>
    <s-link :href="HOME_PATH" rel="home">Home</s-link>
    <s-link v-for="link in navLinks" :key="link.href" :href="link.href">{{ link.label }}</s-link>
  </s-app-nav>
  <RouterView />
</template>
```

:::

- Le nom de l'app dans la barre latérale pointe déjà vers `/`. Shopify ajoute un lien `rel="home"` uniquement
  lorsque la page d'accueil est ailleurs, comme `/app` ; ce lien est masqué dans le menu
  ([App nav](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav)).
- Les liens ne peuvent pas être imbriqués, et les libellés doivent être des noms courts, comme "Templates" ou
  "Settings" (même page).
- Avec `createWebHistory()`, Vue Router change de route avec `history.pushState()`, et
  App Bridge envoie chaque nouveau chemin à la barre d'adresse de l'admin
  ([Address bar sync](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api#address-bar-sync)).
- Le [guide de migration de la navigation](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react/navigation) de Shopify
  demande de vérifier les chargements directs, l'avance et le retour, et que l'élément actif suive les changements
  de route.

### NavMenu à partir des mêmes routes {#example-nav-menu-routes}

Utilisez ceci si votre app utilise encore `ui-nav-menu`.

```vue
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NavMenu } from 'polaris-vue-elements/app-bridge'
import { HOME_PATH, routes } from './router'

const navLinks = routes.flatMap((route) =>
  route.meta?.navLabel ? [{ href: route.path, label: route.meta.navLabel }] : [],
)
</script>

<template>
  <NavMenu>
    <a :href="HOME_PATH" rel="home">Home</a>
    <a v-for="link in navLinks" :key="link.href" :href="link.href">{{ link.label }}</a>
  </NavMenu>
  <RouterView />
</template>
```

- Ceci utilise le `router.ts` de l'exemple précédent. Les enfants de `ui-nav-menu` sont des éléments `<a>` ;
  les types ne les décrivent pas davantage.

### Lien vers des pages de l'admin Shopify {#example-admin-links}

Utilisez ceci pour envoyer le marchand de votre app vers un produit, une commande ou un client dans l'admin.

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { SStack } from 'polaris-vue-elements'

const props = defineProps<{ productGid: string }>()

// 'gid://shopify/Product/123' → '123'
const productId = computed(() => props.productGid.split('/').pop() ?? '')
</script>

<template>
  <SStack direction="inline" gap="base">
    <a :href="`shopify://admin/products/${productId}`" target="_top">View in Shopify admin</a>
    <a href="shopify://admin/orders" target="_top">Orders</a>
    <a href="https://help.example.com" target="_blank">Help center</a>
  </SStack>
</template>
```

- Le protocole `shopify:` avec `target="_top"` ouvre des pages de l'admin : des pages d'index comme
  `shopify://admin/orders`, ou une ressource "by appending the resource ID"
  ([Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)).
- `target="_blank"` ouvre une URL externe dans un nouvel onglet, et l'admin reste ouvert (même page).

### Naviguer depuis le code {#example-navigate-from-code}

Utilisez ceci pour aller vers une page après une action, comme ouvrir un enregistrement que vous venez de créer.

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { SButton } from 'polaris-vue-elements'
import { useAppBridge } from 'polaris-vue-elements/app-bridge'

const router = useRouter()

async function createTemplate(): Promise<void> {
  const res = await fetch('/api/templates', { method: 'POST' })
  if (!res.ok) {
    useAppBridge().toast.show('Could not create the template', { isError: true })
    return
  }
  const { id } = (await res.json()) as { id: string }
  await router.push(`/app/templates/${encodeURIComponent(id)}`)
}
</script>

<template>
  <SButton variant="primary" @click="createTemplate">Create template</SButton>
</template>
```

- `router.push()` utilise `history.pushState()`, qu'App Bridge suit. Shopify documente aussi
  `open('/settings', '_self')` pour un chemin relatif
  ([Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)).
- Si une barre d'enregistrement peut être affichée, masquez-la ou demandez d'abord ; voir
  [Demander avant de quitter avec Vue Router](/fr/app-bridge/save-bar#example-leave-confirmation).

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
