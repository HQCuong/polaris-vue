# polaris-vue-elements: guide for coding agents

> Working on this repository itself rather than using the package? Read [CONTRIBUTING.md](https://github.com/HQCuong/polaris-vue/blob/main/CONTRIBUTING.md) instead.

This file is for an AI agent writing a Vue 3 app with `polaris-vue-elements`. It ships in
the npm package (`node_modules/polaris-vue-elements/AGENTS.md`), so it matches the installed
version. Full docs: <https://polaris-vue-elements.dev>, also as Markdown for agents:
[`/llms.txt`](https://polaris-vue-elements.dev/llms.txt) (index),
[`/llms-full.txt`](https://polaris-vue-elements.dev/llms-full.txt) (every page in one file)
and a `.md` copy of every page (`https://polaris-vue-elements.dev/components/s-button.md`).

## What it is

- Typed Vue 3 wrapper components for Shopify's
  [Polaris web components](https://shopify.dev/docs/api/app-home/web-components), the
  `s-*` custom elements used to build Shopify App Home (embedded admin) apps. It is a
  community project, not made by Shopify.
- Each wrapper `S<Name>` renders one Polaris element `<s-name>`: `SButton` is `<s-button>`,
  `STextField` is `<s-text-field>`, `SChoiceList` is `<s-choice-list>`. Props, events and
  slots are generated from Shopify's Custom Elements Manifest (`@shopify/polaris-types`).
- The wrappers are presentational only. The Polaris runtime that defines the elements loads
  from Shopify's CDN; this package does not include it.
- `polaris-vue-elements/app-bridge` adds Vue counterparts of the `@shopify/app-bridge-react`
  components and hook (beta, see below).

Shopify's docs are the source of truth for what each Polaris component does. Shopify's
examples use React or plain HTML; translate them to the wrappers as described here.

## Install

```sh
npm install polaris-vue-elements
```

Peer dependencies: `vue` `^3.5.0`, and optionally `@shopify/app-bridge-types` (only for
`polaris-vue-elements/app-bridge` and typing the `shopify` global):

```sh
npm install -D @shopify/app-bridge-types
```

## Required setup

1. Load the Polaris runtime in `index.html`. It registers the `<s-*>` elements globally:

   ```html
   <script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
   ```

   `polaris-2.js` is the recommended stable channel. `polaris-2.0.js` pins a release,
   `polaris-1.js` is the previous 1.x channel, and the wrappers work with both majors.
   The runtime updates independently of this package's version.

2. Tell Vue's compiler that `s-*` tags are custom elements:

   ```ts
   // vite.config.ts
   vue({
     template: {
       compilerOptions: {
         isCustomElement: (tag) => tag.startsWith('s-'),
       },
     },
   })
   ```

   If you write raw App Bridge `ui-*` tags (`<ui-title-bar>`), use
   `tag.startsWith('s-') || tag.startsWith('ui-')`. The `polaris-vue-elements/app-bridge`
   components do not need it.

3. In a Shopify embedded app, also add the App Bridge script and your app's client ID to
   `<head>`:

   ```html
   <meta name="shopify-api-key" content="%VITE_SHOPIFY_API_KEY%" />
   <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
   <script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
   ```

   App Bridge features only work when the app is opened from the Shopify admin.

## Imports

| Import | What you get |
| --- | --- |
| `polaris-vue-elements` | Every `S*` wrapper, plus types such as `ModalProps` (for `SModal`) |
| `polaris-vue-elements/app-bridge` | `Modal`, `SaveBar`, `TitleBar`, `AppWindow`, `NavMenu`, `useAppBridge()`, every type from `@shopify/app-bridge-types`, and `ModalProps`, `SaveBarProps`, `AppWindowProps`, `TitleBarProps`, `NavMenuProps` |
| `polaris-vue-elements/elements` | Types only: types raw `<s-*>` tags in templates (opt in through `tsconfig.json` `types`) |
| `polaris-vue-elements/app-bridge/elements` | Types only: types raw `ui-modal`, `ui-save-bar`, `ui-title-bar`, `ui-nav-menu`, `s-app-window`, `s-app-nav` |
| `polaris-vue-elements/tokens.css` | Polaris CSS variables (`--p-color-*`, `--p-space-*`, …) for your own CSS |
| `polaris-vue-elements/tokens.json` | The same variables as JSON |

```ts
import { SButton, STextField } from 'polaris-vue-elements'
import { Modal, TitleBar, useAppBridge } from 'polaris-vue-elements/app-bridge'
import 'polaris-vue-elements/tokens.css' // once, for example in main.ts
```

Both entries export a `ModalProps`; rename one when you import both:
`import type { ModalProps as AppBridgeModalProps } from 'polaris-vue-elements/app-bridge'`.

## Props, events and v-model

- Pass props in camelCase, as the reference lists them: `accessibilityLabel`,
  `commandFor`, `inlineSize`. Unknown props and attributes (`class`, `style`, `aria-*`)
  pass through to the element.
- Bind number-typed props: `:rows="3"`, not `rows="3"`.
- Events are the element's DOM events, by their lowercase names: `@click`, `@input`,
  `@change`, `@focus`, `@blur`, `@aftershow`, `@afterhide`. The listener gets the DOM
  event; read values from `$event.target`.
- `v-model` works on the form wrappers listed with a binding in the component list below.
  Each maps to its own property and event: text-like fields bind `value` / `input`,
  `SCheckbox` and `SSwitch` bind `checked` / `change`, `SSelect` binds `value` / `change`,
  `SChoiceList` binds `values` / `change`.

  ```vue
  <STextField v-model="name" label="Name" />
  <!-- is equivalent to -->
  <STextField :value="name" @input="name = $event.target.value" label="Name" />
  ```

- Named slots use Vue's slot syntax: `<template #primary-action>…</template>`.
- Raw `<s-*>` tags work too (and are the way to use a Polaris component that has no
  wrapper yet), but have no `v-model`: bind `:value` and listen for `@input` / `@change`.

## Overlays

`SModal` (and popovers) open declaratively with `commandFor` / `command` on a button, or
imperatively through the element on a template ref:

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { SButton, SModal, SText } from 'polaris-vue-elements'

const modal = useTemplateRef<InstanceType<typeof SModal>>('modal')
</script>

<template>
  <SButton commandFor="demo-modal" command="--show">Open</SButton>
  <SButton @click="modal?.$el.showOverlay()">Open from code</SButton>

  <SModal ref="modal" id="demo-modal" heading="Demo modal">
    <SText>Modal content.</SText>
    <template #primary-action>
      <SButton variant="primary" commandFor="demo-modal" command="--hide">Close</SButton>
    </template>
  </SModal>
</template>
```

In an embedded app, `shopify.modal.show('demo-modal')` / `hide(id)` also control an
`SModal` by its `id`.

## Known quirks

Browser-verified behaviors of the Polaris elements
([details](https://polaris-vue-elements.dev/guide/quirks.md)):

1. `SBanner` renders empty without default-slot content; a `heading` alone is not enough.
2. `SModal`'s `primary-action` slot accepts only one button with `variant="primary"`, and
   `secondary-actions` only buttons with `variant` `secondary` or `auto`. Anything else is
   dropped silently.
3. Number-typed props must be bound (`:rows="3"`); `vue-tsc` rejects string literals.
4. Slot assignment happens once, when the element connects. To move a child to another
   named slot, re-create it (`:key` or `v-if`) instead of changing `slot` reactively.
5. The runtime is versioned on the CDN, separately from this package. A stale wrapper
   lacks types for newer features but does not break; new components work as raw tags.

## CSS

- Polaris components style themselves inside their shadow roots. Use their props
  (`tone`, `variant`, `padding`, …) to change them; CSS variables cannot restyle them.
- Prefer `SStack`, `SGrid` and `SBox` for layout; they take Polaris spacing and border
  values as props.
- For your own elements, import `polaris-vue-elements/tokens.css` and use
  `var(--p-space-400)`, `var(--p-color-bg-surface)` and so on. You need the import inside
  the Shopify admin too: the runtime only defines hashed names. The list is unofficial
  (extracted from the runtime), so a name can change if Shopify renames it.

## SSR

- The wrappers render the `s-*` element with attribute-mapped props as attributes. Props
  that have no HTML attribute are set as DOM properties after mount, so they are not in
  server-rendered HTML.
- `useAppBridge()` on the server returns an object that throws when you read any property.
  Call App Bridge APIs from `onMounted()` or event handlers, not during `setup`.
- `Modal` does not render its content during SSR or before `ui-modal` is defined.

## App Bridge (beta)

The `polaris-vue-elements/app-bridge` components are new and **have not yet been tested in
a live Shopify admin**; their API may change in a minor release while in beta. They mirror
`@shopify/app-bridge-react` 4.3.0 and need only the App Bridge script, not React.

| Vue export | Element | Notes |
| --- | --- | --- |
| `Modal` | `ui-modal` | `v-model:open`, `@show` / `@hide`; a `TitleBar` child sets its header and footer; `src` loads a route instead |
| `SaveBar` | `ui-save-bar` | `v-model:open`; the `variant="primary"` button is Save, the one without a variant is Discard |
| `TitleBar` | `ui-title-bar` | `title` plus `<button>` / `<a>` children |
| `AppWindow` | `s-app-window` | fullscreen window; `src` is required; `v-model:open` |
| `NavMenu` | `ui-nav-menu` | the older nav element; Shopify now documents raw `<s-app-nav>` with `<s-link>` children |
| `useAppBridge()` | the `shopify` global | typed as `ShopifyGlobal` |

- Mapping from React: `open={open}` is `v-model:open`, `onShow` / `onHide` are `@show` /
  `@hide`, `children` is the default slot, and a `ref` to the element is a template ref's
  `$el`.
- Shopify's migration guide describes the current App Bridge elements: `<s-modal>`
  (`SModal`) for inline content, `<s-app-window>` for modals with separate routes, and the
  title bar configured through `<s-page>` (`SPage`) slots. The `ui-*` components mirror
  the elements that `@shopify/app-bridge-react` still provides.
- The `shopify` global works directly too: `shopify.toast.show('Saved')`,
  `shopify.loading(true)`, `shopify.resourcePicker({ type: 'product' })`.
- App Bridge adds an ID token to `fetch()` calls to your app's own domain, so a plain
  `fetch('/api/…')` is authenticated. Call `shopify.idToken()` yourself only where that
  does not apply, such as a WebSocket. Validate tokens on your server.
- A `<form data-save-bar>` shows the admin save bar on unsaved changes without any
  component.

## Component reference

For one component's props (with types), events, methods and slots, read
`https://polaris-vue-elements.dev/components/<tag>.md`, for example
`https://polaris-vue-elements.dev/components/s-text-field.md`. Shopify's own reference is at
<https://shopify.dev/docs/api/app-home/polaris-web-components>.

<!-- BEGIN GENERATED: components -->

All 62 wrappers, grouped the way Shopify's reference groups them. Reference for each: `https://polaris-vue-elements.dev/components/<tag>.md`.

### Actions

| Component | Tag | v-model | What it is |
| --- | --- | --- | --- |
| `SButton` | `<s-button>` |  | Triggers an action or navigates, with primary, secondary and tertiary variants, icons and a loading state. |
| `SButtonGroup` | `<s-button-group>` |  | Lays out a set of related buttons together, such as a primary action and its secondary actions. |
| `SClickable` | `<s-clickable>` |  | Makes any content clickable as a button or link, without imposing button styling. |
| `SClickableChip` | `<s-clickable-chip>` |  | An interactive chip that can be clicked, followed as a link or removed — useful for filters and applied tags. |
| `SLink` | `<s-link>` |  | A text link that navigates to another page or URL, or runs a command. |
| `SMenu` | `<s-menu>` |  | A list of actions shown in an overlay, opened from a button. |
| `SPressButton` | `<s-press-button>` |  | A toggle button that stays pressed or unpressed, for turning a mode or filter on and off. |

### Feedback and status

| Component | Tag | v-model | What it is |
| --- | --- | --- | --- |
| `SBadge` | `<s-badge>` |  | A small label that shows the status of an object, such as an order, payment or fulfillment. |
| `SBanner` | `<s-banner>` |  | A prominent message that surfaces important information, warnings or errors at the top of a page or section. |
| `SEmptyState` | `<s-empty-state>` |  | Explains why a view has no content yet and points merchants to the first action to take. |
| `SProgress` | `<s-progress>` |  | A progress bar that shows how far a task has advanced toward its maximum value. |
| `SSpinner` | `<s-spinner>` |  | An animated indicator that content or an action is loading. |

### Forms

| Component | Tag | v-model | What it is |
| --- | --- | --- | --- |
| `SCheckbox` | `<s-checkbox>` | `checked` / `change` | A single checkbox for a yes/no choice, bound to its checked state with v-model. |
| `SChoice` | `<s-choice>` |  | One option inside a choice list. |
| `SChoiceList` | `<s-choice-list>` | `values` / `change` | A group of radio buttons or checkboxes for picking one or several options. |
| `SColorField` | `<s-color-field>` | `value` / `input` | A text input for entering a color value, with an optional alpha channel. |
| `SColorPicker` | `<s-color-picker>` | `value` / `input` | A visual control for picking a color. |
| `SDateField` | `<s-date-field>` | `value` / `input` | An input for entering a date. |
| `SDatePicker` | `<s-date-picker>` | `value` / `input` | A calendar for selecting a single date or a date range. |
| `SDropZone` | `<s-drop-zone>` | `value` / `input` | A file upload area that accepts files by drag and drop or from a file picker. |
| `SEmailField` | `<s-email-field>` | `value` / `input` | A text input for email addresses. |
| `SMoneyField` | `<s-money-field>` | `value` / `input` | A numeric input for monetary amounts. |
| `SNumberField` | `<s-number-field>` | `value` / `input` | A numeric input with optional minimum, maximum and step. |
| `SOption` | `<s-option>` |  | One option inside a select. |
| `SOptionGroup` | `<s-option-group>` |  | Groups related options inside a select under a shared label. |
| `SPasswordField` | `<s-password-field>` | `value` / `input` | A text input for passwords that masks what is typed. |
| `SSearchField` | `<s-search-field>` | `value` / `input` | A text input for search queries. |
| `SSelect` | `<s-select>` | `value` / `change` | A dropdown for choosing one option from a list. |
| `SSwitch` | `<s-switch>` | `checked` / `change` | A toggle switch that turns a setting on or off. |
| `STextArea` | `<s-text-area>` | `value` / `input` | A multi-line text input for longer content such as notes or descriptions. |
| `STextField` | `<s-text-field>` | `value` / `input` | A single-line text input with label, placeholder, validation error and help text. |
| `SUrlField` | `<s-url-field>` | `value` / `input` | A text input for web addresses. |

### Layout and structure

| Component | Tag | v-model | What it is |
| --- | --- | --- | --- |
| `SBox` | `<s-box>` |  | A generic container for padding, background, border, radius and sizing. |
| `SDivider` | `<s-divider>` |  | A horizontal or vertical line that separates content. |
| `SGrid` | `<s-grid>` |  | A CSS grid container for laying out content in rows and columns. |
| `SGridItem` | `<s-grid-item>` |  | A child of a grid that can span several columns or rows. |
| `SListItem` | `<s-list-item>` |  | One item inside an ordered or unordered list. |
| `SOrderedList` | `<s-ordered-list>` |  | A numbered list. |
| `SPage` | `<s-page>` |  | The top-level page layout, with a heading, page actions and content areas. |
| `SQueryContainer` | `<s-query-container>` |  | Turns an element into a size container so its children can adapt to its width with container queries. |
| `SScrollBox` | `<s-scroll-box>` |  | A container that scrolls its content when it overflows. |
| `SSection` | `<s-section>` |  | Groups related content, with an optional heading, subheading and actions. |
| `SStack` | `<s-stack>` |  | Arranges its children in a row or column with consistent spacing and alignment. |
| `STable` | `<s-table>` |  | A table for structured data, with optional pagination, a loading state and a list layout on small screens. |
| `STableBody` | `<s-table-body>` |  | The body of a table, holding its data rows. |
| `STableCell` | `<s-table-cell>` |  | One cell in a table row. |
| `STableHeader` | `<s-table-header>` |  | One column header in a table. |
| `STableHeaderRow` | `<s-table-header-row>` |  | The row of column headers at the top of a table. |
| `STableRow` | `<s-table-row>` |  | One row of data in a table. |
| `SUnorderedList` | `<s-unordered-list>` |  | A bulleted list. |

### Media and visuals

| Component | Tag | v-model | What it is |
| --- | --- | --- | --- |
| `SAvatar` | `<s-avatar>` |  | Shows a person's or business's image, or their initials when there is no image. |
| `SIcon` | `<s-icon>` |  | Displays an icon from the Polaris icon set by name. |
| `SImage` | `<s-image>` |  | Displays an image with control over aspect ratio, fit, borders and lazy loading. |
| `SThumbnail` | `<s-thumbnail>` |  | A small, fixed-size preview image of a product or file. |

### Overlays

| Component | Tag | v-model | What it is |
| --- | --- | --- | --- |
| `SModal` | `<s-modal>` |  | A dialog overlay for focused tasks and confirmations, opened by a command or a method call. |
| `SPopover` | `<s-popover>` |  | Floating content anchored to the button that opens it. |

### Typography and content

| Component | Tag | v-model | What it is |
| --- | --- | --- | --- |
| `SChip` | `<s-chip>` |  | A static label for a tag or attribute, optionally removable. |
| `SHeading` | `<s-heading>` |  | A heading that titles a page section. |
| `SNumber` | `<s-number>` |  | Displays a number you have already formatted, with typography, tone and color styling. |
| `SParagraph` | `<s-paragraph>` |  | A block of body text. |
| `SText` | `<s-text>` |  | Inline text with tone, weight and emphasis styling. |
| `STooltip` | `<s-tooltip>` |  | A short label that appears when another element is hovered or focused. |

<!-- END GENERATED: components -->
