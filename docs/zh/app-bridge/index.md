---
title: 适用于 Vue 的 App Bridge 组件
description: 与 Shopify 的 @shopify/app-bridge-react 组件对应的 Vue 3 组件——Modal、SaveBar、AppWindow、TitleBar、NavMenu 和 useAppBridge——来自 polaris-vue-elements/app-bridge。
---

# 适用于 Vue 的 App Bridge 组件 {#app-bridge-components-for-vue}

`polaris-vue-elements/app-bridge` 提供了与 Shopify 的
[`@shopify/app-bridge-react`](https://www.npmjs.com/package/@shopify/app-bridge-react)
（版本 4.3.0）中的组件和 hook 对应的 Vue 3 组件与组合式函数。它们封装了由 App Bridge 脚本定义的
App Bridge 元素。
与 `polaris-vue-elements` 的其余部分一样，这是一个社区项目，并非由 Shopify 出品。

| Vue 导出 | 元素 | Shopify 参考文档 |
| --- | --- | --- |
| `Modal` | `ui-modal` | [Modal](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) |
| `SaveBar` | `ui-save-bar` | [SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) |
| `AppWindow` | `s-app-window` | [s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) |
| `TitleBar` | `ui-title-bar` | [TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) |
| `NavMenu` | `ui-nav-menu` | [NavMenu](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) |
| `useAppBridge()` | 全局 `shopify` 对象 | [useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) |

这些元素只能在 Shopify 后台中工作，因此本页只有代码示例，
没有在线演示。请先按照
[构建 Shopify 嵌入式应用](/zh/guide/shopify-embedded-app)中的说明设置好应用。

- [useAppBridge()](/zh/app-bridge/use-app-bridge)
- [Modal](/zh/app-bridge/modal)
- [TitleBar](/zh/app-bridge/title-bar)
- [SaveBar](/zh/app-bridge/save-bar)
- [AppWindow](/zh/app-bridge/app-window)
- [应用导航](/zh/app-bridge/nav-menu)

## 安装 {#install}

页面上必须加载 App Bridge 脚本（参见
[嵌入式应用指南的第 1 步](/zh/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris)）。
若要使用类型，请安装 Shopify 的类型包，它是 `polaris-vue-elements` 的
可选 peer dependency：

```sh
npm install -D @shopify/app-bridge-types
```

Shopify 的
[App Bridge web components](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components)
页面指出，CDN 脚本始终加载最新的 App Bridge，并写道："To keep
your types in step, specify `@shopify/app-bridge-types@latest` in your package.json file."

然后从子路径导入：

```ts
import { Modal, SaveBar, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
```

`polaris-vue-elements` 的主入口不会导入这些代码，因此不使用它们的应用
不会加载它们。

这些组件通过 render function 渲染元素，因此使用它们时无需修改
`isCustomElement`。

## 当前的 App Bridge 元素 {#current-elements}

Shopify 的[迁移指南](https://shopify.dev/docs/api/app-bridge/migration-guide)
介绍了当前的 web components：

- "Shopify App Bridge now uses web components: `<s-modal>` for inline content and
  `<s-app-window>` for modals with separate routes." `<s-modal>` 就是 Polaris 的 modal，
  在本库中对应 [`SModal`](/zh/components/s-modal)。
- "Title bars are now configured using the `<s-page>` component's title and action
  slots." 这就是 [`SPage`](/zh/components/s-page) 及其 slot。
- "The navigation now uses the `<s-app-nav>` web component." 请参阅
  [应用导航](/zh/app-bridge/nav-menu)。

`ui-modal`、`ui-save-bar`、`ui-title-bar` 和 `ui-nav-menu` 仍然存在于
`@shopify/app-bridge-types` 和 `@shopify/app-bridge-react` 中，本页的组件
与它们保持一致。

## 原生标签 {#raw-tags}

若要在模板中直接编写这些元素（`<ui-modal>`、`<ui-title-bar>`、
`<ui-save-bar>`、`<ui-nav-menu>`），还需要把 `ui-` 标签也视为自定义元素：

```ts
// vite.config.ts
vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('s-') || tag.startsWith('ui-'),
    },
  },
})
```

`s-app-window` 和 `s-app-nav` 已被 `s-` 规则覆盖。

若要对这些标签进行类型检查，请在 `tsconfig.app.json` 中添加可选加入的类型，
如果你使用了 `polaris-vue-elements/elements` 的类型，就放在它旁边：

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/app-bridge/elements"]
  }
}
```

它为 `ui-modal`、`ui-save-bar`、`ui-title-bar`、`ui-nav-menu`、`s-app-window` 和
`s-app-nav` 提供类型，同时也为 `<button>` 和 `<a>` 的 `variant`、`tone` 和 `loading` attribute 提供类型。
`s-page` 的类型由 `polaris-vue-elements/elements` 提供。

## 类型 {#types}

该子路径会重新导出 `@shopify/app-bridge-types` 中的所有类型，与
`@shopify/app-bridge-react` 一样，此外还有 `ModalProps`、`SaveBarProps`、`AppWindowProps`、
`TitleBarProps` 和 `NavMenuProps`。

`polaris-vue-elements/app-bridge` 中的 `ModalProps` 用于 `Modal`（`ui-modal`）。主
入口也导出了一个 `ModalProps`，用于 `SModal`（`s-modal`）。同时导入两者时，
请重命名其中一个：

```ts
import type { ModalProps } from 'polaris-vue-elements'
import type { ModalProps as AppBridgeModalProps } from 'polaris-vue-elements/app-bridge'
```

## 从 React 迁移的对照 {#from-react}

| `@shopify/app-bridge-react` | `polaris-vue-elements/app-bridge` |
| --- | --- |
| `open={open}` | `v-model:open="open"`（或 `:open`） |
| `onShow`, `onHide` | `@show`, `@hide` |
| 指向元素的 `ref` | 模板 `ref`，然后使用 `.$el` |
| `children` | 默认 slot |
| `useAppBridge()` | `useAppBridge()` |

## 常见问题 {#faq}

### 我需要 @shopify/app-bridge-react 吗？ {#do-i-need-shopify-app-bridge-react}

不需要。`polaris-vue-elements/app-bridge` 不使用 React。它只需要页面上有 App Bridge
脚本，类型则需要 `@shopify/app-bridge-types`。

### 它能在 Shopify 后台之外使用吗？ {#does-it-work-outside-the-shopify-admin}

不能。App Bridge 脚本将你的应用连接到后台，而 modal、保存栏和标题栏
都由后台渲染。请按照
[嵌入式应用指南](/zh/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris)中的说明，
从后台打开应用。

### 应该用 Modal 还是 SModal？ {#should-i-use-modal-or-smodal}

Shopify 的[迁移指南](https://shopify.dev/docs/api/app-bridge/migration-guide)
指出，App Bridge "now uses web components: `<s-modal>` for inline content and
`<s-app-window>` for modals with separate routes"。`Modal` 对应的是
`@shopify/app-bridge-react` 仍然提供的 `ui-modal` 元素。
