---
title: Web components Shopify Polaris dans Vue — particularités connues
description: Particularités vérifiées dans le navigateur des web components Shopify Polaris utilisés depuis Vue 3 — exigences de slots, timing des events et comportements de v-model qui diffèrent des bibliothèques de composants Vue habituelles.
---

# Particularités connues et pièges {#known-quirks-gotchas}

Voici des comportements réels, vérifiés dans le navigateur, des web components Polaris
sous-jacents, qui ne correspondent pas toujours à ce que l'on attend d'une bibliothèque
de composants Vue classique. Les lire avant d'y être confronté vous fera gagner du temps
de débogage.

## 1. `<SBanner>` a besoin d'un contenu de slot {#_1-sbanner-needs-slot-content}

Un attribut `heading` seul ne suffit pas — `<s-banner>` s'affiche vide à moins
d'avoir aussi un contenu dans le slot par défaut.

```vue
<!-- ❌ Don't: renders an empty banner -->
<SBanner heading="Heads up" tone="info" />

<!-- ✅ Do: give it body content via the default slot -->
<SBanner heading="Heads up" tone="info">
  <SText>Something you should know about.</SText>
</SBanner>
```

## 2. Les slots d'action du modal n'acceptent que certaines variantes de bouton {#_2-modal-action-slots-only-accept-specific-button-variants}

Le slot `primary-action` de `SModal` n'accepte qu'un seul bouton avec
`variant="primary"`. Polaris assigne manuellement le contenu des slots en interne, et
tout nœud qui ne correspond pas est **ignoré silencieusement** — aucun avertissement, aucune erreur, il
ne s'affiche simplement pas. `secondary-actions` accepte les boutons avec `variant`
`secondary` ou `auto`.

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

## 3. Les props de type nombre doivent être liées, pas écrites comme attributs texte {#_3-number-typed-props-must-be-bound-not-written-as-string-attributes}

La documentation de Polaris montre des attributs HTML simples (par ex. `rows="3"`),
mais c'est trompeur en Vue : pour les props typées `number`, `vue-tsc` attend une
expression liée, pas une chaîne littérale.

```vue
<!-- ❌ Don't: vue-tsc rejects a string literal for a number prop -->
<STextArea label="Bio" rows="3" />

<!-- ✅ Do: bind it so it's passed as a number -->
<STextArea label="Bio" :rows="3" />
```

## 4. L'assignation des slots n'a lieu qu'une fois, au moment de la connexion {#_4-slot-assignment-happens-once-at-connect-time}

Modifier l'attribut `slot` d'un enfant après le montage du parent ne le
réassigne pas. Si un élément doit passer d'un slot nommé à un autre, re-rendez-le
(par ex. avec `v-if`/`:key`) au lieu de modifier `slot` de façon réactive.

```vue
<!-- ❌ Don't: dynamically re-pointing `slot` after mount is a no-op -->
<SButton :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>

<!-- ✅ Do: force re-creation when the slot assignment needs to change -->
<SButton :key="isPrimary" :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>
```

## 5. Le runtime Polaris est versionné sur le CDN — la version de cette bibliothèque n'est pas celle du runtime {#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version}

Depuis août 2026, le CDN Polaris suit le versionnage sémantique
([changelog](https://shopify.dev/changelog/the-polaris-cdn-is-adopting-semantic-versioning)).
Choisissez le canal adapté à votre processus de publication :

| URL | Ce qu'elle sert |
| --- | --- |
| `polaris-2.js` | Canal stable 2.x — le nouveau style visuel de l'interface d'administration Shopify ; reçoit automatiquement les mises à jour compatibles (mineures). **Recommandé.** |
| `polaris-2.0.js` | Version épinglée — aucune nouvelle fonctionnalité, correction ni modification visuelle tant que vous ne déplacez pas l'épinglage. |
| `polaris-1.js` | Précédent canal stable 1.x. |
| `polaris.js` | URL historique — sert actuellement le même build que `polaris-1.js` et ne passe jamais d'elle-même à une nouvelle version majeure. |

Une nouvelle version majeure (comme la 2.0) est toujours facultative : c'est vous qui changez l'URL du script. Polaris
2.0 est une mise à jour visuelle : son Custom Elements Manifest
(`@shopify/polaris-types@2.0.0`) déclare les mêmes balises, props, events et slots
que la 1.1, avec quelques ajouts (la prop `loading` de `SThumbnail`, davantage d'icônes pour `STextField`),
si bien que ces wrappers fonctionnent aussi avec `polaris-1.js`.

Quel que soit le canal chargé, le runtime évolue indépendamment de la version
de `polaris-vue-elements` que vous avez installée. La version de cette bibliothèque reflète
uniquement la fraîcheur de ses **types et wrappers** générés :

- Un wrapper obsolète ne casse jamais les composants qui existent déjà — il peut simplement
  lui manquer des props/events typés pour des fonctionnalités ajoutées par Shopify après la dernière
  génération du wrapper.
- Les props inconnues fonctionnent toujours : elles sont transmises sans typage via `$attrs` à
  l'élément sous-jacent.
- Les composants inconnus ou nouveaux fonctionnent toujours : utilisez directement la balise du custom element brut
  (par ex. `<s-new-component>`) jusqu'à ce qu'un wrapper typé soit généré pour lui.

```vue
<template>
  <!-- A brand-new Polaris component with no polaris-vue-elements wrapper yet still works -->
  <s-new-component some-new-prop="value" />
</template>
```
