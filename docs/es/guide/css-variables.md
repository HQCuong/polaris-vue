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

Importa la hoja de estilos una sola vez, por ejemplo en `main.ts`:

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
que eligió el runtime sin ningún trabajo adicional. Abajo, cambia entre **Base** y **admin-next** para ver
cualquiera de los dos conjuntos de valores; un punto relleno a la mitad marca las variables cuyo
valor difiere entre ambos.

Los valores que el runtime solo aplica en condiciones adicionales (colores P3 de gama amplia,
tamaños de texto en móvil, modo de alto contraste, soporte de `corner-shape`) no se incluyen;
`tokens.css` tiene el valor por defecto de cada uno.

## Cómo se mantiene actualizada {#how-it-stays-up-to-date}

Una tarea programada lee `polaris-2.js` del CDN de Shopify cada día, extrae las variables y
abre un pull request cuando se ha añadido, eliminado o cambiado algo. Cada versión de
`polaris-vue-elements` incluye la lista tal como estaba en esa versión.

<div class="css-variables-list">

## Todas las variables {#all-variables}

<CssVariablesSpecimen />

<CssVariablesToolbar />

### Color: fondo {#color-bg}

<CssVariables group="color-bg" />

### Color: texto {#color-text}

<CssVariables group="color-text" />

### Color: borde {#color-border}

<CssVariables group="color-border" />

### Color: icono {#color-icon}

<CssVariables group="color-icon" />

### Color: otros {#color-other}

<CssVariables group="color-other" />

### Espaciado {#space}

<CssVariables group="space" />

### Radio de borde {#border-radius}

<CssVariables group="border-radius" />

### Ancho de borde {#border-width}

<CssVariables group="border-width" />

### Fuente {#font}

<CssVariables group="font" />

### Sombra {#shadow}

<CssVariables group="shadow" />

### Animación {#motion}

<CssVariables group="motion" />

### Z-index {#z-index}

<CssVariables group="z-index" />

### Ancho {#width}

<CssVariables group="width" />

### Alto {#height}

<CssVariables group="height" />

### Breakpoints {#breakpoints}

Las variables de breakpoint contienen los anchos, pero CSS no permite usar `var()` dentro de
una media query, así que escribe el valor directamente: `@media (min-width: 48rem)`.

<CssVariables group="breakpoints" />

### Otros {#other}

<CssVariables group="other" />

</div>

## Migrar desde `@shopify/polaris-tokens` {#migrating-from-polaris-tokens}

`@shopify/polaris-tokens` es el paquete de tokens de Polaris React. Los web components de
Polaris no lo usan: el runtime define sus propias variables, y la mayoría de los nombres se
mantienen. Si el CSS de tu app viene de una app de Polaris React, compáralo con estas listas. Un
nombre que solo existe en el paquete antiguo no tiene valor en una app con web components, así
que el CSS que lo usa recibe el fallback de `var()` que hayas escrito, o nada.

<CssVariablesMigration />

## Preguntas frecuentes {#faq}

### ¿Los web components de Polaris tienen variables CSS?

Sí. El runtime de Polaris (`polaris-2.js`) define unas 700 custom properties `--p-*` en
`:root` y las usa dentro de sus componentes. Shopify no las documenta, y los nombres del
runtime llevan un hash de build. `tokens.css` te da los mismos valores con nombres estables.

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
[Migrar desde `@shopify/polaris-tokens`](#migrating-from-polaris-tokens) para ver las
diferencias.

### ¿Las variables admiten modo oscuro?

No como theme de página. El runtime tiene un conjunto oscuro de valores (`admin-next-dark`),
pero solo lo aplica a partes dentro de algunos componentes, nunca a la página, así que
`tokens.css` no tiene un theme oscuro. Los valores están en `tokens.json` bajo
`themes["admin-next-dark"]` si quieres construir uno.
