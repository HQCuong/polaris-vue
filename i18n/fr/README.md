<div align="center">

<sub>[English](../../README.md) | [Tiếng Việt](../vi/README.md) | [한국어](../ko/README.md) | [简体中文](../zh/README.md) | [日本語](../ja/README.md) | [Deutsch](../de/README.md) | **Français**</sub>

<br>

<a href="https://polaris-vue-elements.dev/fr/">
  <img src="https://polaris-vue-elements.dev/og.png" alt="polaris-vue-elements : wrappers Vue 3 typés pour les web components Shopify Polaris" width="720">
</a>

<br>
<br>

[![npm version](https://img.shields.io/npm/v/polaris-vue-elements?color=008060&label=npm)](https://www.npmjs.com/package/polaris-vue-elements)
[![npm downloads](https://img.shields.io/npm/dm/polaris-vue-elements?color=008060)](https://www.npmjs.com/package/polaris-vue-elements)
[![CI](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml/badge.svg)](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/npm/l/polaris-vue-elements?color=008060)](../../LICENSE)

**[Documentation](https://polaris-vue-elements.dev/fr/)** ·
[Prise en main](https://polaris-vue-elements.dev/fr/guide/getting-started) ·
[Composants](https://polaris-vue-elements.dev/fr/components/) ·
[Guide de l'app intégrée](https://polaris-vue-elements.dev/fr/guide/shopify-embedded-app) ·
[Changelog](../../CHANGELOG.md)

</div>

---

> Cette traduction peut être en retard sur la version anglaise. En cas de divergence, la [version anglaise](../../README.md) fait foi.

Des composants wrapper Vue 3 entièrement typés pour les [web components Shopify Polaris](https://shopify.dev/docs/api/app-home/web-components) : les custom elements `s-*` utilisés pour créer des apps Shopify App Home (intégrées à l'interface d'administration Shopify).

Le runtime Polaris lui-même est chargé depuis le CDN de Shopify (le canal stable `polaris-2.js` reçoit automatiquement les mises à jour compatibles). Cette bibliothèque vous offre par-dessus une surface Vue idiomatique et entièrement typée.

## Fonctionnalités

- **Props et events typés pour les 62 composants**, générés à partir du Custom Elements Manifest officiel de Shopify (`@shopify/polaris-types`) : props en types union comme `variant`, autocomplétion dans les templates, listeners `@click` / `@aftershow` typés.
- **`v-model` sur 17 composants de formulaire** (`STextField`, `SCheckbox`, `SSelect`, `SChoiceList`, …), chacun associé à la bonne paire propriété/événement.
- **Contrôle impératif des overlays.** `SModal` expose un `$el` typé (`ModalElement`), de sorte que `modal.value?.$el.showOverlay()` passe la vérification de types, en plus du modèle déclaratif `commandFor` / `command` de Polaris.
- **Dégradation en douceur, jamais bloquant.** Les props inconnues sont transmises via `$attrs`, les slots sont relayés tels quels, et les tout nouveaux composants Polaris restent toujours utilisables sous forme de balises `s-*` brutes. Un wrapper pas à jour signifie seulement des types manquants pour les nouvelles fonctionnalités, jamais des fonctionnalités existantes cassées.

## Installation

```sh
npm install polaris-vue-elements
```

Vue `^3.5` est une peer dependency.

### Configuration du runtime (obligatoire)

Les wrappers sont purement présentationnels. Votre application hôte charge le runtime Polaris depuis le CDN de Shopify et indique à Vue que les balises `s-*` sont des custom elements :

```html
<!-- index.html -->
<script src="https://cdn.shopify.com/shopifycloud/polaris-2.js"></script>
```

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

> **Remarque :** `polaris-2.js` est le canal stable de Shopify et apporte le nouveau design visuel de l'interface d'administration. Les apps encore sur `polaris-1.js` continuent de fonctionner : l'API des composants de la 2.0 est identique à celle de la 1.1, à quelques ajouts près. Voir [Polaris 2.0 et le nouveau design de l'administration](https://polaris-vue-elements.dev/fr/guide/getting-started#polaris-2-0-and-the-new-admin-design).

## Démarrage rapide

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, STextField } from 'polaris-vue-elements'

const name = ref('')
</script>

<template>
  <STextField v-model="name" label="Name" />
  <SButton variant="primary" @click="console.log(name)">Save</SButton>
</template>
```

> **Astuce :** vous préférez écrire directement les balises `<s-button>` de Polaris ? Ajoutez `"types": ["polaris-vue-elements/elements"]` à votre `tsconfig.json`, et Volar / `vue-tsc` vérifieront aussi les types des balises `<s-*>` brutes (types uniquement ; `v-model` reste réservé aux wrappers). Voir [Typer les balises `<s-*>` brutes](https://polaris-vue-elements.dev/fr/guide/getting-started#_7-typing-raw-s-tags-optional).

## Documentation

Tout se trouve sur **[polaris-vue-elements.dev](https://polaris-vue-elements.dev/fr/)** :

- [Prise en main](https://polaris-vue-elements.dev/fr/guide/getting-started) : configuration, `v-model`, overlays et balises brutes typées.
- [Créer une app Shopify intégrée avec Vue 3](https://polaris-vue-elements.dev/fr/guide/shopify-embedded-app) : App Bridge, `fetch` authentifié, navigation et barre d'enregistrement.
- [Particularités connues](https://polaris-vue-elements.dev/fr/guide/quirks) : comportements de Polaris vérifiés dans un vrai navigateur.
- [Référence des composants](https://polaris-vue-elements.dev/fr/components/) : props, events, slots, bonnes pratiques et exemples interactifs pour les 62 composants.

Le code source du site se trouve dans [`docs/`](../../docs) ; lancez-le en local avec `npm run docs:dev`.

## Fonctionnement

Tout ce qui peut être déduit du manifest de Shopify est généré automatiquement ; le jugement humain tient dans un seul petit fichier.

```
@shopify/polaris-types (custom-elements.json)   ← source de vérité
        │  npm run generate
        ▼
src/lib/generated/        ← métadonnées, types Props/Events/Element, composants (NE PAS MODIFIER)
src/lib/runtime/          ← createWrapper : une seule factory générique pour les 62 composants
src/lib/overrides.ts      ← écrit à la main : uniquement les mappings v-model
```

Des tests anti-dérive (drift guards) rendent tout oubli impossible : la CI échoue si le code généré n'est pas à jour, si un composant du manifest n'a pas de wrapper, ou si un nouveau composant de type formulaire n'a pas d'override v-model. Un workflow planifié ([`sync-polaris.yml`](../../.github/workflows/sync-polaris.yml)) ouvre automatiquement une PR de synchronisation dès qu'une nouvelle version de `@shopify/polaris-types` est publiée.

<details>
<summary><strong>Mettre à jour manuellement vers une nouvelle version de Polaris</strong></summary>

```sh
npm update @shopify/polaris-types
npm run generate          # régénère les wrappers + les types
npm run docs:generate     # régénère la référence des composants
git diff                  # relisez, puis notez les changements d'API dans CHANGELOG.md
```

</details>

## Développement

```sh
npm install
npm run dev            # playground (src/App.vue) avec de vrais composants Polaris
npm run docs:dev       # site de documentation
npm run test:unit      # vitest (drift guards + comportement des wrappers)
npm run type-check     # vue-tsc
npm run lint           # oxlint + eslint
npm run generate       # régénère src/lib/generated/ à partir du manifest
npm run docs:generate  # régénère docs/components/ à partir du manifest
npm run build:lib      # construit le package publiable dans dist/
```

## Contribuer

Les signalements de bugs, corrections de documentation et pull requests sont les bienvenus. Consultez le [guide de contribution](./CONTRIBUTING.md) pour la configuration, les règles de base et la checklist avant d'ouvrir une PR, ainsi que le [code de conduite](./CODE_OF_CONDUCT.md). Pour signaler une vulnérabilité, consultez la [politique de sécurité](./SECURITY.md).

## Publication des versions

Les versions sont publiées depuis `main` en poussant un tag de version. [`release.yml`](../../.github/workflows/release.yml) s'occupe du reste : vérifications, `npm publish` avec provenance via npm Trusted Publishing, et une GitHub Release dont les notes proviennent de `CHANGELOG.md`.

<details>
<summary><strong>Étapes de publication (mainteneurs)</strong></summary>

1. Dans [`CHANGELOG.md`](../../CHANGELOG.md), déplacez les entrées de `## [Unreleased]` sous un nouveau titre `## [x.y.z] - YYYY-MM-DD` et mettez à jour les liens de comparaison en bas du fichier. Les PR de synchronisation de polaris-types y consignent automatiquement les composants ajoutés/supprimés ; ajoutez à la main les changements de props, de slots et d'icônes (les suppressions sont des breaking changes).
2. `npm version x.y.z --no-git-tag-version`, committez les deux fichiers et poussez sur `main`.
3. `git tag vx.y.z && git push origin vx.y.z`. Les tags avec un suffixe de pré-version (par ex. `v0.3.0-rc.0`) sont publiés sous le dist-tag `next`.

</details>

## Licence

[MIT](../../LICENSE). Ce projet n'est ni affilié à Shopify ni approuvé par Shopify.
