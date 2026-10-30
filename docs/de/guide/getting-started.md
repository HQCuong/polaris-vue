---
title: Erste Schritte mit Shopify Polaris in Vue 3
description: polaris-vue-elements installieren, die Runtime der Shopify Polaris Web Components laden und typisierte Vue 3 Wrapper wie SButton und STextField mit v-model in einer Vue-App oder Shopify-App verwenden.
---

# Erste Schritte {#getting-started}

`polaris-vue-elements` ist eine Sammlung typisierter Vue 3 Komponenten, die die Polaris
Web Components von Shopify (`<s-button>`, `<s-text-field>`, `<s-modal>`, ...) umschließen.
Die Web Components selbst werden zur Laufzeit vom CDN von Shopify geladen – diese
Bibliothek bietet lediglich eine typisierte, idiomatische Vue-Schnittstelle (Props,
Events, v-model) darum herum.

## 1. Installation {#_1-install}

```sh
npm install polaris-vue-elements
```

## 2. Die Polaris-Runtime laden {#_2-load-the-polaris-runtime}

Die Wrapper-Komponenten dienen nur der Darstellung – sie liefern keine eigentlichen
Custom-Element-Definitionen mit. Die Host-App muss das Polaris-Runtime-Skript von
Shopify laden, das die `<s-*>`-Elemente global registriert:

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

Das funktioniert in jeder Vue-App, nicht nur innerhalb des Shopify-Adminbereichs – die
Komponenten sind gewöhnliche Custom Elements und werden überall gerendert, wo das
Skript geladen ist.

`polaris-2.js` ist der stabile Kanal von Shopify und unsere Empfehlung für die Produktion.
Um stattdessen ein exaktes Release festzulegen oder um zu verstehen, wie die
Runtime-Version mit der Version dieser Bibliothek zusammenhängt, siehe
[Bekannte Eigenheiten & Fallstricke](./quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version).

### Polaris 2.0 und das neue Admin-Design {#polaris-2-0-and-the-new-admin-design}

Polaris 2.0 bringt das neue visuelle Design des Shopify-Adminbereichs (Farben,
Typografie, Abstände und Icons). Seit dem 22. Oktober 2026 ist es stabil
([Ankündigung](https://shopify.dev/changelog/posts/polaris-cdn-2-0-is-now-stable)).
Der Umstieg von 1.x ist optional: `polaris-1.js` durch `polaris-2.js` ersetzen.

- **Keine Codeänderungen nötig.** 2.0 ist ein visuelles Update: Komponenten, Props,
  Events und Slots sind dieselben wie in 1.1, ergänzt um einige Neuerungen (etwa die
  Prop `loading` von `SThumbnail`). Apps, die bei `polaris-1.js` bleiben, funktionieren
  weiterhin mit diesen Wrappern; nur die Neuerungen erfordern 2.x zur Laufzeit.
- **Es folgt dem Design des jeweiligen Shops.** Im Shopify-Adminbereich erhält ein Shop
  mit dem neuen Admin-Design das neue Aussehen, während ein Shop mit dem bisherigen
  Design das Aussehen von 1.x behält. Außerhalb des Adminbereichs wird standardmäßig das
  neue Aussehen verwendet, was eine lokale Vorschau erleichtert.
- **Fixierte oder sticky Inhalte am unteren Rand des Viewports** sollten mit der
  CSS-Variable `--shopify-safe-area-inset-bottom` Platz reservieren
  ([Environment API](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api)),
  damit die schwebende Sidekick-Leiste sie nicht verdeckt.
- **Built for Shopify Apps** müssen bis zum **1. Mai 2027** dem neuen visuellen Stil
  des Adminbereichs entsprechen.

## 3. Vite konfigurieren {#_3-configure-vite}

Den Vue-Compiler anweisen, jedes `s-*`-Tag als Custom Element zu behandeln, statt es
als Vue-Komponente aufzulösen:

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

## 4. Die erste Komponente {#_4-your-first-component}

Komponenten aus `polaris-vue-elements` importieren und wie jede andere Vue-Komponente
verwenden – Props und Events sind vollständig typisiert:

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

## 5. v-model bei Formular-Komponenten {#_5-v-model-on-form-components}

Formularartige Komponenten unterstützen `v-model`, abgebildet auf das passende
Prop/Event-Paar des jeweiligen Elements (die vollständige Zuordnung steht in
`src/lib/overrides.ts` – Textfelder verwenden `value`/`input`, `SCheckbox`/`SSwitch`
verwenden `checked`/`change`, `SChoiceList` verwendet `values`/`change` usw.):

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

## 6. Overlays steuern (Modal, Popover, Tooltip) {#_6-controlling-overlays-modal-popover-tooltip}

Overlay-Komponenten wie `SModal` lassen sich auf zwei Arten steuern:

**Deklarativ**, mit den standardmäßigen HTML-Attributen `commandFor`/`command` an
einem auslösenden Button – ganz ohne Skript:

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

**Imperativ**, über ein typisiertes Template-Ref, mit dem die Methode des
zugrunde liegenden Elements über `$el` aufgerufen wird:

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

## 7. Rohe `<s-*>`-Tags typisieren (optional) {#_7-typing-raw-s-tags-optional}

Wer lieber weiterhin die Polaris-eigenen Tags (`<s-button>`, `<s-text-field>`, …)
schreibt, statt auf die Wrapper umzusteigen, kann sie vom Paket trotzdem typisieren
lassen. Dazu einmalig in der `tsconfig.json` aktivieren:

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/elements"]
  }
}
```

oder mit einer Referenz in einer `.d.ts`-Datei wie `env.d.ts`:

```ts
/// <reference types="polaris-vue-elements/elements" />
```

Dadurch wird jedes Polaris-Tag zu den `GlobalComponents` von Vue hinzugefügt, sodass
Volar und `vue-tsc` rohe Tags genauso prüfen wie die Wrapper: Props mit Union-Typen,
typisierte `@click`- / `@aftershow`-Listener und ein typisiertes Element für
imperative Methoden.

```vue
<template>
  <!-- error: Type '"bogus"' is not assignable to type '"auto" | "primary" | … ' -->
  <s-button variant="bogus">Save</s-button>
</template>
```

Es handelt sich nur um Typen: Zur Laufzeit wird nichts registriert, daher die
Einstellung `isCustomElement` aus Schritt 3 beibehalten. Zwei Unterschiede zu den
Wrappern:

- **Kein `v-model` bei rohen Tags.** `:value` selbst binden und auf `@input` / `@change`
  hören, oder die Wrapper-Komponente verwenden, die Property und Event jedes
  Formularfelds automatisch zuordnet.
- **Nicht mit einem selbst geschriebenen Shim** für dieselben Tags im Projekt
  kombinieren – zwei Deklarationen von `GlobalComponents['s-button']` mit
  unterschiedlichen Typen geraten in Konflikt. Den Shim beim Aktivieren entfernen.

## Nächste Schritte {#next-steps}

In der [Komponentenreferenz](/de/components/) finden sich alle Props und Events jedes
Wrappers. Lesenswert ist außerdem [Bekannte Eigenheiten & Fallstricke](/de/guide/quirks),
bevor man selbst darauf stößt.

Eine Shopify-App entwickeln? Siehe [Eine eingebettete Shopify-App mit Vue 3 bauen](/de/guide/shopify-embedded-app)
zum Laden von App Bridge, zu authentifizierten Requests und zu App-Bridge-APIs aus Vue.
