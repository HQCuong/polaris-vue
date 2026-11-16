---
title: "NavMenu (ui-nav-menu) – App Bridge für Vue 3"
description: "App-Navigation einer eingebetteten Shopify-App mit Vue 3: Shopify dokumentiert s-app-nav, das als rohes Tag funktioniert; NavMenu rendert das ältere App-Bridge-Element ui-nav-menu."
---

# App-Navigation {#app-nav}

Die App-Navigation konfiguriert die Navigationseinträge Ihrer App im Shopify-Adminbereich, wie Shopifys [NavMenu-Referenz](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu) es beschreibt.

Shopify dokumentiert `<s-app-nav>` mit `<s-link>`-Kindern für die App-Navigation; siehe die
[Anleitung zu eingebetteten Apps](/de/guide/shopify-embedded-app#app-navigation) und Shopifys
[App-Nav-Referenz](https://shopify.dev/docs/api/app-home/v2.0/app-bridge-web-components/app-nav).
Auch dafür gibt es keine React-Komponente; Shopifys
[React-Migrationsanleitung](https://shopify.dev/docs/api/app-bridge/migration-guide-react)
sagt, man solle es direkt rendern. Deshalb hat diese Bibliothek keine Komponente dafür, und das rohe Tag
funktioniert mit der vorhandenen `isCustomElement`-Regel für `s-`.

`NavMenu` rendert das ältere `ui-nav-menu`, für Apps, die es noch verwenden:

```vue
<script setup lang="ts">
import { NavMenu } from 'polaris-vue-elements/app-bridge'
</script>

<template>
  <NavMenu>
    <a href="/" rel="home">Home</a>
    <a href="/templates">Templates</a>
  </NavMenu>
</template>
```

Wie beide Elemente mit Vue Router zusammenarbeiten, wurde noch nicht verifiziert.

## Props und Events {#reference}

### NavMenu (`ui-nav-menu`) {#reference-nav-menu}

`NavMenu` hat keine Props und emittiert keine Events: `UINavMenuAttributes` definiert nur Kinder, die `NavMenu` aus seinem Default-Slot rendert. Die Typen beschreiben diese Kinder nicht.

| Slot | Beschreibung |
| --- | --- |
| `default` | Die Navigationslinks, etwa `<a href="/" rel="home">` im Beispiel oben. |

### `s-app-nav` {#reference-app-nav}

`s-app-nav` hat in den Typen keine Attribute. Seine Kinder sind die Navigationseinträge, angegeben als Link-Elemente: Jeder Link erzeugt einen Eintrag im Navigationsmenü der App, und ein Link mit `rel="home"` legt die Standard-Startseite fest.

Die Typen beschreiben die Attribute dieser Links:

| Attribut | Typ | Beschreibung |
| --- | --- | --- |
| `href` | `string` (erforderlich) | Der Pfad des Navigationseintrags, relativ zu Ihrer App, etwa `/products` oder `/settings`. Ein Klick navigiert die App ohne vollständiges Neuladen der Seite zu dieser Route; er sollte einer Route im Routing Ihrer App entsprechen. |
| `rel` | `"home"` | Kennzeichnet den Link als Standard-Startseite der App. Dieser Link wird im Navigationsmenü ausgeblendet, und nur ein Link sollte `rel="home"` haben. |
| `children` | `string` | Die sichtbare Beschriftung des Eintrags. Die Typen empfehlen kurze Beschriftungen (ein oder zwei Wörter), die das Ziel benennen, etwa "Products" oder "Settings". |
