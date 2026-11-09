---
title: Shopify Polaris CSS variables & design tokens (web components)
description: Every Polaris design token the Shopify web components runtime defines, with live previews, search and copy. Import them as tokens.css for your own app CSS.
schema: TechArticle
---

# Polaris CSS variables (design tokens) {#css-variables}

Polaris web components style themselves, but your app usually has some CSS of its own:
a page grid, a custom card, a chart legend, a gap between two components. Polaris CSS
variables let that CSS use the same colors, spacing, radii and fonts as the components
around it, so it matches the admin's design instead of hard-coded guesses.

`polaris-vue-elements` ships them as one stylesheet, `tokens.css`, extracted from the
Polaris runtime your app loads.

::: warning Unofficial
Shopify doesn't publish a CSS variable list for Polaris web components. These names and
values are extracted from Shopify's runtime (`polaris-2.js`), so the values follow the
CDN, and a name can change or disappear if Shopify renames it. The list is checked daily
(see [How it stays up to date](#how-it-stays-up-to-date)).
:::

## When to use them {#when-to-use}

- **Do** use them for elements your app owns: wrappers, layout containers, custom
  widgets, text you render outside Polaris components.
- **Don't** try to restyle Polaris components with them. Each component renders inside
  its own shadow root, so setting `--p-color-bg-fill-brand` on your page won't recolor
  `<SButton>`. Use the component's props (`tone`, `variant`, `padding`, …) instead.
- **Prefer layout components first.** `<SStack>`, `<SGrid>` and `<SBox>` already take
  Polaris spacing, padding and border values as props. Reach for CSS variables when
  those don't cover what you need.

## Install {#install}

Import the stylesheet once, for example in `main.ts`:

```ts
import 'polaris-vue-elements/tokens.css'
```

Then use the variables in any CSS:

```vue
<template>
  <div class="summary">
    <SText type="strong">Orders today</SText>
    <SText>42</SText>
  </div>
</template>

<style scoped>
.summary {
  display: flex;
  justify-content: space-between;
  gap: var(--p-space-300);
  padding: var(--p-space-400);
  border: var(--p-border-width-025) solid var(--p-color-border);
  border-radius: var(--p-border-radius-300);
  background: var(--p-color-bg-surface);
  box-shadow: var(--p-shadow-100);
}
</style>
```

The raw names and values are also available as JSON, for tooling or CSS-in-JS:

```ts
import tokens from 'polaris-vue-elements/tokens.json'

tokens.tokens['--p-space-400'] // '1rem'
```

## Themes {#themes}

The runtime has two looks. A store on the previous admin design gets the base values (the
`:root` block in `tokens.css`). A store on the new admin design, and any page outside the
Shopify admin, gets the `admin-next` theme: when the first Polaris component renders, the
runtime adds the class `p-partial-theme-admin-next` to `<html>`, and `tokens.css`
overrides the values that differ under that same class. Your CSS follows the theme the runtime picked without any
extra work. Below, switch between **Base** and **admin-next** to see either set of values;
a half-filled dot marks variables whose value differs between the two.

Values the runtime only applies under extra conditions (wide-gamut P3 colors, mobile type
sizes, high-contrast mode, `corner-shape` support) aren't included; `tokens.css` has the
default value for each.

## How it stays up to date {#how-it-stays-up-to-date}

A scheduled job reads `polaris-2.js` from Shopify's CDN every day, extracts the variables
and opens a pull request when anything was added, removed or changed. Each release of
`polaris-vue-elements` ships the list as of that release.

<div class="css-variables-list">

## All variables {#all-variables}

<CssVariablesSpecimen />

<CssVariablesToolbar />

### Color: background {#color-bg}

<CssVariables group="color-bg" />

### Color: text {#color-text}

<CssVariables group="color-text" />

### Color: border {#color-border}

<CssVariables group="color-border" />

### Color: icon {#color-icon}

<CssVariables group="color-icon" />

### Color: other {#color-other}

<CssVariables group="color-other" />

### Space {#space}

<CssVariables group="space" />

### Border radius {#border-radius}

<CssVariables group="border-radius" />

### Border width {#border-width}

<CssVariables group="border-width" />

### Font {#font}

<CssVariables group="font" />

### Shadow {#shadow}

<CssVariables group="shadow" />

### Motion {#motion}

<CssVariables group="motion" />

### Z-index {#z-index}

<CssVariables group="z-index" />

### Width {#width}

<CssVariables group="width" />

### Height {#height}

<CssVariables group="height" />

### Breakpoints {#breakpoints}

Breakpoint variables hold the widths, but CSS can't use `var()` inside a media query, so
write the value directly: `@media (min-width: 48rem)`.

<CssVariables group="breakpoints" />

### Other {#other}

<CssVariables group="other" />

</div>

## Migrating from `@shopify/polaris-tokens` {#migrating-from-polaris-tokens}

`@shopify/polaris-tokens` is the token package of Polaris React. Polaris web components
don't use it: the runtime defines its own variables, and most names carry over. If your
app's CSS came from a Polaris React app, check it against these lists. A name that's only
in the legacy package has no value in a web components app, so CSS that uses it gets the
`var()` fallback you wrote, or nothing.

<CssVariablesMigration />

## FAQ {#faq}

### Do Polaris web components have CSS variables?

Yes. The Polaris runtime (`polaris-2.js`) defines about 700 `--p-*` custom properties on
`:root` and uses them inside its components. Shopify doesn't document them, and the
runtime's names carry a build hash. `tokens.css` gives you the same values under stable
names.

### Can I restyle a Polaris component with these variables?

No. Each component renders inside its own shadow root and reads the runtime's own hashed
variables, so setting `--p-color-bg-fill-brand` on your page doesn't change `<SButton>`.
Use the component's props, such as `tone` and `variant`. The variables are for your own
elements around the components.

### Why do the variable names in DevTools end in a hash like `-6e076`?

The runtime adds a build-specific suffix to every name (`--p-color-bg-surface-6e076`), and
the suffix changes from one build to the next. Don't copy those names into your CSS:
`tokens.css` removes the suffix, so `var(--p-color-bg-surface)` keeps working after Shopify
ships a new build.

### How is this different from `@shopify/polaris-tokens`?

`@shopify/polaris-tokens` is the token package for Polaris React. This list comes from the
web components runtime itself, so it has the tokens the components actually use, including
the new admin design (`admin-next`) values. Most names are shared; see
[Migrating from `@shopify/polaris-tokens`](#migrating-from-polaris-tokens) for the
differences.

### Do the variables support dark mode?

Not as a page theme. The runtime has a dark set of values (`admin-next-dark`), but it only
applies it to parts inside some components, never to the page, so `tokens.css` has no dark
theme. The values are in `tokens.json` under `themes["admin-next-dark"]` if you want to
build one.
