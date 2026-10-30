---
title: Créer une app Shopify intégrée avec Vue 3
description: Créez une app Shopify avec Vue 3 et Vite — chargez App Bridge et les web components Polaris, authentifiez les appels fetch vers votre backend et utilisez des composants s-* typés dans App Home.
---

# Créer une app Shopify intégrée avec Vue 3 {#build-a-shopify-embedded-app-with-vue-3}

Une app intégrée (Shopify appelle son interface
[App Home](https://shopify.dev/docs/apps/build/app-home)) est une application web que vous hébergez
vous-même et que Shopify affiche dans une iframe au sein de l'interface d'administration. Vous pouvez la construire avec
n'importe quel framework web, y compris Vue 3.

Au runtime, Shopify vous fournit deux éléments depuis son CDN :

- **App Bridge** (`app-bridge.js`) relie votre iframe à l'interface d'administration et expose l'objet
  global `shopify` (toasts, modals, navigation, jetons de session, ...).
- **Les web components Polaris** (`polaris-2.js`) enregistrent les custom elements `<s-*>`.

`polaris-vue-elements` ajoute des composants Vue 3 typés (`SPage`, `STextField`, `SModal`, ...)
par-dessus ces éléments. C'est un projet communautaire, non réalisé par Shopify.

La documentation et les templates officiels de Shopify ciblent React ; ce guide couvre donc les parties
propres à Vue. Il suppose que vous avez déjà lu [Prise en main](/fr/guide/getting-started).

## Architecture {#architecture}

- **Frontend :** une single-page app Vue 3 + Vite, servie depuis une URL que vous contrôlez. Shopify
  la charge dans l'iframe de l'interface d'administration.
- **Backend :** n'importe quel serveur capable de valider les ID tokens de Shopify et d'appeler l'Admin API.
  L'authentification utilise
  le [token exchange](https://shopify.dev/docs/apps/build/authentication-authorization/set-embedded-app-authorization) :
  le frontend envoie un ID token, votre backend le valide et l'échange contre un
  access token.

`shopify app init` génère une app React Router ; Shopify ne propose pas de template Vue ni d'autre
template non React. Pour une autre stack, Shopify vous renvoie à sa documentation sur l'authentification
et à la bibliothèque d'API officielle pour votre langage (il en existe une pour Node.js sans
dépendance à un framework). Une organisation pratique consiste à générer le backend comme vous
le souhaitez, et à construire l'app Vue séparément, comme décrit ci-dessous.

Dans `shopify.app.toml`, l'app est intégrée avec `embedded = true` et `application_url`
pointant vers l'adresse où votre app est servie.

## 1. Charger App Bridge et Polaris {#_1-load-app-bridge-and-polaris}

Ajoutez la balise meta `shopify-api-key` (le client ID de votre app) et les deux scripts dans le
`<head>` de `index.html` :

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

Vite remplace les variables `%VITE_*%` dans `index.html` par les valeurs de votre environnement
(par exemple `VITE_SHOPIFY_API_KEY` dans `.env`). Vous pouvez aussi injecter la clé depuis votre
serveur.

App Bridge n'est pas versionné avec Polaris : son URL ne contient pas de version et charge toujours la
dernière version d'App Bridge. Pour les canaux Polaris (`polaris-2.js`, versions épinglées), consultez
[Particularités connues](/fr/guide/quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version).

Ouvrez l'app depuis l'interface d'administration Shopify (par exemple l'URL de prévisualisation affichée par
`shopify app dev`). Chargée directement dans un onglet du navigateur, elle n'est entourée d'aucune administration et
les fonctionnalités d'App Bridge ne fonctionneront pas.

Pour un accès typé à l'objet global `shopify`, installez le package de types de Shopify et
référencez-le (Shopify documente `@shopify/app-bridge-types` à cet effet) :

```sh
npm install -D @shopify/app-bridge-types
```

```ts
// env.d.ts
/// <reference types="@shopify/app-bridge-types" />
```

## 2. Configurer Vite {#_2-configure-vite}

Traitez les balises `s-*` comme des custom elements. C'est la même configuration que dans
[Prise en main](/fr/guide/getting-started#_3-configure-vite) :

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

## 3. Construire une page {#_3-build-a-page}

Cette page contient un formulaire avec `v-model`, un bouton d'enregistrement qui appelle votre backend, et un modal
qui confirme une réinitialisation. `SModal` est ouvert de manière déclarative avec `commandFor`/`command` ;
voir [`SModal`](/fr/components/s-modal) et la
[particularité des slots d'action du modal](/fr/guide/quirks#_2-modal-action-slots-only-accept-specific-button-variants).

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

## 4. Communiquer avec votre backend {#_4-talk-to-your-backend}

En général, vous n'avez pas à joindre de jeton vous-même. App Bridge intercepte `fetch()` et, pour
les requêtes vers le domaine et les sous-domaines de votre app, ajoute un ID token dans l'en-tête `Authorization`
(ainsi que la langue de la boutique dans `Accept-Language`). Un simple appel relatif fonctionne :

```ts
const response = await fetch('/api/products')
const data = await response.json()
```

Côté serveur :

- Validez l'ID token à chaque requête : signature HS256 avec votre client secret, `exp`
  et `nbf`, `aud` égal à votre client ID, et des noms d'hôte `iss` et `dest` concordants.
  Répondez `401` en cas d'échec.
- Les ID tokens expirent au bout d'une minute et sont des identifiants de type bearer : ne les envoyez qu'à votre
  propre backend.
- Échangez l'ID token contre un access token pour appeler l'Admin API, et conservez ce jeton
  côté serveur.

N'appelez `shopify.idToken()` vous-même que lorsque l'intercepteur ne couvre pas la requête,
par exemple pour une connexion WebSocket :

```ts
const token = await shopify.idToken()
const socket = new WebSocket(`wss://your-app.example.com/ws?token=${token}`)
```

Si votre app n'a besoin que de la GraphQL Admin API, App Bridge peut faire passer
`fetch('shopify:admin/api/graphql.json', ...)` par l'interface d'administration lorsque l'accès Direct API
est activé dans la configuration de votre app, sans backend propre. Consultez
[Resource fetching](https://shopify.dev/docs/api/app-home/apis/authentication-and-data/resource-fetching-api).

## 5. Utiliser les API App Bridge depuis Vue {#_5-use-app-bridge-apis-from-vue}

Tout se trouve sur l'objet global `shopify` ; aucun plugin Vue n'est nécessaire.

### Toasts {#toasts}

```ts
shopify.toast.show('Product saved', {
  duration: 5000,
  action: 'Undo',
  onAction: () => undoSave(),
})
```

`show(message, options)` accepte `duration` (ms), `isError`, `action`, `onAction` et
`onDismiss`, et renvoie un id que vous pouvez passer à `shopify.toast.hide(id)`.

### Modals par id {#modals-by-id}

En plus de `commandFor`, `shopify.modal` contrôle un `SModal` par son `id` :

```ts
await shopify.modal.show('reset-modal')
await shopify.modal.hide('reset-modal')
```

### Navigation de l'app {#app-navigation}

`<s-app-nav>` affiche la navigation de l'app dans la barre latérale de l'interface d'administration. Gardez-le monté près
de la racine de votre app, par exemple dans `App.vue` :

```vue
<template>
  <s-app-nav>
    <s-link href="/">Home</s-link>
    <s-link href="/settings">Settings</s-link>
  </s-app-nav>
  <RouterView />
</template>
```

L'élément actif est déduit de l'URL courante. Pour naviguer depuis le code, la
[Navigation API](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/navigation-api) de Shopify
documente les ancres, `open('/settings', '_self')` et la History API
(`history.pushState`).

### Save bar {#save-bar}

Ajoutez `data-save-bar` à un `<form>` et l'interface d'administration affiche une save bar lorsque le formulaire contient
des modifications non enregistrées ; `submit` est déclenché sur Save et `reset` sur Discard. Ne le combinez pas avec
les méthodes programmatiques de `shopify.saveBar` sur le même formulaire. Consultez
[Save bar](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/save-bar-api).

## Étapes suivantes {#next-steps}

- Parcourez [tous les composants](/fr/components/) et lisez [Particularités connues](/fr/guide/quirks).
- Revenez à [Prise en main](/fr/guide/getting-started) pour `v-model`, les overlays et le typage des balises brutes.
- Lisez la [documentation App Home](https://shopify.dev/docs/apps/build/app-home) de Shopify et
  les [API App Bridge](https://shopify.dev/docs/api/app-home/apis).
