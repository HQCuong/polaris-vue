---
title: Eine eingebettete Shopify-App mit Vue 3 bauen
description: Eine Shopify-App mit Vue 3 und Vite bauen – App Bridge und Polaris Web Components laden, fetch-Aufrufe an das eigene Backend authentifizieren und typisierte s-*-Komponenten in App Home verwenden.
---

# Eine eingebettete Shopify-App mit Vue 3 bauen {#build-a-shopify-embedded-app-with-vue-3}

Eine eingebettete App (Shopify nennt die Oberfläche
[App Home](https://shopify.dev/docs/apps/build/app-home)) ist eine selbst gehostete
Web-App, die Shopify in einem iframe im Adminbereich rendert. Sie lässt sich mit jedem
Web-Framework bauen, auch mit Vue 3.

Zur Laufzeit stellt Shopify zwei Dinge über sein CDN bereit:

- **App Bridge** (`app-bridge.js`) verbindet das iframe mit dem Adminbereich und stellt
  das globale Objekt `shopify` bereit (Toasts, Modals, Navigation, Session-Tokens, ...).
- **Polaris Web Components** (`polaris-2.js`) registrieren die Custom Elements `<s-*>`.

`polaris-vue-elements` fügt darüber typisierte Vue 3 Komponenten (`SPage`, `STextField`,
`SModal`, ...) hinzu. Es ist ein Community-Projekt und stammt nicht von Shopify.

Die Dokumentation und Templates von Shopify zielen auf React ab, daher behandelt diese
Anleitung die Vue-spezifischen Teile. Sie setzt voraus, dass
[Erste Schritte](/de/guide/getting-started) bereits gelesen wurde.

## Architektur {#architecture}

- **Frontend:** eine Single-Page-App mit Vue 3 + Vite, ausgeliefert unter einer selbst
  kontrollierten URL. Shopify lädt sie im iframe des Adminbereichs.
- **Backend:** ein beliebiger Server, der die ID-Tokens von Shopify validieren und die
  Admin API aufrufen kann. Die Authentifizierung erfolgt über
  [Token Exchange](https://shopify.dev/docs/apps/build/authentication-authorization/set-embedded-app-authorization):
  Das Frontend sendet ein ID-Token, das Backend validiert es und tauscht es gegen ein
  Access-Token.

`shopify app init` erzeugt das Gerüst einer React-Router-App; Shopify führt kein Template
für Vue oder andere Nicht-React-Stacks. Für einen anderen Stack verweist Shopify auf seine
Authentifizierungsdokumentation und die offizielle API-Bibliothek der jeweiligen Sprache
(für Node.js gibt es eine ohne Framework-Abhängigkeiten). Ein praktikabler Aufbau: das
Backend nach Belieben aufsetzen und die Vue-App separat bauen, wie unten beschrieben.

In `shopify.app.toml` wird die App mit `embedded = true` eingebettet, und
`application_url` zeigt auf die Adresse, unter der die App ausgeliefert wird.

## 1. App Bridge und Polaris laden {#_1-load-app-bridge-and-polaris}

Das Meta-Tag `shopify-api-key` (die Client-ID der App) und beide Skripte in den
`<head>` von `index.html` einfügen:

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

Vite ersetzt `%VITE_*%`-Variablen in `index.html` durch Werte aus der Umgebung
(zum Beispiel `VITE_SHOPIFY_API_KEY` in `.env`). Alternativ lässt sich der Schlüssel auch
vom Server einfügen.

App Bridge wird nicht zusammen mit Polaris versioniert: Ihre URL enthält keine Version und
lädt immer die neueste App Bridge. Zu den Polaris-Kanälen (`polaris-2.js`, festgelegte
Releases) siehe
[Bekannte Eigenheiten](/de/guide/quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version).

Die App aus dem Shopify-Adminbereich heraus öffnen (zum Beispiel über die von
`shopify app dev` ausgegebene Vorschau-URL). Direkt in einem Browser-Tab geladen fehlt
der umgebende Adminbereich, und die Funktionen von App Bridge stehen nicht zur Verfügung.

Für typisierten Zugriff auf das globale `shopify` das Typpaket von Shopify installieren
und referenzieren (Shopify dokumentiert dafür `@shopify/app-bridge-types`):

```sh
npm install -D @shopify/app-bridge-types
```

```ts
// env.d.ts
/// <reference types="@shopify/app-bridge-types" />
```

## 2. Vite konfigurieren {#_2-configure-vite}

`s-*`-Tags als Custom Elements behandeln. Das ist dieselbe Konfiguration wie in
[Erste Schritte](/de/guide/getting-started#_3-configure-vite):

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

## 3. Eine Seite bauen {#_3-build-a-page}

Diese Seite enthält ein Formular mit `v-model`, einen Speichern-Button, der das Backend
aufruft, und ein Modal, das ein Zurücksetzen bestätigt. `SModal` wird deklarativ mit
`commandFor`/`command` geöffnet; siehe [`SModal`](/de/components/s-modal) und die
[Eigenheit der Aktions-Slots von Modals](/de/guide/quirks#_2-modal-action-slots-only-accept-specific-button-variants).

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

## 4. Mit dem Backend kommunizieren {#_4-talk-to-your-backend}

Normalerweise muss kein Token selbst angehängt werden. App Bridge fängt `fetch()` ab und
fügt bei Requests an die Domain und Subdomains der App ein ID-Token im
`Authorization`-Header hinzu (sowie die Sprache des Shops in `Accept-Language`). Ein
einfacher relativer Aufruf funktioniert:

```ts
const response = await fetch('/api/products')
const data = await response.json()
```

Auf dem Server:

- Das ID-Token bei jedem Request validieren: HS256-Signatur mit dem Client Secret, `exp`
  und `nbf`, `aud` gleich der Client-ID sowie übereinstimmende Hostnamen in `iss` und
  `dest`. Bei einem Fehler mit `401` antworten.
- ID-Tokens laufen nach einer Minute ab und sind Bearer-Credentials: Sie nur an das
  eigene Backend senden.
- Das ID-Token gegen ein Access-Token tauschen, um die Admin API aufzurufen, und dieses
  Token auf dem Server behalten.

`shopify.idToken()` nur dann selbst aufrufen, wenn der Interceptor den Request nicht
abdeckt, etwa bei einer WebSocket-Verbindung:

```ts
const token = await shopify.idToken()
const socket = new WebSocket(`wss://your-app.example.com/ws?token=${token}`)
```

Benötigt die App nur die GraphQL Admin API, kann App Bridge
`fetch('shopify:admin/api/graphql.json', ...)` über den Adminbereich leiten, sofern
Direct API Access in der App-Konfiguration aktiviert ist – ganz ohne eigenes Backend.
Siehe
[Resource Fetching](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/resource-fetching-api).

## 5. App-Bridge-APIs aus Vue verwenden {#_5-use-app-bridge-apis-from-vue}

Alles befindet sich im globalen `shopify`; ein Vue-Plugin ist nicht nötig.

### Toasts {#toasts}

```ts
shopify.toast.show('Product saved', {
  duration: 5000,
  action: 'Undo',
  onAction: () => undoSave(),
})
```

`show(message, options)` akzeptiert `duration` (ms), `isError`, `action`, `onAction` und
`onDismiss` und gibt eine ID zurück, die an `shopify.toast.hide(id)` übergeben werden kann.

### Modals per ID {#modals-by-id}

Neben `commandFor` steuert `shopify.modal` ein `SModal` über seine `id`:

```ts
await shopify.modal.show('reset-modal')
await shopify.modal.hide('reset-modal')
```

### App-Navigation {#app-navigation}

`<s-app-nav>` rendert die Navigation der App in der Seitenleiste des Adminbereichs.
Die Komponente nahe der Wurzel der App gemountet lassen, zum Beispiel in `App.vue`:

```vue
<template>
  <s-app-nav>
    <s-link href="/">Home</s-link>
    <s-link href="/settings">Settings</s-link>
  </s-app-nav>
  <RouterView />
</template>
```

Der aktive Eintrag wird aus der aktuellen URL abgeleitet. Für die Navigation per Code
dokumentiert die
[Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api)
von Shopify Anker, `open('/settings', '_self')` und die History API
(`history.pushState`).

### Save Bar {#save-bar}

`data-save-bar` zu einem `<form>` hinzufügen, und der Adminbereich zeigt eine Save Bar an,
sobald das Formular ungespeicherte Änderungen hat; `submit` wird bei „Speichern“ und
`reset` bei „Verwerfen“ ausgelöst. Nicht mit den programmatischen
`shopify.saveBar`-Methoden für dasselbe Formular kombinieren. Siehe
[Save Bar](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api).

## Nächste Schritte {#next-steps}

- [Alle Komponenten](/de/components/) durchsuchen und [Bekannte Eigenheiten](/de/guide/quirks) lesen.
- In [Erste Schritte](/de/guide/getting-started) noch einmal `v-model`, Overlays und das Typisieren roher Tags nachlesen.
- Die [App-Home-Dokumentation](https://shopify.dev/docs/apps/build/app-home) und die
  [App-Bridge-APIs](https://shopify.dev/docs/api/app-home/apis) von Shopify lesen.
