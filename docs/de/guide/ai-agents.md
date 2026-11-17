---
title: Shopify Polaris in Vue 3 mit KI-Coding-Agenten – llms.txt und AGENTS.md
description: Die Dokumentation von polaris-vue-elements als Markdown für KI-Coding-Agenten bereitstellen – llms.txt, llms-full.txt, eine .md-Kopie jeder Seite und die im npm-Paket enthaltene Anleitung AGENTS.md.
---

# polaris-vue-elements mit KI-Agenten verwenden {#using-polaris-vue-elements-with-ai-agents}

Coding-Agenten schreiben besseren Vue-Code mit dieser Bibliothek, wenn sie deren
Dokumentation lesen, statt anhand von React-Beispielen oder rohen `<s-*>`-Tags zu
raten. Die Dokumentation ist in drei Formen verfügbar, die Agenten lesen können, und das
npm-Paket enthält eine kurze, für sie geschriebene Anleitung.

## llms.txt und llms-full.txt {#llms-txt-and-llms-full-txt}

Nach der Konvention [llms.txt](https://llmstxt.org/) veröffentlicht die Website:

| URL | Was es ist |
| --- | --- |
| [`/llms.txt`](https://polaris-vue-elements.dev/llms.txt) | Ein Index der englischen Dokumentation: die Leitfäden, jede Komponente nach Kategorie, App Bridge und CSS-Variablen, jeweils mit einer einzeiligen Beschreibung und einem Link auf die zugehörige Markdown-Kopie. |
| [`/llms-full.txt`](https://polaris-vue-elements.dev/llms-full.txt) | Alle englischen Seiten in einer einzigen Markdown-Datei. |

`llms.txt` ist klein genug, um es einem Agenten als Ausgangspunkt zu geben; er folgt den
Links zu den Seiten, die er braucht. `llms-full.txt` ist groß, verwenden Sie es also, wenn
die gesamte Referenz auf einmal im Kontext sein soll.

## Eine Markdown-Kopie jeder Seite {#a-markdown-copy-of-every-page}

Jede englische Seite gibt es auch als Markdown unter demselben Pfad mit angehängtem `.md`:

```txt
https://polaris-vue-elements.dev/components/s-button.md
https://polaris-vue-elements.dev/components/s-text-field.md
https://polaris-vue-elements.dev/app-bridge/modal.md
https://polaris-vue-elements.dev/guide/quirks.md
```

Die Kopie einer Komponentenseite enthält Import, `v-model`-Bindung, Props, Events,
Methoden und Slots, aber keine Live-Demos. Jede HTML-Seite verweist mit
`<link rel="alternate" type="text/markdown">` auf ihre Kopie.

## AGENTS.md im npm-Paket {#agents-md-in-the-npm-package}

`polaris-vue-elements` enthält `AGENTS.md`, eine kompakte Anleitung für einen Agenten, der
eine Vue-3-App mit der Bibliothek schreibt: Einrichtung, Imports, `v-model`, App Bridge,
die bekannten Eigenheiten und eine Liste aller Komponenten mit ihren Tags. Da sie im Paket
enthalten ist, passt sie immer zur installierten Version:

```txt
node_modules/polaris-vue-elements/AGENTS.md
```

## Den Agenten darauf hinweisen {#point-your-agent-at-it}

Die meisten Coding-Agenten lesen eine Anweisungsdatei des Projekts, etwa `AGENTS.md`,
`CLAUDE.md` oder eine Cursor-Regel. Ergänzen Sie in der Datei, die Ihr Agent verwendet,
ein paar Zeilen, damit er die Anleitung der Bibliothek liest, bevor er UI-Code schreibt:

```md
## UI components

This app uses polaris-vue-elements (Vue 3 wrappers for Shopify Polaris web components).
Before writing or changing UI code, read node_modules/polaris-vue-elements/AGENTS.md.
For one component's props, events and slots, read
https://polaris-vue-elements.dev/components/<tag>.md (for example s-button.md).
```

Wenn Ihr Agent keine Dateien in `node_modules` lesen kann, geben Sie ihm stattdessen die
URL von [`llms.txt`](https://polaris-vue-elements.dev/llms.txt).

## Nächste Schritte {#next-steps}

- [Erste Schritte](/de/guide/getting-started): Installation, die Polaris-Runtime und `v-model`.
- [Bekannte Eigenheiten & Fallstricke](/de/guide/quirks): Verhaltensweisen, die auch ein Agent kennen sollte.
- [Alle Komponenten](/de/components/): die Referenz, aus der die Markdown-Kopien stammen.
