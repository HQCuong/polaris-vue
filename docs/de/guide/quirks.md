---
title: Shopify Polaris Web Components in Vue – bekannte Eigenheiten
description: Im Browser verifizierte Eigenheiten der Shopify Polaris Web Components bei der Verwendung mit Vue 3 – Slot-Anforderungen, Event-Timing und v-model-Verhalten, die sich von typischen Vue-Komponentenbibliotheken unterscheiden.
---

# Bekannte Eigenheiten & Fallstricke {#known-quirks-gotchas}

Die folgenden Verhaltensweisen der zugrunde liegenden Polaris Web Components sind real
und im Browser verifiziert, entsprechen aber nicht immer dem, was man von einer
typischen Vue-Komponentenbibliothek erwartet. Wer sie vorab kennt, spart sich später
Zeit beim Debuggen.

## 1. `<SBanner>` braucht Slot-Inhalt {#_1-sbanner-needs-slot-content}

Ein `heading`-Attribut allein reicht nicht aus – `<s-banner>` wird leer gerendert,
solange es keinen Inhalt im Default-Slot hat.

```vue
<!-- ❌ Don't: renders an empty banner -->
<SBanner heading="Heads up" tone="info" />

<!-- ✅ Do: give it body content via the default slot -->
<SBanner heading="Heads up" tone="info">
  <SText>Something you should know about.</SText>
</SBanner>
```

## 2. Aktions-Slots von Modals akzeptieren nur bestimmte Button-Varianten {#_2-modal-action-slots-only-accept-specific-button-variants}

Der Slot `primary-action` von `SModal` akzeptiert nur einen einzelnen Button mit
`variant="primary"`. Polaris weist Slot-Inhalte intern manuell zu, und jeder Knoten,
der nicht passt, wird **stillschweigend verworfen** – keine Warnung, kein Fehler, er
wird einfach nicht gerendert. `secondary-actions` akzeptiert Buttons mit der `variant`
`secondary` oder `auto`.

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

## 3. Props vom Typ Number müssen gebunden werden, nicht als String-Attribute geschrieben {#_3-number-typed-props-must-be-bound-not-written-as-string-attributes}

Die Polaris-Dokumentation zeigt einfache HTML-Attribute (z. B. `rows="3"`), was in Vue
jedoch irreführend ist: Für Props vom Typ `number` erwartet `vue-tsc` einen gebundenen
Ausdruck, kein String-Literal.

```vue
<!-- ❌ Don't: vue-tsc rejects a string literal for a number prop -->
<STextArea label="Bio" rows="3" />

<!-- ✅ Do: bind it so it's passed as a number -->
<STextArea label="Bio" :rows="3" />
```

## 4. Die Slot-Zuweisung erfolgt einmalig beim Connect {#_4-slot-assignment-happens-once-at-connect-time}

Wird das `slot`-Attribut eines Kindelements geändert, nachdem das Elternelement
gemountet wurde, erfolgt keine neue Zuweisung. Soll ein Element zwischen benannten Slots
wechseln, sollte es neu gerendert werden (z. B. mit `v-if`/`:key`), statt `slot`
reaktiv zu verändern.

```vue
<!-- ❌ Don't: dynamically re-pointing `slot` after mount is a no-op -->
<SButton :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>

<!-- ✅ Do: force re-creation when the slot assignment needs to change -->
<SButton :key="isPrimary" :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>
```

## 5. Die Polaris-Runtime wird auf dem CDN versioniert – die Version dieser Bibliothek ist nicht die Version der Runtime {#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version}

Seit August 2026 folgt das Polaris-CDN der semantischen Versionierung
([Changelog](https://shopify.dev/changelog/the-polaris-cdn-is-adopting-semantic-versioning)).
Den Kanal wählen, der zum eigenen Release-Prozess passt:

| URL | Was ausgeliefert wird |
| --- | --- |
| `polaris-2.js` | Stabiler 2.x-Kanal – der neue visuelle Stil des Shopify-Adminbereichs; erhält kompatible (Minor-)Updates automatisch. **Empfohlen.** |
| `polaris-2.0.js` | Festgelegtes Release – keine Feature-, Fix- oder visuellen Änderungen, bis die Version manuell angehoben wird. |
| `polaris-1.js` | Vorheriger stabiler 1.x-Kanal. |
| `polaris.js` | Legacy-URL – liefert derzeit denselben Build wie `polaris-1.js` und wechselt nie von selbst zu einer neuen Major-Version. |

Eine neue Major-Version (wie 2.0) ist immer optional: Man ändert die Skript-URL. Polaris
2.0 ist ein visuelles Update: Sein Custom Elements Manifest
(`@shopify/polaris-types@2.0.0`) deklariert dieselben Tags, Props, Events und Slots
wie 1.1 plus einige Neuerungen (die Prop `loading` von `SThumbnail`, weitere Icons für
`STextField`), daher funktionieren diese Wrapper auch mit `polaris-1.js`.

Unabhängig vom geladenen Kanal wird die Runtime unabhängig von der installierten
Version von `polaris-vue-elements` aktualisiert. Die Version dieser Bibliothek gibt nur
an, wie aktuell die generierten **Typen und Wrapper** sind:

- Ein veralteter Wrapper macht bereits existierende Komponenten nie kaputt – ihm fehlen
  lediglich eventuell typisierte Props/Events für Features, die Shopify nach der
  letzten Generierung des Wrappers hinzugefügt hat.
- Unbekannte Props funktionieren weiterhin: Sie werden untypisiert über `$attrs` an das
  zugrunde liegende Element durchgereicht.
- Unbekannte/neue Komponenten funktionieren weiterhin: Das rohe Custom-Element-Tag direkt
  verwenden (z. B. `<s-new-component>`), bis ein typisierter Wrapper dafür generiert wird.

```vue
<template>
  <!-- A brand-new Polaris component with no polaris-vue-elements wrapper yet still works -->
  <s-new-component some-new-prop="value" />
</template>
```
