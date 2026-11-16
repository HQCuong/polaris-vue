---
title: "NavMenu (ui-nav-menu) – App Bridge para Vue 3"
description: "Navegação de um app incorporado da Shopify com Vue 3: a Shopify documenta o s-app-nav, que funciona como tag sem wrapper, e o NavMenu renderiza o antigo ui-nav-menu do App Bridge."
---

# Navegação do app {#app-nav}

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

## Exemplos {#examples}

Estes exemplos seguem a documentação da Shopify e ainda não foram testados em um admin real.

### Navegação do app a partir das suas rotas do Vue Router {#example-app-nav-routes}

Use isto para manter a navegação do app no admin e as suas rotas em um só lugar: os links são renderizados
a partir da tabela de rotas.

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

- O nome do app na barra lateral já aponta para `/`. A Shopify adiciona um link `rel="home"` apenas
  quando a página inicial fica em outro lugar, como `/app`; esse link fica oculto no menu
  ([App nav](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav)).
- Os links não podem ser aninhados, e os rótulos devem ser substantivos curtos, como "Templates" ou
  "Settings" (mesma página).
- Com `createWebHistory()`, o Vue Router muda de rota com `history.pushState()`, e
  o App Bridge envia cada novo caminho para a barra de endereço do admin
  ([Address bar sync](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api#address-bar-sync)).
- O [guia de migração da navegação](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react/navigation)
  da Shopify pede que você verifique carregamentos diretos, voltar e avançar, e se o item ativo acompanha as
  mudanças de rota.

### NavMenu a partir das mesmas rotas {#example-nav-menu-routes}

Use isto se o seu app ainda usa `ui-nav-menu`.

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

- Este exemplo usa o `router.ts` do exemplo anterior. Os filhos de `ui-nav-menu` são elementos
  `<a>`; os tipos não os descrevem além disso.

### Link para páginas do admin da Shopify {#example-admin-links}

Use isto para enviar o lojista do seu app a um produto, pedido ou cliente no admin.

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

- O protocolo `shopify:` com `target="_top"` abre páginas do admin: páginas de índice como
  `shopify://admin/orders`, ou um recurso "acrescentando o ID do recurso"
  ([Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)).
- `target="_blank"` abre uma URL externa em uma nova aba, e o admin continua aberto (mesma página).

### Navegar a partir do código {#example-navigate-from-code}

Use isto para ir a uma página depois de uma ação, como abrir um registro que você acabou de criar.

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

- `router.push()` usa `history.pushState()`, que o App Bridge acompanha. A Shopify também
  documenta `open('/settings', '_self')` para um caminho relativo
  ([Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)).
- Se uma barra de salvamento puder estar visível, oculte-a ou pergunte antes; veja
  [Perguntar antes de sair com o Vue Router](/pt/app-bridge/save-bar#example-leave-confirmation).

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
