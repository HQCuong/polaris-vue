---
title: "NavMenu (ui-nav-menu) – Vue 3 向け App Bridge"
description: "Vue 3 で作る Shopify 埋め込みアプリのアプリナビゲーション。Shopify は s-app-nav を文書化しており、そのままのタグで使えます。NavMenu は旧来の App Bridge ui-nav-menu をレンダリングします。"
---

# アプリナビゲーション {#app-nav}

Shopify の [NavMenu リファレンス](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu)によると、アプリナビは Shopify 管理画面でアプリのナビゲーション項目を構成します。

Shopify は、アプリナビゲーションとして `<s-link>` を子に持つ `<s-app-nav>` を文書化しています。
[埋め込みアプリガイド](/ja/guide/shopify-embedded-app#app-navigation)と、Shopify の
[app nav リファレンス](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-nav)
を参照してください。これにも React コンポーネントはありません。Shopify の
[React 移行ガイド](https://shopify.dev/docs/api/app-bridge/migration-guide-react)
では、直接レンダリングするよう述べています。そのためこのライブラリにはこの要素のコンポーネントがなく、
生のタグは既存の `s-` の `isCustomElement` ルールでそのまま動作します。

`NavMenu` は、まだ使っているアプリ向けに、従来の `ui-nav-menu` をレンダリングします。

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

どちらの要素も Vue Router と組み合わせたときの動作は、まだ検証されていません。

## 例 {#examples}

これらの例は Shopify のドキュメントに基づいており、実際の管理画面ではまだテストされていません。

### Vue Router のルートからアプリナビゲーションを作る {#example-app-nav-routes}

管理画面のアプリナビゲーションとルートを 1 か所にまとめるために使います。リンクはルートテーブルから
レンダリングされます。

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

- サイドバーのアプリ名は、すでに `/` にリンクしています。Shopify が `rel="home"` のリンクを追加するのは、
  ホームページが `/app` のように別の場所にある場合だけです。このリンクはメニューには表示されません
  （[App nav](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav)）。
- リンクは入れ子にできません。ラベルは "Templates" や "Settings" のような短い名詞にします（同じページ）。
- `createWebHistory()` では、Vue Router は `history.pushState()` でルートを変更し、App Bridge は新しいパスを
  管理画面のアドレスバーに送ります
  （[Address bar sync](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api#address-bar-sync)）。
- Shopify の[ナビゲーション移行ガイド](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react/navigation)
  では、直接読み込み、戻る／進む、アクティブな項目がルートの変更に追従することを確認するよう求めています。

### 同じルートから作る NavMenu {#example-nav-menu-routes}

アプリがまだ `ui-nav-menu` を使っている場合に使います。

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

- これは前の例の `router.ts` を使います。`ui-nav-menu` の子は `<a>` 要素ですが、型にはそれ以上の説明はありません。

### Shopify 管理画面のページへリンクする {#example-admin-links}

アプリからマーチャントを、管理画面の商品、注文、顧客に移動させるために使います。

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

- `target="_top"` を付けた `shopify:` プロトコルで管理画面のページを開けます。`shopify://admin/orders` のような
  一覧ページか、"by appending the resource ID"（リソース ID を末尾に付ける）ことでリソースを指定します
  （[Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)）。
- `target="_blank"` は外部 URL を新しいタブで開き、管理画面は開いたままです（同じページ）。

### コードから移動する {#example-navigate-from-code}

作成したばかりのレコードを開くなど、操作の後にページへ移動するために使います。

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

- `router.push()` は `history.pushState()` を使い、App Bridge はこれに追従します。Shopify は、相対パスには
  `open('/settings', '_self')` も紹介しています
  （[Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)）。
- 保存バーが表示されている可能性がある場合は、先に非表示にするか、確認してください。
  [Vue Router で離れる前に確認する](/ja/app-bridge/save-bar#example-leave-confirmation)を参照してください。

## Props とイベント {#reference}

### NavMenu (`ui-nav-menu`) {#reference-nav-menu}

`NavMenu` には prop がなく、イベントも emit しません。`UINavMenuAttributes` は子だけを定義しており、`NavMenu` はそれをデフォルト slot からレンダリングします。型はこれらの子を説明していません。

| Slot | 説明 |
| --- | --- |
| `default` | 上の例の `<a href="/" rel="home">` のようなナビゲーションリンク。 |

### `s-app-nav` {#reference-app-nav}

型では `s-app-nav` に属性はありません。子はリンク要素として指定するナビゲーション項目です。各リンクがアプリのナビゲーションメニューに項目を 1 つ作り、`rel="home"` を持つリンク 1 つがデフォルトのランディングページを設定します。

型はこれらのリンクの属性を次のように説明しています。

| 属性 | 型 | 説明 |
| --- | --- | --- |
| `href` | `string` (必須) | ナビゲーション項目のパスで、`/products` や `/settings` のようなアプリ内の相対パスです。クリックするとページ全体を再読み込みせずにアプリがこのルートに移動します。アプリのルーティングにあるルートと一致させる必要があります。 |
| `rel` | `"home"` | リンクをアプリのデフォルトのランディングページとして指定します。そのリンクはナビゲーションメニューに表示されず、`rel="home"` を持つリンクは 1 つだけにします。 |
| `children` | `string` | 項目に表示されるラベル。型は、"Products" や "Settings" のように行き先を示す短いラベル（1〜2 語）を勧めています。 |
