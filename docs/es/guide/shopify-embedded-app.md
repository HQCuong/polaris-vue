---
title: Crear una app integrada de Shopify con Vue 3
description: Crea una app de Shopify con Vue 3 y Vite — carga App Bridge y los web components de Polaris, autentica las llamadas fetch a tu backend y usa componentes s-* tipados en App Home.
---

# Crear una app integrada de Shopify con Vue 3 {#build-a-shopify-embedded-app-with-vue-3}

Una app integrada (Shopify llama a su interfaz
[App Home](https://shopify.dev/docs/apps/build/app-home)) es una aplicación web que alojas
tú mismo y que Shopify renderiza en un iframe dentro del admin de Shopify. Puedes crearla con
cualquier framework web, incluido Vue 3.

En runtime, Shopify te proporciona dos cosas desde su CDN:

- **App Bridge** (`app-bridge.js`) conecta tu iframe con el admin y expone el objeto
  global `shopify` (toasts, modales, navegación, tokens de sesión, ...).
- **Los web components de Polaris** (`polaris-2.js`) registran los custom elements `<s-*>`.

`polaris-vue-elements` añade componentes tipados de Vue 3 (`SPage`, `STextField`, `SModal`, ...)
sobre esos elementos. Es un proyecto de la comunidad, no creado por Shopify.

La documentación y las plantillas oficiales de Shopify están pensadas para React, así que esta guía cubre las partes
específicas de Vue. Da por hecho que ya has leído [Primeros pasos](/es/guide/getting-started).

## Arquitectura {#architecture}

- **Frontend:** una single-page app de Vue 3 + Vite, servida desde una URL que tú controlas. Shopify
  la carga en el iframe del admin.
- **Backend:** cualquier servidor que pueda validar los ID tokens de Shopify y llamar a la Admin API.
  La autenticación usa el
  [token exchange](https://shopify.dev/docs/apps/build/authentication-authorization/set-embedded-app-authorization):
  el frontend envía un ID token, tu backend lo valida y lo intercambia por un
  access token.

`shopify app init` genera una app de React Router; Shopify no ofrece una plantilla de Vue ni otra
que no sea de React. Para otro stack, Shopify te remite a su documentación de autenticación
y a la biblioteca de API oficial para tu lenguaje (hay una para Node.js sin
dependencias de ningún framework). Una organización práctica es generar el backend como
prefieras y crear la app Vue por separado, como se describe a continuación.

En `shopify.app.toml`, la app se integra con `embedded = true` y con `application_url`
apuntando a la dirección donde se sirve tu app.

## 1. Carga App Bridge y Polaris {#_1-load-app-bridge-and-polaris}

Añade la etiqueta meta `shopify-api-key` (el client ID de tu app) y los dos scripts al
`<head>` de `index.html`:

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

Vite reemplaza las variables `%VITE_*%` de `index.html` por valores de tu entorno
(por ejemplo, `VITE_SHOPIFY_API_KEY` en `.env`). También puedes inyectar la clave desde tu
servidor.

App Bridge no se versiona junto con Polaris: su URL no tiene versión y siempre carga la
última versión de App Bridge. Para los canales de Polaris (`polaris-2.js`, versiones fijadas), consulta
[Peculiaridades y advertencias](/es/guide/quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version).

Abre la app desde el admin de Shopify (por ejemplo, la URL de vista previa que muestra
`shopify app dev`). Si la cargas directamente en una pestaña del navegador, no hay ningún admin a su alrededor y
las funciones de App Bridge no funcionarán.

Para tener acceso tipado al objeto global `shopify`, instala el paquete de tipos de Shopify y
referéncialo (Shopify documenta `@shopify/app-bridge-types` para ello):

```sh
npm install -D @shopify/app-bridge-types
```

```ts
// env.d.ts
/// <reference types="@shopify/app-bridge-types" />
```

## 2. Configura Vite {#_2-configure-vite}

Trata las etiquetas `s-*` como custom elements. Es la misma configuración que en
[Primeros pasos](/es/guide/getting-started#_3-configure-vite):

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

## 3. Crea una página {#_3-build-a-page}

Esta página tiene un formulario con `v-model`, un botón de guardar que llama a tu backend y un modal
que confirma un restablecimiento. `SModal` se abre de forma declarativa con `commandFor`/`command`;
consulta [`SModal`](/es/components/s-modal) y la
[peculiaridad de los slots de acción del modal](/es/guide/quirks#_2-modal-action-slots-only-accept-specific-button-variants).

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

## 4. Comunícate con tu backend {#_4-talk-to-your-backend}

Normalmente no tienes que adjuntar un token tú mismo. App Bridge intercepta `fetch()` y, en
las peticiones al dominio y los subdominios de tu app, añade un ID token en la cabecera `Authorization`
(y el idioma de la tienda en `Accept-Language`). Basta con una llamada relativa normal:

```ts
const response = await fetch('/api/products')
const data = await response.json()
```

En el servidor:

- Valida el ID token en cada petición: firma HS256 con tu client secret, `exp`
  y `nbf`, `aud` igual a tu client ID, y nombres de host `iss` y `dest` coincidentes.
  Responde `401` si falla.
- Los ID tokens caducan al cabo de un minuto y son credenciales de tipo bearer: envíalos solo a tu
  propio backend.
- Intercambia el ID token por un access token para llamar a la Admin API, y guarda ese token
  en el servidor.

Llama a `shopify.idToken()` tú mismo solo cuando el interceptor no cubra la petición,
por ejemplo, en una conexión WebSocket:

```ts
const token = await shopify.idToken()
const socket = new WebSocket(`wss://your-app.example.com/ws?token=${token}`)
```

Si tu app solo necesita la GraphQL Admin API, App Bridge puede enrutar
`fetch('shopify:admin/api/graphql.json', ...)` a través del admin cuando el acceso Direct API
está activado en la configuración de tu app, sin necesidad de un backend propio. Consulta
[Resource fetching](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/resource-fetching-api).

## 5. Usa las API de App Bridge desde Vue {#_5-use-app-bridge-apis-from-vue}

Todo está en el objeto global `shopify`; no hace falta ningún plugin de Vue.

### Toasts {#toasts}

```ts
shopify.toast.show('Product saved', {
  duration: 5000,
  action: 'Undo',
  onAction: () => undoSave(),
})
```

`show(message, options)` acepta `duration` (ms), `isError`, `action`, `onAction` y
`onDismiss`, y devuelve un id que puedes pasar a `shopify.toast.hide(id)`.

### Modales por id {#modals-by-id}

Además de `commandFor`, `shopify.modal` controla un `SModal` por su `id`:

```ts
await shopify.modal.show('reset-modal')
await shopify.modal.hide('reset-modal')
```

### Navegación de la app {#app-navigation}

`<s-app-nav>` renderiza la navegación de la app en la barra lateral del admin. Mantenlo montado cerca
de la raíz de tu app, por ejemplo en `App.vue`:

```vue
<template>
  <s-app-nav>
    <s-link href="/">Home</s-link>
    <s-link href="/settings">Settings</s-link>
  </s-app-nav>
  <RouterView />
</template>
```

El elemento activo se deduce de la URL actual. Para navegar desde el código, la
[Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api) de Shopify
documenta los enlaces, `open('/settings', '_self')` y la History API
(`history.pushState`).

### Save bar {#save-bar}

Añade `data-save-bar` a un `<form>` y el admin mostrará una save bar cuando el formulario tenga
cambios sin guardar; `submit` se dispara con Save y `reset` con Discard. No lo combines con
los métodos programáticos de `shopify.saveBar` en el mismo formulario. Consulta
[Save bar](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api).

## Próximos pasos {#next-steps}

- Explora [todos los componentes](/es/components/) y lee [Peculiaridades y advertencias](/es/guide/quirks).
- Vuelve a [Primeros pasos](/es/guide/getting-started) para `v-model`, las superposiciones y el tipado de etiquetas sin wrapper.
- Lee la [documentación de App Home](https://shopify.dev/docs/apps/build/app-home) de Shopify y
  las [API de App Bridge](https://shopify.dev/docs/api/app-home/apis).
