<div align="center">

<sub>[English](../../README.md) | [Tiếng Việt](../vi/README.md) | [한국어](../ko/README.md) | [简体中文](../zh/README.md) | [日本語](../ja/README.md) | **Deutsch** | [Français](../fr/README.md)</sub>

<br>

<a href="https://polaris-vue-elements.dev/de/">
  <img src="https://polaris-vue-elements.dev/og.png" alt="polaris-vue-elements: typisierte Vue-3-Wrapper für Shopify Polaris Web Components" width="720">
</a>

<br>
<br>

[![npm version](https://img.shields.io/npm/v/polaris-vue-elements?color=008060&label=npm)](https://www.npmjs.com/package/polaris-vue-elements)
[![npm downloads](https://img.shields.io/npm/dm/polaris-vue-elements?color=008060)](https://www.npmjs.com/package/polaris-vue-elements)
[![CI](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml/badge.svg)](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/npm/l/polaris-vue-elements?color=008060)](../../LICENSE)

**[Dokumentation](https://polaris-vue-elements.dev/de/)** ·
[Erste Schritte](https://polaris-vue-elements.dev/de/guide/getting-started) ·
[Komponenten](https://polaris-vue-elements.dev/de/components/) ·
[Leitfaden für eingebettete Apps](https://polaris-vue-elements.dev/de/guide/shopify-embedded-app) ·
[Changelog](../../CHANGELOG.md)

</div>

---

> Diese Übersetzung kann hinter der englischen Fassung zurückliegen. Bei Abweichungen ist die [englische Fassung](../../README.md) maßgeblich.

Typisierte Vue-3-Wrapper-Komponenten für [Shopify Polaris Web Components](https://shopify.dev/docs/api/app-home/web-components): die `s-*` Custom Elements, mit denen Shopify-App-Home-Apps (eingebettet in den Shopify-Adminbereich) gebaut werden.

Die Polaris-Runtime selbst wird weiterhin vom CDN von Shopify geladen (der stabile Kanal `polaris-2.js` erhält kompatible Updates automatisch). Diese Bibliothek legt darüber eine idiomatische, vollständig typisierte Vue-Schnittstelle.

## Funktionen

- **Typisierte Props und Events für alle 62 Komponenten**, generiert aus dem offiziellen Custom Elements Manifest von Shopify (`@shopify/polaris-types`): Union-Typen für Props wie `variant`, Autovervollständigung in Templates, typisierte `@click`- / `@aftershow`-Listener.
- **`v-model` für 17 Formularkomponenten** (`STextField`, `SCheckbox`, `SSelect`, `SChoiceList`, …), jeweils auf das richtige Property/Event-Paar abgebildet.
- **Imperative Steuerung von Overlays.** `SModal` stellt ein typisiertes `$el` (`ModalElement`) bereit, sodass `modal.value?.$el.showOverlay()` den Type-Check besteht – zusätzlich zum deklarativen `commandFor` / `command`-Muster von Polaris.
- **Degradiert sanft, blockiert nie.** Unbekannte Props werden über `$attrs` durchgereicht, Slots unverändert weitergegeben, und brandneue Polaris-Komponenten lassen sich immer als rohe `s-*`-Tags verwenden. Ein veralteter Wrapper bedeutet fehlende Typen für neue Features, aber nie kaputte bestehende.

## Installation

```sh
npm install polaris-vue-elements
```

Vue `^3.5` ist eine Peer-Dependency.

### Runtime einrichten (erforderlich)

Die Wrapper sind rein für die Darstellung zuständig. Die Host-App lädt die Polaris-Runtime vom CDN von Shopify und teilt Vue mit, dass `s-*`-Tags Custom Elements sind:

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

> **Hinweis:** `polaris-2.js` ist der stabile Kanal von Shopify und bringt das neue visuelle Design des Adminbereichs mit. Apps, die noch `polaris-1.js` verwenden, funktionieren weiterhin: Die Komponenten-API von 2.0 entspricht der von 1.1, abgesehen von einigen Ergänzungen. Siehe [Polaris 2.0 und das neue Admin-Design](https://polaris-vue-elements.dev/de/guide/getting-started#polaris-2-0-and-the-new-admin-design).

## Schnellstart

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

> **Tipp:** Lieber direkt die `<s-button>`-Tags von Polaris schreiben? `"types": ["polaris-vue-elements/elements"]` zur `tsconfig.json` hinzufügen, dann prüfen Volar / `vue-tsc` auch rohe `<s-*>`-Tags (nur Typen; `v-model` bleibt den Wrappern vorbehalten). Siehe [Rohe `<s-*>`-Tags typisieren](https://polaris-vue-elements.dev/de/guide/getting-started#_7-typing-raw-s-tags-optional).

## Dokumentation

Alles Weitere unter **[polaris-vue-elements.dev](https://polaris-vue-elements.dev/de/)**:

- [Erste Schritte](https://polaris-vue-elements.dev/de/guide/getting-started): Einrichtung, `v-model`, Overlays und typisierte rohe Tags.
- [Eine eingebettete Shopify-App mit Vue 3 bauen](https://polaris-vue-elements.dev/de/guide/shopify-embedded-app): App Bridge, authentifiziertes `fetch`, Navigation und die Speicherleiste.
- [Bekannte Eigenheiten & Fallstricke](https://polaris-vue-elements.dev/de/guide/quirks): Verhalten von Polaris, im echten Browser überprüft.
- [Komponentenreferenz](https://polaris-vue-elements.dev/de/components/): Props, Events, Slots, Best Practices und Live-Beispiele für alle 62 Komponenten.

Der Quellcode der Website liegt in [`docs/`](../../docs); lokal starten mit `npm run docs:dev`.

## Funktionsweise

Alles, was sich aus dem Manifest von Shopify ableiten lässt, wird maschinell generiert; menschliches Urteilsvermögen steckt in einer einzigen kleinen Datei.

```
@shopify/polaris-types (custom-elements.json)   ← maßgebliche Quelle
        │  npm run generate
        ▼
src/lib/generated/        ← Metadaten, Props/Events/Element-Typen, Komponenten (NICHT BEARBEITEN)
src/lib/runtime/          ← createWrapper: eine generische Factory für alle 62 Komponenten
src/lib/overrides.ts      ← von Hand geschrieben: nur v-model-Zuordnungen
```

Drift-Guard-Tests machen Vergessen unmöglich: Die CI schlägt fehl, wenn generierter Code veraltet ist, wenn einer Komponente aus dem Manifest ein Wrapper fehlt oder wenn einer neuen formularartigen Komponente ein v-model-Override fehlt. Ein zeitgesteuerter Workflow ([`sync-polaris.yml`](../../.github/workflows/sync-polaris.yml)) öffnet automatisch einen Sync-PR, sobald eine neue Version von `@shopify/polaris-types` veröffentlicht wird.

<details>
<summary><strong>Manuell auf eine neue Polaris-Version aktualisieren</strong></summary>

```sh
npm update @shopify/polaris-types
npm run generate          # Wrapper + Typen neu generieren
npm run docs:generate     # Komponentenreferenz neu generieren
git diff                  # prüfen, dann API-Änderungen in CHANGELOG.md notieren
```

</details>

## Entwicklung

```sh
npm install
npm run dev            # Playground (src/App.vue) mit echten Polaris-Komponenten
npm run docs:dev       # Dokumentations-Website
npm run test:unit      # vitest (Drift-Guards + Wrapper-Verhalten)
npm run type-check     # vue-tsc
npm run lint           # oxlint + eslint
npm run generate       # src/lib/generated/ aus dem Manifest neu generieren
npm run docs:generate  # docs/components/ aus dem Manifest neu generieren
npm run build:lib      # veröffentlichbares Paket nach dist/ bauen
```

## Mitwirken

Fehlerberichte, Korrekturen an der Dokumentation und Pull Requests sind willkommen. Einrichtung, Grundregeln und die Checkliste vor dem PR stehen im [Leitfaden für Beiträge](./CONTRIBUTING.md); außerdem gilt der [Verhaltenskodex](./CODE_OF_CONDUCT.md). Zum Melden einer Sicherheitslücke siehe die [Sicherheitsrichtlinie](./SECURITY.md).

## Release-Prozess

Releases werden von `main` aus durch das Pushen eines Versions-Tags erstellt. [`release.yml`](../../.github/workflows/release.yml) erledigt den Rest: Prüfungen, `npm publish` mit Provenance über npm Trusted Publishing und ein GitHub Release, dessen Notes aus `CHANGELOG.md` stammen.

<details>
<summary><strong>Release-Schritte (Maintainer)</strong></summary>

1. In [`CHANGELOG.md`](../../CHANGELOG.md) die Einträge unter `## [Unreleased]` unter eine neue Überschrift `## [x.y.z] - YYYY-MM-DD` verschieben und die Vergleichslinks am Ende aktualisieren. Die polaris-types-Sync-PRs tragen neue/entfernte Komponenten dort automatisch ein; Änderungen an Props, Slots und Icons von Hand ergänzen (Entfernungen sind Breaking Changes).
2. `npm version x.y.z --no-git-tag-version` ausführen, beide Dateien committen und nach `main` pushen.
3. `git tag vx.y.z && git push origin vx.y.z`. Tags mit Pre-Release-Suffix (z. B. `v0.3.0-rc.0`) werden unter dem Dist-Tag `next` veröffentlicht.

</details>

## Lizenz

[MIT](../../LICENSE). Nicht mit Shopify verbunden und nicht von Shopify unterstützt.
