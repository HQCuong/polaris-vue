---
title: "NavMenu (ui-nav-menu) – App Bridge для Vue 3"
description: "Навигация приложения для встроенного приложения Shopify в Vue 3: Shopify документирует s-app-nav, который работает как необработанный тег, а NavMenu отображает прежний ui-nav-menu из App Bridge."
---

# Навигация приложения {#app-nav}

Навигация приложения настраивает пункты навигации вашего приложения в админке Shopify, как её описывает [справочник NavMenu](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) Shopify.

Для навигации приложения Shopify документирует `<s-app-nav>` с дочерними `<s-link>`; см.
[руководство по встроенному приложению](/ru/guide/shopify-embedded-app#app-navigation) и
[справочник app nav](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-nav) Shopify.
React-компонента для него тоже нет; [руководство по миграции React](https://shopify.dev/docs/api/app-bridge/migration-guide-react)
Shopify советует отображать его напрямую. Поэтому в этой библиотеке для него нет компонента, а необработанный тег
работает с имеющимся правилом `isCustomElement` для `s-`.

`NavMenu` отображает прежний `ui-nav-menu`, для приложений, которые его всё ещё используют:

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

Как оба элемента работают вместе с Vue Router, ещё не проверено.

## Примеры {#examples}

Эти примеры следуют документации Shopify и ещё не проверены в реальной админке Shopify.

### Навигация приложения из маршрутов Vue Router {#example-app-nav-routes}

Используйте это, чтобы навигация приложения в админке и ваши маршруты были в одном месте: ссылки создаются
из таблицы маршрутов.

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

- Название приложения на боковой панели уже ведёт на `/`. Shopify добавляет ссылку с `rel="home"` только
  если главная страница находится в другом месте, например `/app`; эта ссылка скрыта из меню
  ([App nav](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav)).
- Ссылки нельзя вкладывать друг в друга, а подписи должны быть короткими существительными, например «Templates» или
  «Settings» (там же).
- При `createWebHistory()` Vue Router меняет маршруты через `history.pushState()`, а
  App Bridge передаёт каждый новый путь в адресную строку админки
  ([Address bar sync](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api#address-bar-sync)).
- [Руководство по миграции навигации](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react/navigation) Shopify
  просит проверить прямые загрузки, переходы назад и вперёд и то, что активный пункт следует за сменой
  маршрута.

### NavMenu из тех же маршрутов {#example-nav-menu-routes}

Используйте это, если ваше приложение всё ещё использует `ui-nav-menu`.

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

- Здесь используется `router.ts` из предыдущего примера. Дочерние элементы `ui-nav-menu` — это `<a>`;
  типы не описывают их подробнее.

### Ссылки на страницы админки Shopify {#example-admin-links}

Используйте это, чтобы отправить продавца из вашего приложения к товару, заказу или клиенту в админке.

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

- Протокол `shopify:` с `target="_top"` открывает страницы админки: страницы-списки, например
  `shopify://admin/orders`, или ресурс, «добавив ID ресурса»
  ([Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)).
- `target="_blank"` открывает внешний URL в новой вкладке, а админка остаётся открытой (там же).

### Переход из кода {#example-navigate-from-code}

Используйте это, чтобы перейти на страницу после действия, например открыть только что созданную запись.

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

- `router.push()` использует `history.pushState()`, за которым следит App Bridge. Shopify также
  документирует `open('/settings', '_self')` для относительного пути
  ([Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)).
- Если может быть показана панель сохранения (save bar), скройте её или сначала спросите; см.
  [Подтверждение перед уходом со страницы с Vue Router](/ru/app-bridge/save-bar#example-leave-confirmation).

## Пропсы и события {#reference}

### NavMenu (`ui-nav-menu`) {#reference-nav-menu}

У `NavMenu` нет пропсов и событий: `UINavMenuAttributes` определяет только дочерние элементы, которые `NavMenu` отображает из слота по умолчанию. Типы не описывают эти дочерние элементы.

| Слот | Описание |
| --- | --- |
| `default` | Ссылки навигации, например `<a href="/" rel="home">` в примере выше. |

### `s-app-nav` {#reference-app-nav}

У `s-app-nav` в типах нет атрибутов. Его дочерние элементы — пункты навигации в виде элементов-ссылок: каждая ссылка создаёт пункт в меню навигации приложения, а одна ссылка с `rel="home"` задаёт страницу, открывающуюся по умолчанию.

Типы описывают атрибуты этих ссылок:

| Атрибут | Тип | Описание |
| --- | --- | --- |
| `href` | `string` (обязательный) | Путь пункта навигации относительно вашего приложения, например `/products` или `/settings`. Клик переходит на этот маршрут без полной перезагрузки страницы; он должен совпадать с маршрутом в маршрутизации вашего приложения. |
| `rel` | `"home"` | Помечает ссылку как страницу, открывающуюся по умолчанию. Эта ссылка скрыта из меню навигации, и `rel="home"` должен быть только у одной ссылки. |
| `children` | `string` | Видимая подпись пункта. Типы советуют короткие подписи (одно-два слова), называющие место назначения, например «Products» или «Settings». |
