---
title: 使用 Vue 3 构建 Shopify 嵌入式应用
description: 使用 Vue 3 和 Vite 构建 Shopify 应用——加载 App Bridge 与 Polaris web components，为发往后端的 fetch 请求进行身份验证，并在 App Home 中使用带类型的 s-* 组件。
---

# 使用 Vue 3 构建 Shopify 嵌入式应用 {#build-a-shopify-embedded-app-with-vue-3}

嵌入式应用（Shopify 将其 UI 称为
[App Home](https://shopify.dev/docs/apps/build/app-home)）是一个由你自己托管、
由 Shopify 在后台内的 iframe 中渲染的 Web 应用。你可以使用
任何 Web 框架来构建它，包括 Vue 3。

在运行时，Shopify 会从其 CDN 提供两样东西：

- **App Bridge**（`app-bridge.js`）将你的 iframe 连接到后台，并暴露
  全局 `shopify` 对象（toast、modal、导航、会话令牌等）。
- **Polaris web components**（`polaris-2.js`）注册 `<s-*>` 自定义元素。

`polaris-vue-elements` 在这些元素之上提供带类型的 Vue 3 组件（`SPage`、`STextField`、`SModal` 等）。
它是一个社区项目，并非由 Shopify 出品。

Shopify 自己的文档和模板面向 React，因此本指南只介绍与 Vue 相关的
部分。阅读前请先完成[快速开始](/zh/guide/getting-started)。

## 架构 {#architecture}

- **前端：** 一个 Vue 3 + Vite 单页应用，部署在你可控的 URL 上。Shopify
  会在后台的 iframe 中加载它。
- **后端：** 任何能够验证 Shopify ID 令牌并调用 Admin API 的服务器。
  身份验证使用
  [令牌交换（token exchange）](https://shopify.dev/docs/apps/build/authentication-authorization/set-embedded-app-authorization)：
  前端发送 ID 令牌，后端验证后将其换取为
  访问令牌。

`shopify app init` 会生成一个 React Router 应用；Shopify 并未提供 Vue 或其他
非 React 的模板。对于其他技术栈，Shopify 会引导你参阅其身份验证文档，
以及对应语言的官方 API 库（其中有一个不依赖任何框架的 Node.js 库）。
一种实用的结构是：按你喜欢的方式搭建后端，
再像下文所述那样单独构建 Vue 应用。

在 `shopify.app.toml` 中，通过 `embedded = true` 将应用设为嵌入式，并让 `application_url`
指向应用的部署地址。

## 1. 加载 App Bridge 和 Polaris {#_1-load-app-bridge-and-polaris}

在 `index.html` 的 `<head>` 中添加 `shopify-api-key` meta 标签（即应用的 client ID）
以及两个脚本：

```html
<!-- index.html -->
<!doctype html>
<html>
  <head>
    <meta name="shopify-api-key" content="%VITE_SHOPIFY_API_KEY%" />
    <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
    <script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Vite 会用环境中的值替换 `index.html` 中的 `%VITE_*%` 变量
（例如 `.env` 中的 `VITE_SHOPIFY_API_KEY`）。你也可以改为由
服务器注入该 key。

App Bridge 不与 Polaris 一起版本化：它的 URL 不带版本号，始终加载
最新的 App Bridge。关于 Polaris 的各个通道（`polaris-2.js`、固定版本），请参阅
[已知问题](/zh/guide/quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version)。

请从 Shopify 后台打开应用（例如 `shopify app dev` 输出的预览 URL）。
如果直接在浏览器标签页中加载，外层没有后台环境，
App Bridge 的功能将无法使用。

若要以带类型的方式访问全局 `shopify`，请安装 Shopify 的类型包并
引用它（Shopify 为此提供了 `@shopify/app-bridge-types`）：

```sh
npm install -D @shopify/app-bridge-types
```

```ts
// env.d.ts
/// <reference types="@shopify/app-bridge-types" />
```

## 2. 配置 Vite {#_2-configure-vite}

将 `s-*` 标签视为自定义元素。这与
[快速开始](/zh/guide/getting-started#_3-configure-vite)中的配置相同：

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('s-'),
        },
      },
    }),
  ],
})
```

## 3. 构建一个页面 {#_3-build-a-page}

这个页面包含一个使用 `v-model` 的表单、一个调用后端的保存按钮，以及一个
用于确认重置的 modal。`SModal` 通过 `commandFor`/`command` 以声明式方式打开；
请参阅 [`SModal`](/zh/components/s-modal) 和
[modal 操作 slot 的注意事项](/zh/guide/quirks#_2-modal-action-slots-only-accept-specific-button-variants)。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, SCheckbox, SModal, SPage, SSection, SStack, SText, STextField } from 'polaris-vue-elements'

const title = ref('')
const enabled = ref(true)
const saving = ref(false)

async function save(): Promise<void> {
  saving.value = true
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.value, enabled: enabled.value }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    shopify.toast.show('Settings saved')
  } catch {
    shopify.toast.show('Could not save settings', { isError: true })
  } finally {
    saving.value = false
  }
}

function reset(): void {
  title.value = ''
  enabled.value = true
}
</script>

<template>
  <SPage heading="Settings">
    <SSection heading="Widget">
      <SStack gap="base">
        <STextField v-model="title" label="Title" placeholder="Welcome" />
        <SCheckbox v-model="enabled" label="Enabled" />
        <SStack direction="inline" gap="base">
          <SButton variant="primary" :loading="saving" @click="save">Save</SButton>
          <SButton commandFor="reset-modal" command="--show">Reset</SButton>
        </SStack>
      </SStack>
    </SSection>

    <SModal id="reset-modal" heading="Reset settings?">
      <SText>This restores the default values.</SText>
      <template #primary-action>
        <SButton variant="primary" commandFor="reset-modal" command="--hide" @click="reset">Reset</SButton>
      </template>
      <template #secondary-actions>
        <SButton variant="secondary" commandFor="reset-modal" command="--hide">Cancel</SButton>
      </template>
    </SModal>
  </SPage>
</template>
```

## 4. 与后端通信 {#_4-talk-to-your-backend}

通常你无需自己附加令牌。App Bridge 会拦截 `fetch()`，对于
发往应用所在域名及其子域名的请求，在 `Authorization` 请求头中添加 ID 令牌
（并在 `Accept-Language` 中附上店铺的语言区域）。直接使用相对路径调用即可：

```ts
const response = await fetch('/api/products')
const data = await response.json()
```

在服务器端：

- 对每个请求都验证 ID 令牌：使用 client secret 校验 HS256 签名，检查 `exp`
  和 `nbf`，`aud` 必须等于你的 client ID，且 `iss` 与 `dest` 的主机名必须匹配。
  验证失败时返回 `401`。
- ID 令牌一分钟后过期，并且属于 bearer 凭据：只能将其发送到你
  自己的后端。
- 将 ID 令牌换取为访问令牌以调用 Admin API，并将该令牌
  保存在服务器端。

只有当拦截器无法覆盖某个请求时（例如 WebSocket 连接），
才需要自己调用 `shopify.idToken()`：

```ts
const token = await shopify.idToken()
const socket = new WebSocket(`wss://your-app.example.com/ws?token=${token}`)
```

如果你的应用只需要 GraphQL Admin API，在应用配置中启用 Direct API access 后，
App Bridge 可以通过后台转发
`fetch('shopify:admin/api/graphql.json', ...)`，而无需你自己的后端。请参阅
[Resource fetching](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/resource-fetching-api)。

## 5. 在 Vue 中使用 App Bridge API {#_5-use-app-bridge-apis-from-vue}

所有功能都位于全局 `shopify` 上；无需任何 Vue 插件。

### Toast {#toasts}

```ts
shopify.toast.show('Product saved', {
  duration: 5000,
  action: 'Undo',
  onAction: () => undoSave(),
})
```

`show(message, options)` 接受 `duration`（毫秒）、`isError`、`action`、`onAction` 和
`onDismiss`，并返回一个 id，可传给 `shopify.toast.hide(id)`。

### 通过 id 控制 modal {#modals-by-id}

除了 `commandFor` 之外，`shopify.modal` 也可以通过 `id` 控制 `SModal`：

```ts
await shopify.modal.show('reset-modal')
await shopify.modal.hide('reset-modal')
```

### 应用导航 {#app-navigation}

`<s-app-nav>` 会在后台侧边栏中渲染应用的导航。请让它挂载在
应用根部附近，例如 `App.vue` 中：

```vue
<template>
  <s-app-nav>
    <s-link href="/">Home</s-link>
    <s-link href="/settings">Settings</s-link>
  </s-app-nav>
  <RouterView />
</template>
```

当前激活项由当前 URL 推导得出。若要在代码中进行导航，Shopify 的
[Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)
介绍了锚点链接、`open('/settings', '_self')` 以及 History API
（`history.pushState`）等方式。

### 保存栏 {#save-bar}

给 `<form>` 添加 `data-save-bar` 后，当表单存在未保存的更改时，后台会显示保存栏；
点击 Save 时触发 `submit`，点击 Discard 时触发 `reset`。不要在同一个表单上
将其与编程式的 `shopify.saveBar` 方法混用。请参阅
[Save bar](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api)。

## 下一步 {#next-steps}

- 浏览[所有组件](/zh/components/)，并阅读[已知问题](/zh/guide/quirks)。
- 回顾[快速开始](/zh/guide/getting-started)，了解 `v-model`、浮层以及为原生标签提供类型。
- 阅读 Shopify 的 [App Home 文档](https://shopify.dev/docs/apps/build/app-home)和
  [App Bridge API](https://shopify.dev/docs/api/app-home/apis)。
