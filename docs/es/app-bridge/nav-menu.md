---
title: "NavMenu (ui-nav-menu) – App Bridge para Vue 3"
description: "Navegación de una app integrada de Shopify con Vue 3: Shopify documenta s-app-nav, que funciona como etiqueta sin wrapper, y NavMenu renderiza el antiguo ui-nav-menu de App Bridge."
---

# Navegación de la app {#app-nav}

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

## Ejemplos {#examples}

Estos ejemplos siguen la documentación de Shopify y todavía no se han probado en un admin real.

### Navegación de la app a partir de tus rutas de Vue Router {#example-app-nav-routes}

Úsalo para mantener la navegación de la app del admin y tus rutas en un solo lugar: los enlaces se renderizan
a partir de la tabla de rutas.

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

- El nombre de la app en la barra lateral ya enlaza a `/`. Shopify añade un enlace `rel="home"` solo
  cuando la página de inicio está en otro lugar, como `/app`; ese enlace se oculta del menú
  ([App nav](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav)).
- Los enlaces no se pueden anidar, y las etiquetas deben ser sustantivos cortos, como "Templates" o
  "Settings" (misma página).
- Con `createWebHistory()`, Vue Router cambia de ruta con `history.pushState()`, y
  App Bridge envía cada nueva ruta a la barra de direcciones del admin
  ([Address bar sync](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api#address-bar-sync)).
- La [guía de migración de navegación](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react/navigation) de Shopify
  pide comprobar las cargas directas, atrás y adelante, y que el elemento activo siga los cambios
  de ruta.

### NavMenu a partir de las mismas rutas {#example-nav-menu-routes}

Úsalo si tu app todavía usa `ui-nav-menu`.

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
- Esto usa el `router.ts` del ejemplo anterior. Los hijos de `ui-nav-menu` son elementos `<a>`;
  los tipos no los describen más.

### Enlazar a páginas del admin de Shopify {#example-admin-links}

Úsalo para llevar al comerciante desde tu app a un producto, pedido o cliente en el admin.

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
- El protocolo `shopify:` con `target="_top"` abre páginas del admin: páginas de índice como
  `shopify://admin/orders`, o un recurso "añadiendo el ID del recurso"
  ([Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)).
- `target="_blank"` abre una URL externa en una pestaña nueva, y el admin sigue abierto (misma página).

### Navegar desde el código {#example-navigate-from-code}

Úsalo para ir a una página después de una acción, como abrir un registro que acabas de crear.

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
- `router.push()` usa `history.pushState()`, que App Bridge sigue. Shopify también
  documenta `open('/settings', '_self')` para una ruta relativa
  ([Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)).
- Si puede haber una barra de guardado visible, ocúltala o pregunta antes; consulta
  [Preguntar antes de salir con Vue Router](/es/app-bridge/save-bar#example-leave-confirmation).

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
