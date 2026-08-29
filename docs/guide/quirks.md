---
description: Browser-verified quirks of Shopify Polaris web components when used from Vue 3 — slot requirements, event timing and v-model behaviors that differ from typical Vue component libraries.
---

# Known quirks & gotchas

These are real, browser-verified behaviors of the underlying Polaris web
components that don't always match what you'd expect coming from a typical
Vue component library. Reading this before you hit them will save you some
debugging time.

## 1. `<SBanner>` needs slot content

A `heading` attribute alone is not enough — `<s-banner>` renders empty unless
it also has default-slot content.

```vue
<!-- ❌ Don't: renders an empty banner -->
<SBanner heading="Heads up" tone="info" />

<!-- ✅ Do: give it body content via the default slot -->
<SBanner heading="Heads up" tone="info">
  <SText>Something you should know about.</SText>
</SBanner>
```

## 2. Modal action slots only accept specific button variants

`SModal`'s `primary-action` slot only accepts a single button with
`variant="primary"`. Polaris assigns slot content manually under the hood, and
any node that doesn't match is **silently dropped** — no warning, no error, it
just doesn't render. `secondary-actions` accepts buttons with `variant`
`secondary` or `auto`.

```vue
<!-- ❌ Don't: wrong variant in primary-action, vanishes silently -->
<template #primary-action>
  <SButton variant="secondary" command="--hide" commandFor="demo-modal">Close</SButton>
</template>

<!-- ✅ Do: primary-action must be variant="primary" -->
<template #primary-action>
  <SButton variant="primary" command="--hide" commandFor="demo-modal">Close</SButton>
</template>

<!-- ✅ Do: secondary-actions accepts secondary or auto -->
<template #secondary-actions>
  <SButton variant="secondary" command="--hide" commandFor="demo-modal">Cancel</SButton>
</template>
```

## 3. Number-typed props must be bound, not written as string attributes

Polaris's own documentation shows plain HTML attributes (e.g. `rows="3"`),
but that's misleading in Vue: for props typed as `number`, `vue-tsc` expects a
bound expression, not a string literal.

```vue
<!-- ❌ Don't: vue-tsc rejects a string literal for a number prop -->
<STextArea label="Bio" rows="3" />

<!-- ✅ Do: bind it so it's passed as a number -->
<STextArea label="Bio" :rows="3" />
```

## 4. Slot assignment happens once, at connect time

Changing a child's `slot` attribute after the parent has mounted does not
re-assign it. If you need an element to move between named slots, re-render
it (e.g. with `v-if`/`:key`) rather than mutating `slot` reactively.

```vue
<!-- ❌ Don't: dynamically re-pointing `slot` after mount is a no-op -->
<SButton :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>

<!-- ✅ Do: force re-creation when the slot assignment needs to change -->
<SButton :key="isPrimary" :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>
```

## 5. The Polaris runtime is evergreen — this library's version is not the runtime's version

`https://cdn.shopify.com/shopifycloud/polaris.js` always serves Shopify's
latest Polaris build, regardless of which version of `polaris-vue` you have
installed. This library's version only reflects the freshness of its
generated **types and wrappers**:

- A stale wrapper never breaks components that already exist — it just may be
  missing typed props/events for features Shopify added after the wrapper was
  last generated.
- Unknown props still work: they pass through untyped via `$attrs` onto the
  underlying element.
- Unknown/new components still work: use the raw custom element tag directly
  (e.g. `<s-new-component>`) until a typed wrapper is generated for it.

```vue
<template>
  <!-- A brand-new Polaris component with no polaris-vue wrapper yet still works -->
  <s-new-component some-new-prop="value" />
</template>
```
