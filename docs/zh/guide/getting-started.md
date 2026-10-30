---
title: 在 Vue 3 中快速开始使用 Shopify Polaris
description: 安装 polaris-vue-elements，加载 Shopify Polaris web components 运行时，并在 Vue 应用或 Shopify 应用中通过 v-model 使用 SButton、STextField 等带类型的 Vue 3 封装组件。
---

# 快速开始 {#getting-started}

`polaris-vue-elements` 是一组带类型的 Vue 3 组件，封装了 Shopify 的 Polaris web
components（`<s-button>`、`<s-text-field>`、`<s-modal>` 等）。这些 web components
本身在运行时从 Shopify 的 CDN 加载——本库只是在它们之上为你提供一层
带类型、符合 Vue 习惯的接口（props、events、v-model）。

## 1. 安装 {#_1-install}

```sh
npm install polaris-vue-elements
```

## 2. 加载 Polaris 运行时 {#_2-load-the-polaris-runtime}

这些 wrapper 组件只负责展示——它们并不包含真正的
自定义元素定义。你的宿主应用必须加载 Shopify 的 Polaris 运行时
脚本，由它在全局注册 `<s-*>` 元素：

```html
<!-- index.html -->
<!doctype html>
<html>
  <head>
    <script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

这适用于任何 Vue 应用，而不仅限于 Shopify 后台内部——这些组件是
普通的自定义元素，只要加载了该脚本就能渲染。

`polaris-2.js` 是 Shopify 的稳定通道，也是我们推荐在生产环境中使用的版本。
如果想固定到某个确切版本，或想了解运行时版本与
本库版本之间的关系，请参阅
[已知问题与注意事项](./quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version)。

### Polaris 2.0 与新版后台设计 {#polaris-2-0-and-the-new-admin-design}

Polaris 2.0 带来了 Shopify 后台的新视觉设计（颜色、字体、
间距和图标）。它已于 2026 年 10 月 22 日进入稳定版
（[公告](https://shopify.dev/changelog/posts/polaris-cdn-2-0-is-now-stable)）。
从 1.x 迁移需要主动选择：把 `polaris-1.js` 换成 `polaris-2.js` 即可。

- **无需修改代码。** 2.0 是一次视觉更新：其组件、props、
  events 和 slots 与 1.1 相同，只是新增了少量内容（例如
  `SThumbnail` 的 `loading` prop）。继续使用 `polaris-1.js` 的应用搭配这些 wrapper
  仍可正常工作；只有新增的内容需要 2.x 运行时。
- **它会跟随每个店铺的设计。** 在 Shopify 后台中，已启用
  新版后台设计的店铺会显示新外观，仍在旧版设计上的店铺则保留
  1.x 的外观。在后台之外，默认使用新外观，因此
  很容易在本地预览。
- **靠近视口底部的固定（fixed）或粘性（sticky）内容** 应使用
  `--shopify-safe-area-inset-bottom` CSS 变量预留空间
  （[environment API](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api)），
  以免被悬浮的 Sidekick 栏遮挡。
- **Built for Shopify 应用** 必须在 **2027 年 5 月 1 日** 之前
  匹配后台的新视觉风格。

## 3. 配置 Vite {#_3-configure-vite}

告诉 Vue 编译器把所有 `s-*` 标签视为自定义元素，而不是
尝试将其解析为 Vue 组件：

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

## 4. 你的第一个组件 {#_4-your-first-component}

从 `polaris-vue-elements` 导入组件，像使用其他 Vue
组件一样使用它们——props 和 events 都有完整的类型：

```vue
<script setup lang="ts">
import { SButton } from 'polaris-vue-elements'

function handleClick(): void {
  console.log('clicked')
}
</script>

<template>
  <SButton variant="primary" @click="handleClick">Save</SButton>
</template>
```

## 5. 表单组件上的 v-model {#_5-v-model-on-form-components}

类表单组件支持 `v-model`，并映射到该元素对应的底层
prop/event 组合（完整映射见 `src/lib/overrides.ts`——
文本类组件使用 `value`/`input`，`SCheckbox`/`SSwitch` 使用
`checked`/`change`，`SChoiceList` 使用 `values`/`change`，依此类推）：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { STextField } from 'polaris-vue-elements'

const name = ref('')
</script>

<template>
  <STextField v-model="name" label="Name" placeholder="Your name" />
</template>
```

## 6. 控制浮层（modal、popover、tooltip） {#_6-controlling-overlays-modal-popover-tooltip}

`SModal` 等浮层组件有两种控制方式：

**声明式**：在触发按钮上使用标准 HTML 的 `commandFor`/`command` 属性
——无需任何脚本：

```vue
<template>
  <SButton commandFor="demo-modal" command="--show">Open modal</SButton>

  <SModal id="demo-modal" heading="Demo modal">
    <SText>Modal content.</SText>
    <template #primary-action>
      <SButton variant="primary" command="--hide" commandFor="demo-modal">Close</SButton>
    </template>
  </SModal>
</template>
```

**命令式**：获取一个带类型的模板 ref，并通过 `$el` 调用底层
元素的方法：

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { SModal } from 'polaris-vue-elements'

const modalRef = useTemplateRef<InstanceType<typeof SModal>>('modal')

function openModal(): void {
  modalRef.value?.$el.showOverlay()
}
</script>

<template>
  <SModal ref="modal" id="demo-modal" heading="Demo modal">
    <SText>Modal content.</SText>
  </SModal>
</template>
```

## 7. 为原生 `<s-*>` 标签提供类型（可选） {#_7-typing-raw-s-tags-optional}

如果你更愿意继续使用 Polaris 自己的标签（`<s-button>`、`<s-text-field>` 等），
而不是改用 wrapper，本包同样可以为它们提供类型。只需在
`tsconfig.json` 中启用一次：

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/elements"]
  }
}
```

或者在 `env.d.ts` 等 `.d.ts` 文件中添加引用：

```ts
/// <reference types="polaris-vue-elements/elements" />
```

这会把所有 Polaris 标签加入 Vue 的 `GlobalComponents`，使 Volar 和 `vue-tsc`
像检查 wrapper 一样检查原生标签：联合类型的 props、带类型的 `@click` /
`@aftershow` 监听器，以及用于调用命令式方法的带类型元素。

```vue
<template>
  <!-- error: Type '"bogus"' is not assignable to type '"auto" | "primary" | … ' -->
  <s-button variant="bogus">Save</s-button>
</template>
```

这只涉及类型：运行时不会注册任何东西，所以请保留第 3 步中的 `isCustomElement`
设置。与 wrapper 相比有两点不同：

- **原生标签不支持 `v-model`。** 请自行绑定 `:value` 并监听 `@input` / `@change`，
  或者使用 wrapper 组件，它会为每个表单字段映射好对应的属性和
  事件。
- **不要与项目中为相同标签手写的 shim 同时使用**——
  两个类型不同的 `GlobalComponents['s-button']` 声明会发生冲突。
  启用此功能时请移除该 shim。

## 下一步 {#next-steps}

浏览[组件参考](/zh/components/)，查看每个 wrapper 完整的 prop/event 列表，
或者在亲自踩坑之前先阅读[已知问题与注意事项](/zh/guide/quirks)。

正在构建 Shopify 应用？请参阅[使用 Vue 3 构建 Shopify 嵌入式应用](/zh/guide/shopify-embedded-app)，
了解如何在 Vue 中加载 App Bridge、发送经过身份验证的请求以及使用 App Bridge API。
