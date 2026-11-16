---
title: "NavMenu (ui-nav-menu) – Vue 3용 App Bridge"
description: "Vue 3로 만드는 Shopify 임베디드 앱의 앱 내비게이션: Shopify는 s-app-nav를 문서화하며 이 태그는 그대로 사용할 수 있고, NavMenu는 이전 App Bridge ui-nav-menu를 렌더링합니다."
---

# 앱 내비게이션 {#app-nav}

Shopify의 [NavMenu 레퍼런스](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu)에 따르면, 앱 내비게이션은 Shopify 관리자에서 앱의 내비게이션 항목을 구성합니다.

Shopify는 앱 내비게이션에 `<s-link>` 자식을 가진 `<s-app-nav>`를 문서화합니다.
[임베디드 앱 가이드](/ko/guide/shopify-embedded-app#app-navigation)와 Shopify의
[app nav 참고 문서](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-nav)를 참고하세요.
이 요소에도 React 컴포넌트는 없으며, Shopify의
[React 마이그레이션 가이드](https://shopify.dev/docs/api/app-bridge/migration-guide-react)는
직접 렌더링하라고 안내합니다. 따라서 이 라이브러리에는 이를 위한 컴포넌트가 없으며, 원시 태그는
기존의 `s-` `isCustomElement` 규칙으로 동작합니다.

`NavMenu`는 이전 방식인 `ui-nav-menu`를 렌더링하며, 아직 이를 사용하는 앱을 위한 것입니다.

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

두 요소가 Vue Router와 함께 어떻게 동작하는지는 아직 확인되지 않았습니다.

## 예제 {#examples}

이 예제들은 Shopify 문서를 따랐으며, 실제 관리자에서는 아직 테스트하지 않았습니다.

### Vue Router 라우트로 만드는 앱 내비게이션 {#example-app-nav-routes}

관리자의 앱 내비게이션과 라우트를 한 곳에서 관리할 때 사용합니다. 링크는 라우트 테이블에서
렌더링됩니다.

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

- 사이드바의 앱 이름은 이미 `/`로 연결됩니다. Shopify는 홈 페이지가 `/app`처럼 다른 곳에 있을 때만
  `rel="home"` 링크를 추가하며, 이 링크는 메뉴에서 숨겨집니다
  ([앱 내비게이션](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav)).
- 링크는 중첩할 수 없으며, 레이블은 "Templates"나 "Settings"처럼 짧은 명사여야 합니다(같은 페이지).
- `createWebHistory()`에서 Vue Router는 `history.pushState()`로 라우트를 바꾸고, App Bridge는 새
  경로를 관리자의 주소 표시줄로 보냅니다
  ([주소 표시줄 동기화](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api#address-bar-sync)).
- Shopify의 [내비게이션 마이그레이션 가이드](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react/navigation)는
  직접 로드, 뒤로 가기와 앞으로 가기, 라우트가 바뀔 때 활성 항목이 따라가는지 확인하라고 안내합니다.

### 같은 라우트로 만드는 NavMenu {#example-nav-menu-routes}

앱이 아직 `ui-nav-menu`를 사용한다면 사용합니다.

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

- 이 예제는 이전 예제의 `router.ts`를 사용합니다. `ui-nav-menu`의 자식은 `<a>` 요소이며, 타입은
  이에 대해 더 설명하지 않습니다.

### Shopify 관리자 페이지로 연결하기 {#example-admin-links}

앱에서 관리자의 상품, 주문 또는 고객으로 판매자를 보낼 때 사용합니다.

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

- `target="_top"`과 함께 쓰는 `shopify:` 프로토콜은 관리자 페이지를 엽니다. `shopify://admin/orders`
  같은 인덱스 페이지나, "리소스 ID를 덧붙여" 리소스를 열 수 있습니다
  ([Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)).
- `target="_blank"`는 외부 URL을 새 탭에서 열고 관리자는 그대로 열려 있습니다(같은 페이지).

### 코드에서 이동하기 {#example-navigate-from-code}

방금 만든 레코드를 여는 것처럼, 작업 후 페이지로 이동할 때 사용합니다.

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

- `router.push()`는 App Bridge가 따라가는 `history.pushState()`를 사용합니다. Shopify는 상대 경로에
  `open('/settings', '_self')`도 문서화합니다
  ([Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)).
- 저장 바가 표시 중일 수 있다면 먼저 숨기거나 확인하세요.
  [Vue Router로 이동하기 전에 확인하기](/ko/app-bridge/save-bar#example-leave-confirmation)를 참고하세요.

## Props와 이벤트 {#reference}

### NavMenu (`ui-nav-menu`) {#reference-nav-menu}

`NavMenu`에는 prop이 없고 이벤트도 emit하지 않습니다. `UINavMenuAttributes`는 자식만 정의하며, `NavMenu`는 이를 기본 slot에서 렌더링합니다. 타입은 이 자식을 설명하지 않습니다.

| Slot | 설명 |
| --- | --- |
| `default` | 위 예시의 `<a href="/" rel="home">` 같은 내비게이션 링크입니다. |

### `s-app-nav` {#reference-app-nav}

타입에서 `s-app-nav`에는 속성이 없습니다. 자식은 링크 요소로 제공되는 내비게이션 항목입니다. 각 링크는 앱 내비게이션 메뉴에 항목을 하나 만들고, `rel="home"`이 있는 링크 하나가 기본 랜딩 페이지를 설정합니다.

타입은 이 링크의 속성을 다음과 같이 설명합니다.

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `href` | `string` (필수) | 내비게이션 항목의 경로로, `/products`나 `/settings`처럼 앱 안의 상대 경로입니다. 클릭하면 전체 페이지를 다시 로드하지 않고 앱이 이 라우트로 이동하며, 앱의 라우팅에 있는 라우트와 일치해야 합니다. |
| `rel` | `"home"` | 링크를 앱의 기본 랜딩 페이지로 지정합니다. 그 링크는 내비게이션 메뉴에서 숨겨지며, `rel="home"`은 링크 하나에만 있어야 합니다. |
| `children` | `string` | 항목에 표시되는 라벨입니다. 타입은 "Products"나 "Settings"처럼 목적지를 가리키는 짧은 라벨(한두 단어)을 권장합니다. |
