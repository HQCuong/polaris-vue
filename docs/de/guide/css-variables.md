---
title: Shopify Polaris CSS-Variablen & Design-Tokens (Web Components)
description: Alle Polaris Design-Tokens, die die Runtime der Shopify Web Components definiert, mit Live-Vorschau, Suche und Kopierfunktion. Als tokens.css für das eigene CSS der App importierbar.
schema: TechArticle
---

# Polaris CSS-Variablen (Design-Tokens) {#css-variables}

Polaris Web Components bringen ihr eigenes Styling mit, aber eine App hat meist auch
eigenes CSS: ein Seitenraster, eine eigene Karte, eine Diagrammlegende, einen Abstand
zwischen zwei Komponenten. Mit den Polaris CSS-Variablen nutzt dieses CSS dieselben
Farben, Abstände, Radien und Schriften wie die umgebenden Komponenten und passt so zum
Design des Adminbereichs, statt auf fest codierten Schätzwerten zu beruhen.

`polaris-vue-elements` liefert sie als ein einziges Stylesheet, `tokens.css`, aus der
Polaris-Runtime extrahiert, die die App lädt.

::: warning Inoffiziell
Shopify veröffentlicht keine Liste der CSS-Variablen für Polaris Web Components. Diese
Namen und Werte werden aus der Runtime von Shopify (`polaris-2.js`) extrahiert. Die Werte
folgen daher dem CDN, und ein Name kann sich ändern oder verschwinden, wenn Shopify ihn
umbenennt. Die Liste wird täglich geprüft
(siehe [Wie sie aktuell bleibt](#how-it-stays-up-to-date)).
:::

## Wann sie sinnvoll sind {#when-to-use}

- **Verwenden** für Elemente, die der App selbst gehören: Wrapper, Layout-Container,
  eigene Widgets, Text, der außerhalb von Polaris-Komponenten gerendert wird.
- **Nicht verwenden**, um Polaris-Komponenten umzustylen. Jede Komponente wird in ihrem
  eigenen Shadow Root gerendert, daher färbt `--p-color-bg-fill-brand` auf der Seite
  `<SButton>` nicht um. Stattdessen die Props der Komponente nutzen (`tone`, `variant`,
  `padding`, …).
- **Zuerst Layout-Komponenten bevorzugen.** `<SStack>`, `<SGrid>` und `<SBox>` nehmen
  Polaris-Werte für Abstände, Innenabstände und Rahmen bereits als Props entgegen.
  CSS-Variablen erst dann einsetzen, wenn diese nicht abdecken, was gebraucht wird.

## Installation {#install}

Das Stylesheet einmal importieren, zum Beispiel in `main.ts`:

```ts
import 'polaris-vue-elements/tokens.css'
```

Danach die Variablen in beliebigem CSS verwenden:

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

Die rohen Namen und Werte gibt es auch als JSON, für Tooling oder CSS-in-JS:

```ts
import tokens from 'polaris-vue-elements/tokens.json'

tokens.tokens['--p-space-400'] // '1rem'
```

## Themes {#themes}

Die Runtime kennt zwei Erscheinungsbilder. Ein Shop mit dem bisherigen Admin-Design
erhält die Basiswerte (den `:root`-Block in `tokens.css`). Ein Shop mit dem neuen
Admin-Design sowie jede Seite außerhalb des Shopify-Adminbereichs erhält das Theme
`admin-next`: Sobald die erste Polaris-Komponente gerendert wird, fügt die Runtime die
Klasse `p-partial-theme-admin-next` zu `<html>` hinzu, und `tokens.css` überschreibt unter
genau dieser Klasse die abweichenden Werte. Das eigene CSS folgt so ohne zusätzlichen
Aufwand dem Theme, das die Runtime gewählt hat. Unten lässt sich zwischen **Basis** und
**admin-next** umschalten, um jeweils deren Werte zu sehen; ein halb gefüllter Punkt
markiert Variablen, deren Wert sich zwischen den beiden unterscheidet.

Werte, die die Runtime nur unter zusätzlichen Bedingungen anwendet (P3-Farben mit großem
Farbraum, Schriftgrößen für Mobilgeräte, Hochkontrastmodus, Unterstützung für
`corner-shape`), sind nicht enthalten; `tokens.css` enthält jeweils den Standardwert.

## Wie sie aktuell bleibt {#how-it-stays-up-to-date}

Ein geplanter Job liest täglich `polaris-2.js` aus dem CDN von Shopify, extrahiert die
Variablen und öffnet einen Pull Request, sobald etwas hinzugefügt, entfernt oder geändert
wurde. Jedes Release von `polaris-vue-elements` enthält die Liste zum Stand dieses
Releases.

<div class="css-variables-list">

## Alle Variablen {#all-variables}

<CssVariablesSpecimen />

<CssVariablesToolbar />

### Farbe: Hintergrund {#color-bg}

<CssVariables group="color-bg" />

### Farbe: Text {#color-text}

<CssVariables group="color-text" />

### Farbe: Rahmen {#color-border}

<CssVariables group="color-border" />

### Farbe: Icon {#color-icon}

<CssVariables group="color-icon" />

### Farbe: Sonstige {#color-other}

<CssVariables group="color-other" />

### Abstände {#space}

<CssVariables group="space" />

### Eckenradius {#border-radius}

<CssVariables group="border-radius" />

### Rahmenbreite {#border-width}

<CssVariables group="border-width" />

### Schrift {#font}

<CssVariables group="font" />

### Schatten {#shadow}

<CssVariables group="shadow" />

### Motion {#motion}

<CssVariables group="motion" />

### Z-Index {#z-index}

<CssVariables group="z-index" />

### Breite {#width}

<CssVariables group="width" />

### Höhe {#height}

<CssVariables group="height" />

### Breakpoints {#breakpoints}

Breakpoint-Variablen enthalten die Breiten, aber CSS kann `var()` nicht in einer Media
Query verwenden. Den Wert daher direkt schreiben: `@media (min-width: 48rem)`.

<CssVariables group="breakpoints" />

### Sonstige {#other}

<CssVariables group="other" />

</div>

## Migration von `@shopify/polaris-tokens` {#migrating-from-polaris-tokens}

`@shopify/polaris-tokens` ist das Token-Paket von Polaris React. Polaris Web Components
verwenden es nicht: Die Runtime definiert ihre eigenen Variablen, und die meisten Namen
bleiben gleich. Stammt das CSS der App aus einer Polaris-React-App, lohnt ein Abgleich mit
diesen Listen. Ein Name, der nur im alten Paket existiert, hat in einer Web-Components-App
keinen Wert, sodass CSS, das ihn verwendet, den selbst angegebenen `var()`-Fallback erhält
oder gar nichts.

<CssVariablesMigration />

## Häufige Fragen {#faq}

### Haben Polaris Web Components CSS-Variablen?

Ja. Die Polaris-Runtime (`polaris-2.js`) definiert rund 700 `--p-*` Custom Properties auf
`:root` und verwendet sie in ihren Komponenten. Shopify dokumentiert sie nicht, und die
Namen in der Runtime tragen einen Build-Hash. `tokens.css` stellt dieselben Werte unter
stabilen Namen bereit.

### Kann ich eine Polaris-Komponente mit diesen Variablen umstylen?

Nein. Jede Komponente wird in ihrem eigenen Shadow Root gerendert und liest die eigenen,
gehashten Variablen der Runtime. Wird `--p-color-bg-fill-brand` auf der Seite gesetzt,
ändert sich `<SButton>` daher nicht. Stattdessen die Props der Komponente nutzen, etwa
`tone` und `variant`. Die Variablen sind für die eigenen Elemente rund um die Komponenten
gedacht.

### Warum enden die Variablennamen in den DevTools auf einen Hash wie `-6e076`?

Die Runtime hängt an jeden Namen ein buildspezifisches Suffix an
(`--p-color-bg-surface-6e076`), und dieses Suffix ändert sich von Build zu Build. Diese
Namen also nicht ins eigene CSS kopieren: `tokens.css` entfernt das Suffix, sodass
`var(--p-color-bg-surface)` auch dann weiter funktioniert, wenn Shopify einen neuen Build
ausliefert.

### Worin unterscheidet sich das von `@shopify/polaris-tokens`?

`@shopify/polaris-tokens` ist das Token-Paket für Polaris React. Diese Liste stammt direkt
aus der Runtime der Web Components und enthält daher die Tokens, die die Komponenten
tatsächlich verwenden, einschließlich der Werte für das neue Admin-Design (`admin-next`).
Die meisten Namen sind gleich; die Unterschiede zeigt
[Migration von `@shopify/polaris-tokens`](#migrating-from-polaris-tokens).

### Unterstützen die Variablen den Dark Mode?

Nicht als Theme für die Seite. Die Runtime hat zwar einen dunklen Wertesatz
(`admin-next-dark`), wendet ihn aber nur auf Teile innerhalb einiger Komponenten an, nie
auf die Seite. Deshalb hat `tokens.css` kein dunkles Theme. Wer eines bauen möchte, findet
die Werte in `tokens.json` unter `themes["admin-next-dark"]`.
