---
title: Component App Bridge cho Vue
description: Các component Vue 3 tương ứng với component của @shopify/app-bridge-react do Shopify cung cấp — Modal, SaveBar, AppWindow, TitleBar, NavMenu và useAppBridge — từ polaris-vue-elements/app-bridge.
---

# Component App Bridge cho Vue {#app-bridge-components-for-vue}

`polaris-vue-elements/app-bridge` có các component và hook Vue 3 tương ứng với những component và hook trong
[`@shopify/app-bridge-react`](https://www.npmjs.com/package/@shopify/app-bridge-react)
của Shopify (phiên bản 4.3.0). Chúng bọc các element App Bridge do script App Bridge định nghĩa.
Giống phần còn lại của `polaris-vue-elements`, đây là một dự án cộng đồng, không phải do Shopify phát triển.

| Export Vue | Element | Tham chiếu của Shopify |
| --- | --- | --- |
| `Modal` | `ui-modal` | [Modal](https://shopify.dev/docs/api/app-bridge-library/react-components/modal) |
| `SaveBar` | `ui-save-bar` | [SaveBar](https://shopify.dev/docs/api/app-bridge-library/react-components/savebar) |
| `AppWindow` | `s-app-window` | [s-app-window](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-window) |
| `TitleBar` | `ui-title-bar` | [TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar) |
| `NavMenu` | `ui-nav-menu` | [NavMenu](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) |
| `useAppBridge()` | đối tượng toàn cục `shopify` | [useAppBridge](https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge) |

Các element này chỉ hoạt động bên trong trang admin Shopify, vì vậy trang này chỉ có ví dụ code và
không có demo trực tiếp. Hãy thiết lập app trước, như trong
[Xây dựng Shopify embedded app](/vi/guide/shopify-embedded-app).

- [useAppBridge()](/vi/app-bridge/use-app-bridge)
- [Modal](/vi/app-bridge/modal)
- [TitleBar](/vi/app-bridge/title-bar)
- [SaveBar](/vi/app-bridge/save-bar)
- [AppWindow](/vi/app-bridge/app-window)
- [Điều hướng app](/vi/app-bridge/nav-menu)

## Cài đặt {#install}

Script App Bridge phải có trên trang (xem
[bước 1 của hướng dẫn embedded app](/vi/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris)).
Để có type, hãy cài package type của Shopify, là một optional peer dependency của
`polaris-vue-elements`:

```sh
npm install -D @shopify/app-bridge-types
```

Trang
[App Bridge web components](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components)
của Shopify lưu ý rằng script CDN luôn tải App Bridge mới nhất, và nói: "To keep
your types in step, specify `@shopify/app-bridge-types@latest` in your package.json file."

Sau đó import từ subpath:

```ts
import { Modal, SaveBar, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
```

Entry chính `polaris-vue-elements` không import đoạn code này, nên các app không dùng nó
sẽ không tải nó.

Các component render element của chúng từ render function, nên không cần thay đổi
`isCustomElement` để dùng chúng.

## Các element App Bridge hiện tại {#current-elements}

[Hướng dẫn migration](https://shopify.dev/docs/api/app-bridge/migration-guide) của Shopify
mô tả các web component hiện tại:

- "Shopify App Bridge now uses web components: `<s-modal>` for inline content and
  `<s-app-window>` for modals with separate routes." `<s-modal>` là modal của Polaris,
  tương ứng với [`SModal`](/vi/components/s-modal) trong thư viện này.
- "Title bars are now configured using the `<s-page>` component's title and action
  slots." Đó là [`SPage`](/vi/components/s-page) cùng các slot của nó.
- "The navigation now uses the `<s-app-nav>` web component." Xem
  [Điều hướng app](/vi/app-bridge/nav-menu).

`ui-modal`, `ui-save-bar`, `ui-title-bar` và `ui-nav-menu` vẫn còn trong
`@shopify/app-bridge-types` và `@shopify/app-bridge-react`, và các component trên trang
này phản ánh chúng.

## Tag thô {#raw-tags}

Để viết trực tiếp các element trong template (`<ui-modal>`, `<ui-title-bar>`,
`<ui-save-bar>`, `<ui-nav-menu>`), hãy coi các tag `ui-` cũng là custom element:

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

`s-app-window` và `s-app-nav` đã được quy tắc `s-` bao quát.

Để kiểm tra type cho các tag đó, hãy thêm các type opt-in vào `tsconfig.app.json`, cạnh
các type `polaris-vue-elements/elements` nếu bạn dùng chúng:

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/app-bridge/elements"]
  }
}
```

Nó định type cho `ui-modal`, `ui-save-bar`, `ui-title-bar`, `ui-nav-menu`, `s-app-window` và
`s-app-nav`, cùng các attribute `variant`, `tone` và `loading` của `<button>` và `<a>`.
`s-page` được định type bởi `polaris-vue-elements/elements`.

## Type {#types}

Subpath này re-export mọi type từ `@shopify/app-bridge-types`, như
`@shopify/app-bridge-react` làm, cộng thêm `ModalProps`, `SaveBarProps`, `AppWindowProps`,
`TitleBarProps` và `NavMenuProps`.

`ModalProps` từ `polaris-vue-elements/app-bridge` dành cho `Modal` (`ui-modal`). Entry chính
cũng export một `ModalProps`, dành cho `SModal` (`s-modal`). Hãy đổi tên một trong hai khi bạn import
cả hai:

```ts
import type { ModalProps } from 'polaris-vue-elements'
import type { ModalProps as AppBridgeModalProps } from 'polaris-vue-elements/app-bridge'
```

## Ánh xạ từ React {#from-react}

| `@shopify/app-bridge-react` | `polaris-vue-elements/app-bridge` |
| --- | --- |
| `open={open}` | `v-model:open="open"` (hoặc `:open`) |
| `onShow`, `onHide` | `@show`, `@hide` |
| `ref` tới element | `ref` trong template, rồi `.$el` |
| `children` | default slot |
| `useAppBridge()` | `useAppBridge()` |

## Câu hỏi thường gặp {#faq}

### Tôi có cần @shopify/app-bridge-react không? {#do-i-need-shopify-app-bridge-react}

Không. `polaris-vue-elements/app-bridge` không dùng React. Nó chỉ cần script App Bridge
trên trang, và `@shopify/app-bridge-types` để có type.

### Nó có hoạt động ngoài trang admin Shopify không? {#does-it-work-outside-the-shopify-admin}

Không. Script App Bridge kết nối app của bạn với trang admin, và trang admin render các modal,
save bar và title bar. Hãy mở app từ trang admin, như mô tả trong
[hướng dẫn embedded app](/vi/guide/shopify-embedded-app#_1-load-app-bridge-and-polaris).

### Tôi nên dùng Modal hay SModal? {#should-i-use-modal-or-smodal}

[Hướng dẫn migration](https://shopify.dev/docs/api/app-bridge/migration-guide) của Shopify
nói rằng App Bridge "now uses web components: `<s-modal>` for inline content and
`<s-app-window>` for modals with separate routes". `Modal` phản ánh element `ui-modal`
mà `@shopify/app-bridge-react` vẫn cung cấp.
