---
title: "NavMenu (ui-nav-menu) – App Bridge für Vue 3"
description: "App-Navigation einer eingebetteten Shopify-App mit Vue 3: Shopify dokumentiert s-app-nav, das als rohes Tag funktioniert; NavMenu rendert das ältere App-Bridge-Element ui-nav-menu."
---

# App-Navigation {#app-nav}

Die App-Navigation konfiguriert die Navigationseinträge Ihrer App im Shopify-Adminbereich, wie Shopifys [NavMenu-Referenz](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) es beschreibt.

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

## Beispiele {#examples}

Diese Beispiele folgen der Dokumentation von Shopify und wurden noch nicht in einem Live-Adminbereich getestet.

### App-Navigation aus Ihren Vue-Router-Routen {#example-app-nav-routes}

Verwenden Sie dies, um die App-Navigation des Adminbereichs und Ihre Routen an einer Stelle zu halten: Die Links werden
aus der Routentabelle gerendert.

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

- Der App-Name in der Seitenleiste verlinkt bereits auf `/`. Shopify fügt nur dann einen `rel="home"`-Link hinzu,
  wenn die Startseite woanders liegt, etwa unter `/app`; dieser Link wird im Menü ausgeblendet
  ([App nav](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav)).
- Links können nicht verschachtelt werden, und Labels sollten kurze Substantive sein, etwa "Templates" oder
  "Settings" (gleiche Seite).
- Mit `createWebHistory()` wechselt Vue Router Routen mit `history.pushState()`, und
  App Bridge sendet jeden neuen Pfad an die Adressleiste des Adminbereichs
  ([Address bar sync](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api#address-bar-sync)).
- Shopifys [Migrationsanleitung zur Navigation](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react/navigation)
  verlangt, dass Sie direktes Laden, Vor und Zurück sowie das Mitwandern des aktiven Eintrags bei Routenwechseln
  prüfen.

### NavMenu aus denselben Routen {#example-nav-menu-routes}

Verwenden Sie dies, wenn Ihre App noch `ui-nav-menu` nutzt.

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

- Dies verwendet die `router.ts` des vorigen Beispiels. Die Kinder von `ui-nav-menu` sind `<a>`-Elemente;
  die Typen beschreiben sie nicht näher.

### Auf Seiten des Shopify-Adminbereichs verlinken {#example-admin-links}

Verwenden Sie dies, um den Händler aus Ihrer App zu einem Produkt, einer Bestellung oder einem Kunden im Adminbereich zu schicken.

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

- Das Protokoll `shopify:` mit `target="_top"` öffnet Seiten des Adminbereichs: Übersichtsseiten wie
  `shopify://admin/orders` oder eine Ressource "durch Anhängen der Ressourcen-ID"
  ([Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)).
- `target="_blank"` öffnet eine externe URL in einem neuen Tab, und der Adminbereich bleibt geöffnet (gleiche Seite).

### Aus dem Code navigieren {#example-navigate-from-code}

Verwenden Sie dies, um nach einer Aktion zu einer Seite zu wechseln, etwa um einen soeben angelegten Datensatz zu öffnen.

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

- `router.push()` verwendet `history.pushState()`, dem App Bridge folgt. Shopify dokumentiert außerdem
  `open('/settings', '_self')` für einen relativen Pfad
  ([Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)).
- Wenn möglicherweise eine Speicherleiste angezeigt wird, blenden Sie sie aus oder fragen Sie vorher nach; siehe
  [Vor dem Verlassen mit Vue Router nachfragen](/de/app-bridge/save-bar#example-leave-confirmation).

## Props und Events {#reference}

### NavMenu (`ui-nav-menu`) {#reference-nav-menu}

`NavMenu` hat keine Props und emittiert keine Events: `UINavMenuAttributes` definiert nur Kinder, die `NavMenu` aus seinem Default-Slot rendert. Die Typen beschreiben diese Kinder nicht.

| Slot | Beschreibung |
| --- | --- |
| `default` | Die Navigationslinks, etwa `<a href="/" rel="home">` im Beispiel oben. |

### `s-app-nav` {#reference-app-nav}

`s-app-nav` hat in den Typen keine Attribute. Seine Kinder sind die Navigationseinträge, angegeben als Link-Elemente: Jeder Link erzeugt einen Eintrag im Navigationsmenü der App, und ein Link mit `rel="home"` legt die Standard-Startseite fest.

Die Typen beschreiben die Attribute dieser Links:

| Attribut | Typ | Beschreibung |
| --- | --- | --- |
| `href` | `string` (erforderlich) | Der Pfad des Navigationseintrags, relativ zu Ihrer App, etwa `/products` oder `/settings`. Ein Klick navigiert die App ohne vollständiges Neuladen der Seite zu dieser Route; er sollte einer Route im Routing Ihrer App entsprechen. |
| `rel` | `"home"` | Kennzeichnet den Link als Standard-Startseite der App. Dieser Link wird im Navigationsmenü ausgeblendet, und nur ein Link sollte `rel="home"` haben. |
| `children` | `string` | Die sichtbare Beschriftung des Eintrags. Die Typen empfehlen kurze Beschriftungen (ein oder zwei Wörter), die das Ziel benennen, etwa "Products" oder "Settings". |
