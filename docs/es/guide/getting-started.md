---
title: Primeros pasos con Shopify Polaris en Vue 3
description: Instala polaris-vue-elements, carga el runtime de los web components de Shopify Polaris y usa wrappers tipados de Vue 3 como SButton y STextField con v-model en una app Vue o una app de Shopify.
---

# Primeros pasos {#getting-started}

`polaris-vue-elements` es un conjunto de componentes tipados de Vue 3 que envuelven los web components
de Polaris de Shopify (`<s-button>`, `<s-text-field>`, `<s-modal>`, ...). Los web components
en sí se cargan en runtime desde el CDN de Shopify; esta biblioteca solo te ofrece
una interfaz de Vue tipada e idiomática (props, events, v-model) a su alrededor.

## 1. Instalación {#_1-install}

```sh
npm install polaris-vue-elements
```

## 2. Carga el runtime de Polaris {#_2-load-the-polaris-runtime}

Los componentes wrapper son solo de presentación: no incluyen las definiciones
reales de los custom elements. Tu app anfitriona debe cargar el script del runtime
de Polaris de Shopify, que registra los elementos `<s-*>` de forma global:

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

Esto funciona en cualquier app Vue, no solo dentro del admin de Shopify: los componentes son
custom elements normales y se renderizan en cualquier lugar donde se cargue el script.

`polaris-2.js` es el canal estable de Shopify y el que recomendamos para producción.
Si prefieres fijar una versión exacta, o quieres entender cómo se relaciona la versión del runtime
con la versión de esta biblioteca, consulta
[Peculiaridades y advertencias](./quirks#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version).

### Polaris 2.0 y el nuevo diseño del admin {#polaris-2-0-and-the-new-admin-design}

Polaris 2.0 trae el nuevo diseño visual del admin de Shopify (color, tipografía,
espaciado e iconos). Es estable desde el 22 de octubre de 2026
([anuncio](https://shopify.dev/changelog/posts/polaris-cdn-2-0-is-now-stable)).
Pasar desde la 1.x es opcional: cambia `polaris-1.js` por `polaris-2.js`.

- **No hace falta cambiar el código.** La 2.0 es una actualización visual: sus componentes, props,
  events y slots son los mismos que en la 1.1, más algunas novedades (como la prop
  `loading` de `SThumbnail`). Las apps que se quedan en `polaris-1.js` siguen funcionando
  con estos wrappers; solo las novedades necesitan la 2.x en runtime.
- **Se adapta al diseño de cada tienda.** Dentro del admin de Shopify, una tienda que tiene
  el nuevo diseño del admin obtiene el nuevo aspecto, y una tienda con el diseño anterior conserva
  el aspecto de la 1.x. Fuera del admin, se usa el nuevo aspecto por defecto, lo que facilita
  la vista previa en local.
- **El contenido fijo o sticky cerca de la parte inferior del viewport** debe reservar espacio
  con la variable CSS `--shopify-safe-area-inset-bottom`
  ([environment API](https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/environment-api)),
  para que la barra flotante de Sidekick no lo tape.
- **Las apps Built for Shopify** deben adoptar el nuevo estilo visual del admin antes del
  **1 de mayo de 2027**.

## 3. Configura Vite {#_3-configure-vite}

Indica al compilador de Vue que trate cualquier etiqueta `s-*` como un custom element en lugar de
intentar resolverla como un componente de Vue:

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

## 4. Tu primer componente {#_4-your-first-component}

Importa los componentes desde `polaris-vue-elements` y úsalos como cualquier otro componente
de Vue; las props y los events están completamente tipados:

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

## 5. v-model en componentes de formulario {#_5-v-model-on-form-components}

Los componentes de tipo formulario admiten `v-model`, asociado al par prop/event
subyacente correcto para cada elemento (consulta `src/lib/overrides.ts` para ver la
correspondencia completa: los de tipo texto usan `value`/`input`, `SCheckbox`/`SSwitch` usan
`checked`/`change`, `SChoiceList` usa `values`/`change`, etc.):

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

## 6. Controlar superposiciones (modal, popover, tooltip) {#_6-controlling-overlays-modal-popover-tooltip}

Los componentes de superposición como `SModal` se pueden controlar de dos maneras:

**De forma declarativa**, con los atributos HTML estándar `commandFor`/`command` en
un botón disparador, sin necesidad de script:

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

**De forma imperativa**, obteniendo una template ref tipada y llamando al método del
elemento subyacente a través de `$el`:

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

## 7. Tipar etiquetas `<s-*>` sin wrapper (opcional) {#_7-typing-raw-s-tags-optional}

Si prefieres seguir escribiendo las etiquetas propias de Polaris (`<s-button>`, `<s-text-field>`, …)
en lugar de pasarte a los wrappers, el paquete también puede tiparlas. Actívalo una sola vez, en tu
`tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["polaris-vue-elements/elements"]
  }
}
```

o con una referencia en un archivo `.d.ts` como `env.d.ts`:

```ts
/// <reference types="polaris-vue-elements/elements" />
```

Esto añade todas las etiquetas de Polaris a los `GlobalComponents` de Vue, de modo que Volar y `vue-tsc` comprueban
las etiquetas sin wrapper igual que comprueban los wrappers: props con tipos de unión, listeners `@click` /
`@aftershow` tipados y un elemento tipado para los métodos imperativos.

```vue
<template>
  <!-- error: Type '"bogus"' is not assignable to type '"auto" | "primary" | … ' -->
  <s-button variant="bogus">Save</s-button>
</template>
```

Son solo tipos: no se registra nada en runtime, así que mantén la opción `isCustomElement`
del paso 3. Dos diferencias respecto a los wrappers:

- **No hay `v-model` en las etiquetas sin wrapper.** Enlaza `:value` y escucha `@input` / `@change`
  tú mismo, o usa el componente wrapper, que asocia por ti la propiedad y el event
  de cada campo de formulario.
- **No lo combines con un shim escrito a mano** para las mismas etiquetas en tu proyecto:
  dos declaraciones de `GlobalComponents['s-button']` con tipos distintos entran en conflicto.
  Elimina el shim cuando actives esta opción.

## Próximos pasos {#next-steps}

Explora la [referencia de componentes](/es/components/) para ver la lista completa de props/events
de cada wrapper, o lee [Peculiaridades y advertencias](/es/guide/quirks) antes de
encontrártelas por tu cuenta.

¿Estás creando una app de Shopify? Consulta [Crear una app integrada de Shopify con Vue 3](/es/guide/shopify-embedded-app)
para cargar App Bridge, hacer peticiones autenticadas y usar las API de App Bridge desde Vue.
