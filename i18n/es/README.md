<div align="center">

<sub>[English](../../README.md) | [Tiếng Việt](../vi/README.md) | [한국어](../ko/README.md) | [简体中文](../zh/README.md) | [日本語](../ja/README.md) | [Deutsch](../de/README.md) | [Français](../fr/README.md) | **Español**</sub>

<br>

<a href="https://polaris-vue-elements.dev/es/">
  <img src="https://polaris-vue-elements.dev/og.png" alt="polaris-vue-elements: wrappers tipados de Vue 3 para los web components de Shopify Polaris" width="720">
</a>

<br>
<br>

[![npm version](https://img.shields.io/npm/v/polaris-vue-elements?color=008060&label=npm)](https://www.npmjs.com/package/polaris-vue-elements)
[![npm downloads](https://img.shields.io/npm/dm/polaris-vue-elements?color=008060)](https://www.npmjs.com/package/polaris-vue-elements)
[![CI](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml/badge.svg)](https://github.com/HQCuong/polaris-vue/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/npm/l/polaris-vue-elements?color=008060)](../../LICENSE)

**[Documentación](https://polaris-vue-elements.dev/es/)** ·
[Primeros pasos](https://polaris-vue-elements.dev/es/guide/getting-started) ·
[Componentes](https://polaris-vue-elements.dev/es/components/) ·
[Guía de app integrada](https://polaris-vue-elements.dev/es/guide/shopify-embedded-app) ·
[Changelog](../../CHANGELOG.md)

</div>

---

> Esta traducción puede ir por detrás de la versión en inglés. En caso de discrepancia, prevalece la [versión en inglés](../../README.md).

Componentes wrapper de Vue 3 tipados para los [web components de Shopify Polaris](https://shopify.dev/docs/api/app-home/web-components): los custom elements `s-*` que se usan para crear apps de Shopify App Home (integradas en el admin de Shopify).

El runtime de Polaris se carga desde el CDN de Shopify (el canal estable `polaris-2.js` recibe automáticamente las actualizaciones compatibles). Esta biblioteca te ofrece encima una superficie de Vue idiomática y completamente tipada.

## Características

- **Props y events tipados para los 62 componentes**, generados a partir del Custom Elements Manifest oficial de Shopify (`@shopify/polaris-types`): props con tipos unión como `variant`, autocompletado en los templates y listeners `@click` / `@aftershow` tipados.
- **`v-model` en 17 componentes de formulario** (`STextField`, `SCheckbox`, `SSelect`, `SChoiceList`, …), cada uno asociado a su par correcto de propiedad/evento.
- **Control imperativo de superposiciones.** `SModal` expone un `$el` tipado (`ModalElement`), de modo que `modal.value?.$el.showOverlay()` pasa la comprobación de tipos, junto al patrón declarativo `commandFor` / `command` de Polaris.
- **Se degrada con elegancia, nunca bloquea.** Las props desconocidas se transmiten mediante `$attrs`, los slots se reenvían tal cual y los componentes de Polaris más recientes siempre se pueden usar como etiquetas `s-*` sin wrapper. Un wrapper desactualizado solo implica tipos ausentes para las nuevas funciones, nunca que las existentes dejen de funcionar.

## Instalación

```sh
npm install polaris-vue-elements
```

Vue `^3.5` es una peer dependency.

### Configuración del runtime (obligatoria)

Los wrappers son solo de presentación. Tu app anfitriona carga el runtime de Polaris desde el CDN de Shopify e indica a Vue que las etiquetas `s-*` son custom elements:

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

> **Nota:** `polaris-2.js` es el canal estable de Shopify y trae el nuevo diseño visual del admin. Las apps que siguen en `polaris-1.js` continúan funcionando: la API de componentes de la 2.0 es la misma que la de la 1.1, salvo algunas incorporaciones. Consulta [Polaris 2.0 y el nuevo diseño del admin](https://polaris-vue-elements.dev/es/guide/getting-started#polaris-2-0-and-the-new-admin-design).

## Inicio rápido

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

> **Consejo:** ¿prefieres escribir directamente las etiquetas `<s-button>` de Polaris? Añade `"types": ["polaris-vue-elements/elements"]` a tu `tsconfig.json`, y Volar / `vue-tsc` también comprobarán los tipos de las etiquetas `<s-*>` sin wrapper (solo tipos; `v-model` sigue siendo exclusivo de los wrappers). Consulta [Tipar etiquetas `<s-*>` sin wrapper](https://polaris-vue-elements.dev/es/guide/getting-started#_7-typing-raw-s-tags-optional).

## Documentación

Todo está en **[polaris-vue-elements.dev](https://polaris-vue-elements.dev/es/)**:

- [Primeros pasos](https://polaris-vue-elements.dev/es/guide/getting-started): configuración, `v-model`, superposiciones y etiquetas sin wrapper tipadas.
- [Crea una app integrada de Shopify con Vue 3](https://polaris-vue-elements.dev/es/guide/shopify-embedded-app): App Bridge, `fetch` autenticado, navegación y la barra de guardado.
- [Peculiaridades conocidas](https://polaris-vue-elements.dev/es/guide/quirks): comportamientos de Polaris verificados en un navegador real.
- [Referencia de componentes](https://polaris-vue-elements.dev/es/components/): props, events, slots, buenas prácticas y ejemplos interactivos de los 62 componentes.

El código fuente del sitio está en [`docs/`](../../docs); ejecútalo en local con `npm run docs:dev`.

## Cómo funciona

Todo lo que se puede derivar del manifest de Shopify se genera automáticamente; el criterio humano vive en un único archivo pequeño.

```
@shopify/polaris-types (custom-elements.json)   ← source of truth
        │  npm run generate
        ▼
src/lib/generated/        ← metadata, Props/Events/Element types, components (DO NOT EDIT)
src/lib/runtime/          ← createWrapper: one generic factory for all 62 components
src/lib/overrides.ts      ← hand-written: v-model mappings only
```

Los tests anti-deriva (drift guards) hacen imposible olvidarse de algo: la CI falla si el código generado está desactualizado, si a un componente del manifest le falta su wrapper o si a un nuevo componente de tipo formulario le falta un override de v-model. Un workflow programado ([`sync-polaris.yml`](../../.github/workflows/sync-polaris.yml)) abre automáticamente una PR de sincronización cuando se publica una nueva versión de `@shopify/polaris-types`.

<details>
<summary><strong>Actualizar manualmente a una nueva versión de Polaris</strong></summary>

```sh
npm update @shopify/polaris-types
npm run generate          # regenerate wrappers + types
npm run docs:generate     # regenerate component reference docs
git diff                  # review, then note API changes in CHANGELOG.md
```

</details>

## Desarrollo

```sh
npm install
npm run dev            # playground (src/App.vue) with live Polaris components
npm run docs:dev       # documentation site
npm run test:unit      # vitest (drift guards + wrapper behavior)
npm run type-check     # vue-tsc
npm run lint           # oxlint + eslint
npm run generate       # regenerate src/lib/generated/ from the manifest
npm run docs:generate  # regenerate docs/components/ from the manifest
npm run build:lib      # build the publishable package into dist/
```

## Contribuir

Los informes de errores, las correcciones de documentación y las pull requests son bienvenidos. Consulta la [guía de contribución](./CONTRIBUTING.md) para la configuración, las reglas básicas y la lista de comprobación previa a la PR, así como el [código de conducta](./CODE_OF_CONDUCT.md). Para informar de una vulnerabilidad, consulta la [política de seguridad](./SECURITY.md).

## Publicación de versiones

Las versiones se publican desde `main` al hacer push de una etiqueta de versión. [`release.yml`](../../.github/workflows/release.yml) se encarga del resto: comprobaciones, `npm publish` con procedencia (provenance) mediante npm Trusted Publishing y una GitHub Release cuyas notas provienen de `CHANGELOG.md`.

<details>
<summary><strong>Pasos de publicación (mantenedores)</strong></summary>

1. En [`CHANGELOG.md`](../../CHANGELOG.md), mueve las entradas de `## [Unreleased]` bajo un nuevo encabezado `## [x.y.z] - YYYY-MM-DD` y actualiza los enlaces de comparación al final del archivo. Las PR de sincronización de polaris-types registran ahí automáticamente los componentes añadidos/eliminados; añade a mano los cambios de props, slots e iconos (las eliminaciones son cambios incompatibles).
2. `npm version x.y.z --no-git-tag-version`, haz commit de ambos archivos y haz push a `main`.
3. `git tag vx.y.z && git push origin vx.y.z`. Las etiquetas con sufijo de prelanzamiento (p. ej. `v0.3.0-rc.0`) se publican bajo el dist-tag `next`.

</details>

## Licencia

[MIT](../../LICENSE). Este proyecto no está afiliado a Shopify ni cuenta con su respaldo.
