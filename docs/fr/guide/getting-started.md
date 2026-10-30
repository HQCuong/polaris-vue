---
title: Prise en main de Shopify Polaris avec Vue 3
description: Installez polaris-vue-elements, chargez le runtime des web components Shopify Polaris et utilisez des wrappers Vue 3 typés comme SButton et STextField avec v-model dans une app Vue ou une app Shopify.
---

# Prise en main {#getting-started}

`polaris-vue-elements` est un ensemble de composants Vue 3 typés qui encapsulent les web components
Polaris de Shopify (`<s-button>`, `<s-text-field>`, `<s-modal>`, ...). Les web components
eux-mêmes sont chargés au runtime depuis le CDN de Shopify — cette bibliothèque vous fournit
simplement une interface Vue typée et idiomatique (props, events, v-model) autour d'eux.

## 1. Installation {#_1-install}

```sh
npm install polaris-vue-elements
```

## 2. Charger le runtime Polaris {#_2-load-the-polaris-runtime}

Les composants wrapper sont purement présentationnels — ils ne contiennent pas les
définitions réelles des custom elements. Votre application hôte doit charger le script
du runtime Polaris de Shopify, qui enregistre globalement les éléments `<s-*>` :

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

Cela fonctionne dans n'importe quelle app Vue, pas seulement dans l'interface d'administration Shopify — les composants sont
de simples custom elements et s'affichent partout où le script est chargé.

`polaris-2.js` est le canal stable de Shopify et celui que nous recommandons en production.
Pour épingler plutôt une version précise, ou pour comprendre le lien entre la version du runtime
et celle de cette bibliothèque, consultez
[Particularités connues et pièges](./quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version).

### Polaris 2.0 et le nouveau design de l'administration {#polaris-2-0-and-the-new-admin-design}

Polaris 2.0 apporte le nouveau design visuel de l'interface d'administration Shopify (couleurs, typographie,
espacements et icônes). Il est stable depuis le 22 octobre 2026
([annonce](https://shopify.dev/changelog/posts/polaris-cdn-2-0-is-now-stable)).
Le passage depuis la 1.x est facultatif : remplacez `polaris-1.js` par `polaris-2.js`.

- **Aucune modification de code nécessaire.** La 2.0 est une mise à jour visuelle : ses composants, props,
  events et slots sont les mêmes que ceux de la 1.1, avec quelques ajouts (comme la prop
  `loading` de `SThumbnail`). Les apps qui restent sur `polaris-1.js` continuent de fonctionner
  avec ces wrappers ; seuls les ajouts nécessitent la 2.x au runtime.
- **Il suit le design de chaque boutique.** Dans l'interface d'administration Shopify, une boutique qui dispose
  du nouveau design d'administration obtient le nouveau rendu, et une boutique restée sur l'ancien design conserve
  le rendu 1.x. En dehors de l'administration, le nouveau rendu est utilisé par défaut, ce qui facilite
  la prévisualisation en local.
- **Le contenu fixe ou sticky situé près du bas de la fenêtre** doit réserver de l'espace
  avec la variable CSS `--shopify-safe-area-inset-bottom`
  ([environment API](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api)),
  afin que la barre flottante Sidekick ne le recouvre pas.
- **Les apps Built for Shopify** doivent adopter le nouveau style visuel de l'administration d'ici le
  **1er mai 2027**.

## 3. Configurer Vite {#_3-configure-vite}

Indiquez au compilateur de Vue de traiter toute balise `s-*` comme un custom element au lieu
d'essayer de la résoudre comme un composant Vue :

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

## 4. Votre premier composant {#_4-your-first-component}

Importez les composants depuis `polaris-vue-elements` et utilisez-les comme n'importe quel autre composant
Vue — les props et les events sont entièrement typés :

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

## 5. v-model sur les composants de formulaire {#_5-v-model-on-form-components}

Les composants de type formulaire prennent en charge `v-model`, associé à la bonne paire
prop/event sous-jacente pour chaque élément (voir `src/lib/overrides.ts` pour la
correspondance complète — les champs texte utilisent `value`/`input`, `SCheckbox`/`SSwitch` utilisent
`checked`/`change`, `SChoiceList` utilise `values`/`change`, etc.) :

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

## 6. Contrôler les overlays (modal, popover, tooltip) {#_6-controlling-overlays-modal-popover-tooltip}

Les composants d'overlay comme `SModal` peuvent être contrôlés de deux façons :

**De manière déclarative**, avec les attributs HTML standard `commandFor`/`command` sur
un bouton déclencheur — aucun script nécessaire :

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

**De manière impérative**, en récupérant une template ref typée et en appelant la méthode de
l'élément sous-jacent via `$el` :

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

## 7. Typer les balises `<s-*>` brutes (facultatif) {#_7-typing-raw-s-tags-optional}

Si vous préférez continuer à écrire les balises natives de Polaris (`<s-button>`, `<s-text-field>`, …)
plutôt que de passer aux wrappers, le package peut quand même les typer. Activez-le une seule fois, dans votre
`tsconfig.json` :

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/elements"]
  }
}
```

ou avec une référence dans un fichier `.d.ts` tel que `env.d.ts` :

```ts
/// <reference types="polaris-vue-elements/elements" />
```

Cela ajoute chaque balise Polaris aux `GlobalComponents` de Vue, de sorte que Volar et `vue-tsc` vérifient
les balises brutes de la même façon que les wrappers : props typées en union, listeners `@click` /
`@aftershow` typés, et un élément typé pour les méthodes impératives.

```vue
<template>
  <!-- error: Type '"bogus"' is not assignable to type '"auto" | "primary" | … ' -->
  <s-button variant="bogus">Save</s-button>
</template>
```

Il s'agit uniquement de types : rien n'est enregistré au runtime, conservez donc le réglage
`isCustomElement` de l'étape 3. Deux différences par rapport aux wrappers :

- **Pas de `v-model` sur les balises brutes.** Liez `:value` et écoutez `@input` / `@change`
  vous-même, ou utilisez le composant wrapper, qui associe pour vous la propriété et l'event
  de chaque champ de formulaire.
- **Ne le combinez pas avec un shim écrit à la main** pour les mêmes balises dans votre projet —
  deux déclarations de `GlobalComponents['s-button']` avec des types différents entrent en conflit.
  Supprimez le shim lorsque vous activez cette option.

## Étapes suivantes {#next-steps}

Parcourez la [référence des composants](/fr/components/) pour la liste complète des props/events
de chaque wrapper, ou lisez [Particularités connues et pièges](/fr/guide/quirks) avant
d'y être confronté vous-même.

Vous créez une app Shopify ? Consultez [Créer une app Shopify intégrée avec Vue 3](/fr/guide/shopify-embedded-app)
pour le chargement d'App Bridge, les requêtes authentifiées et les API App Bridge depuis Vue.
