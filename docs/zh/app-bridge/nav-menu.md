---
title: "NavMenu (ui-nav-menu) – 适用于 Vue 3 的 App Bridge"
description: "Vue 3 Shopify 嵌入式应用的应用导航：Shopify 记录的是 s-app-nav，可直接作为原生标签使用；NavMenu 渲染较早的 App Bridge ui-nav-menu。"
---

# 应用导航 {#app-nav}

按照 Shopify 的 [NavMenu 参考文档](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu)的描述，应用导航用于配置应用在 Shopify 后台中的导航项。

Shopify 记录的应用导航使用带有 `<s-link>` 子元素的 `<s-app-nav>`；请参阅
[嵌入式应用指南](/zh/guide/shopify-embedded-app#app-navigation)以及 Shopify 的
[app nav 参考文档](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-nav)。
它同样没有 React 组件；Shopify 的
[React 迁移指南](https://shopify.dev/docs/api/app-bridge/migration-guide-react)
说明应直接渲染它。因此本库没有为它提供组件，原生标签
可配合现有的 `s-` `isCustomElement` 规则使用。

`NavMenu` 渲染较旧的 `ui-nav-menu`，供仍在使用它的应用使用：

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

这两种元素如何与 Vue Router 配合使用，目前尚未验证。

## 示例 {#examples}

这些示例依据 Shopify 的文档编写，尚未在真实的后台中测试。

### 基于 Vue Router 路由的应用导航 {#example-app-nav-routes}

用于把后台的应用导航和你的路由放在同一个地方：链接根据路由表渲染。

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

- 侧边栏中的应用名称已经链接到 `/`。只有当主页在别处（例如 `/app`）时，
  Shopify 才会添加 `rel="home"` 链接；该链接不会显示在菜单中
  （[App nav](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav)）。
- 链接不能嵌套，标签应使用简短的名词，例如 “Templates” 或 “Settings”（同一页面）。
- 使用 `createWebHistory()` 时，Vue Router 通过 `history.pushState()` 更改路由，
  App Bridge 会把每个新路径发送到后台的地址栏
  （[Address bar sync](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api#address-bar-sync)）。
- Shopify 的[导航迁移指南](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react/navigation)
  要求你检查直接加载、后退和前进，以及当前项是否随路由更改而变化。

### 基于相同路由的 NavMenu {#example-nav-menu-routes}

如果你的应用仍在使用 `ui-nav-menu`，请使用这个示例。

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

- 这里使用上一个示例中的 `router.ts`。`ui-nav-menu` 的子元素是 `<a>`
  元素；类型中没有对它们作进一步描述。

### 链接到 Shopify 后台的页面 {#example-admin-links}

用于把商家从你的应用带到后台中的产品、订单或客户。

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

- 带 `target="_top"` 的 `shopify:` 协议会打开后台页面：例如 `shopify://admin/orders`
  这样的索引页，或者通过“追加资源 ID”打开某个资源
  （[Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)）。
- `target="_blank"` 会在新标签页中打开外部 URL，后台保持打开（同一页面）。

### 通过代码导航 {#example-navigate-from-code}

用于在某个操作之后跳转到页面，例如打开刚创建的记录。

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

- `router.push()` 使用 `history.pushState()`，App Bridge 会跟随它。Shopify 还记录了用于
  相对路径的 `open('/settings', '_self')`
  （[Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)）。
- 如果保存栏可能正在显示，请先隐藏它或先询问；参见
  [使用 Vue Router 时离开前先询问](/zh/app-bridge/save-bar#example-leave-confirmation)。

## Props 和事件 {#reference}

### NavMenu (`ui-nav-menu`) {#reference-nav-menu}

`NavMenu` 没有 prop，也不触发事件：`UINavMenuAttributes` 只定义了子元素，`NavMenu` 从默认 slot 渲染它们。类型没有描述这些子元素。

| Slot | 说明 |
| --- | --- |
| `default` | 导航链接，例如上面示例中的 `<a href="/" rel="home">`。 |

### `s-app-nav` {#reference-app-nav}

在类型中，`s-app-nav` 没有属性。它的子元素是以链接元素给出的导航项：每个链接在应用的导航菜单中创建一项，带有 `rel="home"` 的那个链接设置默认着陆页。

类型对这些链接的属性描述如下：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `href` | `string` (必填) | 导航项的路径，是应用内的相对路径，例如 `/products` 或 `/settings`。点击后应用会导航到该路由而不重新加载整个页面；它应与应用路由中的某个路由匹配。 |
| `rel` | `"home"` | 将该链接标记为应用的默认着陆页。该链接会在导航菜单中隐藏，并且只应有一个链接带有 `rel="home"`。 |
| `children` | `string` | 导航项显示的标签。类型建议使用简短的标签（一到两个词），用名词说明目的地，例如 "Products" 或 "Settings"。 |
