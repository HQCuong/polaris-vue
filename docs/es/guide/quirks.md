---
title: Web components de Shopify Polaris en Vue — peculiaridades conocidas
description: Peculiaridades verificadas en el navegador de los web components de Shopify Polaris usados desde Vue 3 — requisitos de slots, momento de los events y comportamientos de v-model que difieren de las bibliotecas de componentes de Vue habituales.
---

# Peculiaridades y advertencias {#known-quirks-gotchas}

Estos son comportamientos reales, verificados en el navegador, de los web components
de Polaris subyacentes que no siempre coinciden con lo que esperarías si vienes de una
biblioteca de componentes de Vue típica. Leer esto antes de toparte con ellos te ahorrará
algo de tiempo de depuración.

## 1. `<SBanner>` necesita contenido en el slot {#_1-sbanner-needs-slot-content}

Un atributo `heading` por sí solo no basta: `<s-banner>` se renderiza vacío a menos
que también tenga contenido en el slot por defecto.

```vue
<!-- ❌ Don't: renders an empty banner -->
<SBanner heading="Heads up" tone="info" />

<!-- ✅ Do: give it body content via the default slot -->
<SBanner heading="Heads up" tone="info">
  <SText>Something you should know about.</SText>
</SBanner>
```

## 2. Los slots de acción del modal solo aceptan ciertas variantes de botón {#_2-modal-action-slots-only-accept-specific-button-variants}

El slot `primary-action` de `SModal` solo acepta un único botón con
`variant="primary"`. Polaris asigna el contenido de los slots manualmente por debajo, y
cualquier nodo que no coincida se **descarta en silencio**: sin aviso, sin error,
simplemente no se renderiza. `secondary-actions` acepta botones con `variant`
`secondary` o `auto`.

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

## 3. Las props de tipo número deben enlazarse, no escribirse como atributos de texto {#_3-number-typed-props-must-be-bound-not-written-as-string-attributes}

La propia documentación de Polaris muestra atributos HTML simples (p. ej. `rows="3"`),
pero eso es engañoso en Vue: para las props con tipo `number`, `vue-tsc` espera una
expresión enlazada, no un literal de cadena.

```vue
<!-- ❌ Don't: vue-tsc rejects a string literal for a number prop -->
<STextArea label="Bio" rows="3" />

<!-- ✅ Do: bind it so it's passed as a number -->
<STextArea label="Bio" :rows="3" />
```

## 4. La asignación de slots ocurre una sola vez, al conectarse {#_4-slot-assignment-happens-once-at-connect-time}

Cambiar el atributo `slot` de un hijo después de que el padre se haya montado no lo
reasigna. Si necesitas que un elemento pase de un slot con nombre a otro, vuelve a renderizarlo
(p. ej. con `v-if`/`:key`) en lugar de modificar `slot` de forma reactiva.

```vue
<!-- ❌ Don't: dynamically re-pointing `slot` after mount is a no-op -->
<SButton :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>

<!-- ✅ Do: force re-creation when the slot assignment needs to change -->
<SButton :key="isPrimary" :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>
```

## 5. El runtime de Polaris se versiona en el CDN — la versión de esta biblioteca no es la versión del runtime {#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version}

Desde agosto de 2026, el CDN de Polaris sigue el versionado semántico
([changelog](https://shopify.dev/changelog/the-polaris-cdn-is-adopting-semantic-versioning)).
Elige el canal que mejor se adapte a tu proceso de publicación:

| URL | Qué sirve |
| --- | --- |
| `polaris-2.js` | Canal estable 2.x: el nuevo estilo visual del admin de Shopify; recibe automáticamente las actualizaciones compatibles (menores). **Recomendado.** |
| `polaris-2.0.js` | Versión fijada: sin cambios de funcionalidad, correcciones ni cambios visuales hasta que muevas la versión fijada. |
| `polaris-1.js` | Canal estable 1.x anterior. |
| `polaris.js` | URL heredada: actualmente sirve el mismo build que `polaris-1.js` y nunca pasa por sí sola a una nueva versión mayor. |

Una nueva versión mayor (como la 2.0) siempre es opcional: eres tú quien cambia la URL del script. Polaris
2.0 es una actualización visual: su Custom Elements Manifest
(`@shopify/polaris-types@2.0.0`) declara las mismas etiquetas, props, events y slots
que la 1.1, más algunas novedades (la prop `loading` de `SThumbnail`, más iconos para `STextField`),
así que estos wrappers también funcionan con `polaris-1.js`.

Sea cual sea el canal que cargues, el runtime se actualiza de forma independiente de la versión
de `polaris-vue-elements` que tengas instalada. La versión de esta biblioteca solo
refleja lo actualizados que están sus **tipos y wrappers** generados:

- Un wrapper desactualizado nunca rompe componentes que ya existen; simplemente puede
  que le falten props/events tipados para funcionalidades que Shopify añadió después de la última
  vez que se generó el wrapper.
- Las props desconocidas siguen funcionando: se transmiten sin tipar mediante `$attrs` al
  elemento subyacente.
- Los componentes desconocidos o nuevos siguen funcionando: usa directamente la etiqueta del custom element
  (p. ej. `<s-new-component>`) hasta que se genere un wrapper tipado para él.

```vue
<template>
  <!-- A brand-new Polaris component with no polaris-vue-elements wrapper yet still works -->
  <s-new-component some-new-prop="value" />
</template>
```
