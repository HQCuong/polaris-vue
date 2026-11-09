---
title: Variables CSS et design tokens Shopify Polaris (web components)
description: Tous les design tokens Polaris définis par le runtime des web components Shopify, avec aperçus en direct, recherche et copie. Importez-les sous forme de tokens.css pour le CSS de votre app.
schema: TechArticle
---

# Variables CSS Polaris (design tokens) {#css-variables}

Les web components Polaris gèrent leur propre style, mais votre app a généralement un peu
de CSS à elle : une grille de page, une carte personnalisée, une légende de graphique, un
espace entre deux composants. Les variables CSS Polaris permettent à ce CSS d'utiliser les
mêmes couleurs, espacements, rayons et polices que les composants qui l'entourent, pour
qu'il corresponde au design de l'interface d'administration au lieu de reposer sur des
valeurs codées en dur approximatives.

`polaris-vue-elements` les fournit dans une seule feuille de style, `tokens.css`, extraite
du runtime Polaris que charge votre app.

::: warning Non officiel
Shopify ne publie pas de liste des variables CSS des web components Polaris. Ces noms et
valeurs sont extraits du runtime de Shopify (`polaris-2.js`) : les valeurs suivent donc le
CDN, et un nom peut changer ou disparaître si Shopify le renomme. La liste est vérifiée
chaque jour (voir [Comment elle reste à jour](#how-it-stays-up-to-date)).
:::

## Quand les utiliser {#when-to-use}

- **À faire :** les utiliser pour les éléments qui appartiennent à votre app : wrappers,
  conteneurs de mise en page, widgets personnalisés, texte affiché en dehors des
  composants Polaris.
- **À éviter :** s'en servir pour modifier le style des composants Polaris. Chaque
  composant s'affiche dans son propre shadow root, donc définir `--p-color-bg-fill-brand`
  sur votre page ne changera pas la couleur de `<SButton>`. Utilisez plutôt les props du
  composant (`tone`, `variant`, `padding`, …).
- **Privilégiez d'abord les composants de mise en page.** `<SStack>`, `<SGrid>` et `<SBox>`
  acceptent déjà les valeurs Polaris d'espacement, de padding et de bordure en props.
  Tournez-vous vers les variables CSS quand ils ne couvrent pas votre besoin.

## Installation {#install}

Importez la feuille de style une seule fois, par exemple dans `main.ts` :

```ts
import 'polaris-vue-elements/tokens.css'
```

Utilisez ensuite les variables dans n'importe quel CSS :

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

Les noms et valeurs bruts sont aussi disponibles en JSON, pour l'outillage ou le CSS-in-JS :

```ts
import tokens from 'polaris-vue-elements/tokens.json'

tokens.tokens['--p-space-400'] // '1rem'
```

## Thèmes {#themes}

Le runtime a deux apparences. Une boutique restée sur l'ancien design de l'administration
obtient les valeurs de base (le bloc `:root` de `tokens.css`). Une boutique qui dispose du
nouveau design de l'administration, ainsi que toute page en dehors de l'interface
d'administration Shopify, obtient le thème `admin-next` : lorsque le premier composant
Polaris s'affiche, le runtime ajoute la classe `p-partial-theme-admin-next` à `<html>`, et
`tokens.css` redéfinit sous cette même classe les valeurs qui diffèrent. Votre CSS suit le
thème choisi par le runtime sans aucun travail supplémentaire. Ci-dessous, basculez entre
**Base** et **admin-next** pour voir l'un ou l'autre jeu de valeurs ; un point à moitié
rempli signale les variables dont la valeur diffère entre les deux.

Les valeurs que le runtime n'applique que sous des conditions supplémentaires (couleurs P3
à large gamut, tailles de texte mobiles, mode contraste élevé, prise en charge de
`corner-shape`) ne sont pas incluses ; `tokens.css` contient la valeur par défaut de
chacune.

## Comment elle reste à jour {#how-it-stays-up-to-date}

Une tâche planifiée lit chaque jour `polaris-2.js` depuis le CDN de Shopify, extrait les
variables et ouvre une pull request dès qu'un élément a été ajouté, supprimé ou modifié.
Chaque release de `polaris-vue-elements` inclut la liste telle qu'elle était au moment de
cette release.

<div class="css-variables-list">

## Toutes les variables {#all-variables}

<CssVariablesSpecimen />

<CssVariablesToolbar />

### Couleur : arrière-plan {#color-bg}

<CssVariables group="color-bg" />

### Couleur : texte {#color-text}

<CssVariables group="color-text" />

### Couleur : bordure {#color-border}

<CssVariables group="color-border" />

### Couleur : icône {#color-icon}

<CssVariables group="color-icon" />

### Couleur : autres {#color-other}

<CssVariables group="color-other" />

### Espacement {#space}

<CssVariables group="space" />

### Rayon de bordure {#border-radius}

<CssVariables group="border-radius" />

### Épaisseur de bordure {#border-width}

<CssVariables group="border-width" />

### Police {#font}

<CssVariables group="font" />

### Ombre {#shadow}

<CssVariables group="shadow" />

### Animation {#motion}

<CssVariables group="motion" />

### Z-index {#z-index}

<CssVariables group="z-index" />

### Largeur {#width}

<CssVariables group="width" />

### Hauteur {#height}

<CssVariables group="height" />

### Breakpoints {#breakpoints}

Les variables de breakpoint contiennent les largeurs, mais le CSS ne peut pas utiliser
`var()` dans une media query : écrivez donc directement la valeur :
`@media (min-width: 48rem)`.

<CssVariables group="breakpoints" />

### Autres {#other}

<CssVariables group="other" />

</div>

## Migrer depuis `@shopify/polaris-tokens` {#migrating-from-polaris-tokens}

`@shopify/polaris-tokens` est le package de tokens de Polaris React. Les web components
Polaris ne l'utilisent pas : le runtime définit ses propres variables, et la plupart des
noms sont conservés. Si le CSS de votre app provient d'une app Polaris React, vérifiez-le
à l'aide de ces listes. Un nom qui n'existe que dans l'ancien package n'a aucune valeur
dans une app à base de web components : le CSS qui l'utilise obtient alors la valeur de
repli `var()` que vous avez écrite, ou rien du tout.

<CssVariablesMigration />

## FAQ {#faq}

### Les web components Polaris ont-ils des variables CSS ?

Oui. Le runtime Polaris (`polaris-2.js`) définit environ 700 propriétés personnalisées
`--p-*` sur `:root` et les utilise dans ses composants. Shopify ne les documente pas, et
les noms du runtime portent un hash de build. `tokens.css` vous donne les mêmes valeurs
sous des noms stables.

### Peut-on modifier le style d'un composant Polaris avec ces variables ?

Non. Chaque composant s'affiche dans son propre shadow root et lit les variables hachées
propres au runtime : définir `--p-color-bg-fill-brand` sur votre page ne change donc pas
`<SButton>`. Utilisez les props du composant, comme `tone` et `variant`. Les variables
servent à vos propres éléments autour des composants.

### Pourquoi les noms de variables dans les DevTools se terminent-ils par un hash comme `-6e076` ?

Le runtime ajoute un suffixe propre à chaque build à tous les noms
(`--p-color-bg-surface-6e076`), et ce suffixe change d'un build à l'autre. Ne copiez pas
ces noms dans votre CSS : `tokens.css` supprime le suffixe, si bien que
`var(--p-color-bg-surface)` continue de fonctionner après la publication d'un nouveau
build par Shopify.

### Quelle différence avec `@shopify/polaris-tokens` ?

`@shopify/polaris-tokens` est le package de tokens de Polaris React. Cette liste provient
directement du runtime des web components : elle contient donc les tokens que les
composants utilisent réellement, y compris les valeurs du nouveau design de
l'administration (`admin-next`). La plupart des noms sont communs ; voir
[Migrer depuis `@shopify/polaris-tokens`](#migrating-from-polaris-tokens) pour les
différences.

### Les variables prennent-elles en charge le mode sombre ?

Pas comme thème de page. Le runtime possède un jeu de valeurs sombres (`admin-next-dark`),
mais il ne l'applique qu'à certaines parties à l'intérieur de quelques composants, jamais à
la page : `tokens.css` n'a donc pas de thème sombre. Les valeurs se trouvent dans
`tokens.json` sous `themes["admin-next-dark"]` si vous souhaitez en construire un.
