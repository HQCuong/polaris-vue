---
title: Build a Shopify embedded app with Vue 3
description: Build a Shopify app with Vue 3 and Vite — load App Bridge and Polaris web components, authenticate fetch calls to your backend, and use typed s-* components in App Home.
---

# Build a Shopify embedded app with Vue 3

An embedded app (Shopify calls the UI its
[App Home](https://shopify.dev/docs/apps/build/app-home)) is a web app you host
yourself that Shopify renders in an iframe inside the admin. You can build it with
any web framework, including Vue 3.

At runtime Shopify gives you two things from its CDN:

- **App Bridge** (`app-bridge.js`) connects your iframe to the admin and exposes the
  global `shopify` object (toasts, modals, navigation, session tokens, ...).
- **Polaris web components** (`polaris-2.js`) register the `<s-*>` custom elements.

`polaris-vue-elements` adds typed Vue 3 components (`SPage`, `STextField`, `SModal`, ...)
on top of those elements. It is a community project, not made by Shopify.

Shopify's own docs and templates target React, so this guide covers the Vue-specific
parts. It assumes you have already read [Getting started](/guide/getting-started).

## Architecture

- **Frontend:** a Vue 3 + Vite single-page app, served from a URL you control. Shopify
  loads it in the admin iframe.
- **Backend:** any server that can validate Shopify's ID tokens and call the Admin API.
  Authentication uses
  [token exchange](https://shopify.dev/docs/apps/build/authentication-authorization/set-embedded-app-authorization):
  the frontend sends an ID token, your backend validates it and exchanges it for an
  access token.

`shopify app init` scaffolds a React Router app; Shopify does not list a Vue or other
non-React template. For another stack, Shopify points you to its authentication docs
and the official API library for your language (there is a Node.js one with no
framework dependencies). One practical layout is to scaffold the backend however you
like, and build the Vue app separately, as described below.

In `shopify.app.toml` the app is embedded with `embedded = true` and `application_url`
pointing at where your app is served.

## 1. Load App Bridge and Polaris

Add the `shopify-api-key` meta tag (your app's client ID) and both scripts to the
`<head>` of `index.html`:

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

Vite replaces `%VITE_*%` variables in `index.html` with values from your environment
(for example `VITE_SHOPIFY_API_KEY` in `.env`). You can also inject the key from your
server instead.

App Bridge is not versioned with Polaris: its URL has no version and always loads the
latest App Bridge. For the Polaris channels (`polaris-2.js`, pinned releases), see
[Known quirks](/guide/quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version).

Open the app from the Shopify admin (for example the preview URL printed by
`shopify app dev`). Loaded directly in a browser tab, there is no admin around it and
App Bridge features will not work.

For typed access to the `shopify` global, install Shopify's types package and
reference it (Shopify documents `@shopify/app-bridge-types` for this):

```sh
npm install -D @shopify/app-bridge-types
```

```ts
// env.d.ts
/// <reference types="@shopify/app-bridge-types" />
```

## 2. Configure Vite

Treat `s-*` tags as custom elements. This is the same config as in
[Getting started](/guide/getting-started#_3-configure-vite):

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

## 3. Build a page

This page has a form with `v-model`, a save button that calls your backend, and a modal
that confirms a reset. `SModal` is opened declaratively with `commandFor`/`command`;
see [`SModal`](/components/s-modal) and the
[modal action slot quirk](/guide/quirks#_2-modal-action-slots-only-accept-specific-button-variants).

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

## 4. Talk to your backend

You usually do not attach a token yourself. App Bridge intercepts `fetch()` and, for
requests to your app's domain and subdomains, adds an ID token in the `Authorization`
header (and the shop's locale in `Accept-Language`). A plain relative call works:

```ts
const response = await fetch('/api/products')
const data = await response.json()
```

On the server:

- Validate the ID token on every request: HS256 signature with your client secret, `exp`
  and `nbf`, `aud` equal to your client ID, and matching `iss` and `dest` hostnames.
  Respond `401` on failure.
- ID tokens expire after one minute and are bearer credentials: send them only to your
  own backend.
- Exchange the ID token for an access token to call the Admin API, and keep that token
  on the server.

Call `shopify.idToken()` yourself only when the interceptor does not cover the request,
such as a WebSocket connection:

```ts
const token = await shopify.idToken()
const socket = new WebSocket(`wss://your-app.example.com/ws?token=${token}`)
```

If your app only needs the GraphQL Admin API, App Bridge can route
`fetch('shopify:admin/api/graphql.json', ...)` through the admin when Direct API access
is enabled in your app configuration, with no backend of your own. See
[Resource fetching](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/resource-fetching-api).

## 5. Use App Bridge APIs from Vue

Everything is on the `shopify` global; no Vue plugin is needed.

### Toasts

```ts
shopify.toast.show('Product saved', {
  duration: 5000,
  action: 'Undo',
  onAction: () => undoSave(),
})
```

`show(message, options)` accepts `duration` (ms), `isError`, `action`, `onAction` and
`onDismiss`, and returns an id you can pass to `shopify.toast.hide(id)`.

### Modals by id

Besides `commandFor`, `shopify.modal` controls an `SModal` by its `id`:

```ts
await shopify.modal.show('reset-modal')
await shopify.modal.hide('reset-modal')
```

### App navigation

`<s-app-nav>` renders the app's navigation in the admin sidebar. Keep it mounted near
the root of your app, for example in `App.vue`:

```vue
<template>
  <s-app-nav>
    <s-link href="/">Home</s-link>
    <s-link href="/settings">Settings</s-link>
  </s-app-nav>
  <RouterView />
</template>
```

The active item is derived from the current URL. To navigate from code, Shopify's
[Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)
documents anchors, `open('/settings', '_self')` and the History API
(`history.pushState`).

### Save bar

Add `data-save-bar` to a `<form>` and the admin shows a save bar when the form has
unsaved changes; `submit` fires on Save and `reset` on Discard. Do not combine it with
the programmatic `shopify.saveBar` methods on the same form. See
[Save bar](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api).

## Next steps

- Browse [all components](/components/) and read [Known quirks](/guide/quirks).
- Revisit [Getting started](/guide/getting-started) for `v-model`, overlays and typing raw tags.
- Read Shopify's [App Home docs](https://shopify.dev/docs/apps/build/app-home) and
  [App Bridge APIs](https://shopify.dev/docs/api/app-home/apis).
