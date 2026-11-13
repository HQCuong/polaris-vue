---
title: Variables CSS y design tokens de Shopify Polaris (web components)
description: Todos los design tokens de Polaris que define el runtime de los web components de Shopify, con vistas previas en vivo, búsqueda y copia. Impórtalos como tokens.css para el CSS de tu propia app.
schema: TechArticle
---

# Variables CSS de Polaris (design tokens) {#css-variables}

Los web components de Polaris se aplican sus propios estilos, pero tu app suele tener algo de
CSS propio: una cuadrícula de página, una tarjeta personalizada, la leyenda de un gráfico, un
espacio entre dos componentes. Las variables CSS de Polaris permiten que ese CSS use los mismos
colores, espaciados, radios y fuentes que los componentes que lo rodean, de modo que coincida
con el diseño del admin en lugar de depender de valores escritos a mano.

`polaris-vue-elements` las incluye en una sola hoja de estilos, `tokens.css`, extraída del
runtime de Polaris que carga tu app.

::: warning No oficial
Shopify no publica una lista de variables CSS para los web components de Polaris. Estos nombres
y valores se extraen del runtime de Shopify (`polaris-2.js`), así que los valores siguen al
CDN, y un nombre puede cambiar o desaparecer si Shopify lo renombra. La lista se comprueba a
diario (consulta [Cómo se mantiene actualizada](#how-it-stays-up-to-date)).
:::

## Cuándo usarlas {#when-to-use}

- **Sí** úsalas para los elementos que controla tu app: contenedores, contenedores de layout,
  widgets personalizados, texto que renderizas fuera de los componentes de Polaris.
- **No** intentes cambiar el estilo de los componentes de Polaris con ellas. Cada componente se
  renderiza dentro de su propio shadow root, así que definir `--p-color-bg-fill-brand` en tu
  página no cambiará el color de `<SButton>`. Usa en su lugar las props del componente
  (`tone`, `variant`, `padding`, …).
- **Prefiere primero los componentes de layout.** `<SStack>`, `<SGrid>` y `<SBox>` ya aceptan
  como props los valores de espaciado, padding y borde de Polaris. Recurre a las variables CSS
  cuando no cubran lo que necesitas.

## Instalación {#install}

Importa la hoja de estilos una sola vez, por ejemplo en `main.ts`. La necesitas incluso si tu app se ejecuta dentro del admin de Shopify ([por qué](#need-tokens-in-admin)):

```ts
import 'polaris-vue-elements/tokens.css'
```

Después usa las variables en cualquier CSS:

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

Los nombres y valores en bruto también están disponibles como JSON, para herramientas o
CSS-in-JS:

```ts
import tokens from 'polaris-vue-elements/tokens.json'

tokens.tokens['--p-space-400'] // '1rem'
```

## Themes {#themes}

El runtime tiene dos aspectos. Una tienda con el diseño anterior del admin recibe los valores
base (el bloque `:root` de `tokens.css`). Una tienda con el nuevo diseño del admin, y cualquier
página fuera del admin de Shopify, recibe el theme `admin-next`: cuando se renderiza el primer
componente de Polaris, el runtime añade la clase `p-partial-theme-admin-next` a `<html>`, y
`tokens.css` sobrescribe bajo esa misma clase los valores que difieren. Tu CSS sigue el theme
que eligió el runtime sin ningún trabajo adicional. En [Todas las variables](/es/css-variables/reference), cambia entre **Base** y **admin-next** para ver
cualquiera de los dos conjuntos de valores; un punto relleno a la mitad marca las variables cuyo
valor difiere entre ambos.

Los valores que el runtime solo aplica en condiciones adicionales (colores P3 de gama amplia,
tamaños de texto en móvil, modo de alto contraste, soporte de `corner-shape`) no se incluyen;
`tokens.css` tiene el valor por defecto de cada uno.

## Cómo se mantiene actualizada {#how-it-stays-up-to-date}

Una tarea programada lee `polaris-2.js` del CDN de Shopify cada día, extrae las variables y
abre un pull request cuando se ha añadido, eliminado o cambiado algo. Cada versión de
`polaris-vue-elements` incluye la lista tal como estaba en esa versión.

- [Todas las variables](/es/css-variables/reference)
- [Migrar desde `@shopify/polaris-tokens`](/es/css-variables/migration)

## Preguntas frecuentes {#faq}

### ¿Los web components de Polaris tienen variables CSS?

Sí. El runtime de Polaris (`polaris-2.js`) define unas 700 custom properties `--p-*` en
`:root` y las usa dentro de sus componentes. Shopify no las documenta, y los nombres del
runtime llevan un hash de build. `tokens.css` te da los mismos valores con nombres estables.

### Mi app se ejecuta dentro del admin de Shopify. ¿Sigo necesitando `tokens.css`? {#need-tokens-in-admin}

Sí. El runtime define las variables solo con nombres con hash, como
`--p-color-bg-surface-6e076`, y nunca como `--p-color-bg-surface`, así que sin `tokens.css`,
`var(--p-color-bg-surface)` no se resuelve a nada. El hash cambia con cada build de Shopify,
por lo que tampoco puedes usar los nombres con hash. El CSS propio del admin no llega a tu
app, porque una app incrustada se ejecuta en un iframe.

### ¿Puedo cambiar el estilo de un componente de Polaris con estas variables?

No. Cada componente se renderiza dentro de su propio shadow root y lee las variables con hash
del propio runtime, así que definir `--p-color-bg-fill-brand` en tu página no cambia
`<SButton>`. Usa las props del componente, como `tone` y `variant`. Las variables son para tus
propios elementos alrededor de los componentes.

### ¿Por qué los nombres de las variables en DevTools terminan en un hash como `-6e076`?

El runtime añade a cada nombre un sufijo propio de cada build (`--p-color-bg-surface-6e076`), y
el sufijo cambia de un build a otro. No copies esos nombres en tu CSS: `tokens.css` elimina el
sufijo, así que `var(--p-color-bg-surface)` sigue funcionando cuando Shopify publica un build
nuevo.

### ¿En qué se diferencia de `@shopify/polaris-tokens`?

`@shopify/polaris-tokens` es el paquete de tokens de Polaris React. Esta lista proviene del
propio runtime de los web components, así que tiene los tokens que los componentes usan de
verdad, incluidos los valores del nuevo diseño del admin (`admin-next`). La mayoría de los
nombres son compartidos; consulta
[Migrar desde `@shopify/polaris-tokens`](/es/css-variables/migration#migrating-from-polaris-tokens) para ver las
diferencias.

### ¿Las variables admiten modo oscuro?

No como theme de página. El runtime tiene un conjunto oscuro de valores (`admin-next-dark`),
pero solo lo aplica a partes dentro de algunos componentes, nunca a la página, así que
`tokens.css` no tiene un theme oscuro. Los valores están en `tokens.json` bajo
`themes["admin-next-dark"]` si quieres construir uno.
