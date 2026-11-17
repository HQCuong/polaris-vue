---
title: Shopify Polaris en Vue 3 con agentes de programación con IA — llms.txt y AGENTS.md
description: Da a los agentes de programación con IA la documentación de polaris-vue-elements en Markdown — llms.txt, llms-full.txt, una copia .md de cada página y la guía AGENTS.md incluida en el paquete npm.
---

# Usar polaris-vue-elements con agentes de IA {#using-polaris-vue-elements-with-ai-agents}

Los agentes de programación escriben mejor código Vue con esta biblioteca cuando leen su
documentación en lugar de adivinar a partir de ejemplos de React o de etiquetas `<s-*>` sin
procesar. La documentación está disponible en tres formas que los agentes pueden leer, y el
paquete npm incluye una guía breve escrita para ellos.

## llms.txt y llms-full.txt {#llms-txt-and-llms-full-txt}

Siguiendo la convención [llms.txt](https://llmstxt.org/), el sitio publica:

| URL | Qué es |
| --- | --- |
| [`/llms.txt`](https://polaris-vue-elements.dev/llms.txt) | Un índice de la documentación en inglés: las guías, cada componente por categoría, App Bridge y las variables CSS, cada uno con una descripción de una línea y un enlace a su copia en Markdown. |
| [`/llms-full.txt`](https://polaris-vue-elements.dev/llms-full.txt) | Todas las páginas en inglés en un solo archivo Markdown. |

`llms.txt` es lo bastante pequeño como para dárselo a un agente como punto de partida; el
agente sigue los enlaces a las páginas que necesita. `llms-full.txt` es grande, así que úsalo
cuando toda la referencia deba estar en el contexto a la vez.

## Una copia en Markdown de cada página {#a-markdown-copy-of-every-page}

Cada página en inglés existe también como Markdown en la misma ruta con `.md` añadido:

```txt
https://polaris-vue-elements.dev/components/s-button.md
https://polaris-vue-elements.dev/components/s-text-field.md
https://polaris-vue-elements.dev/app-bridge/modal.md
https://polaris-vue-elements.dev/guide/quirks.md
```

La copia de la página de un componente incluye su import, el binding de `v-model`, props,
events, métodos y slots, sin las demos interactivas. Cada página HTML enlaza su copia con
`<link rel="alternate" type="text/markdown">`.

## AGENTS.md en el paquete npm {#agents-md-in-the-npm-package}

`polaris-vue-elements` incluye `AGENTS.md`, una guía compacta para un agente que escribe una
app Vue 3 con la biblioteca: configuración, imports, `v-model`, App Bridge, las peculiaridades
conocidas y una lista de todos los componentes con sus etiquetas. Como está dentro del
paquete, siempre coincide con la versión que tienes instalada:

```txt
node_modules/polaris-vue-elements/AGENTS.md
```

## Apunta a tu agente hacia ella {#point-your-agent-at-it}

La mayoría de los agentes de programación leen un archivo de instrucciones del proyecto, como
`AGENTS.md`, `CLAUDE.md` o una regla de Cursor. Añade unas pocas líneas al que use tu agente,
para que lea la guía de la biblioteca antes de escribir código de UI:

```md
## UI components

This app uses polaris-vue-elements (Vue 3 wrappers for Shopify Polaris web components).
Before writing or changing UI code, read node_modules/polaris-vue-elements/AGENTS.md.
For one component's props, events and slots, read
https://polaris-vue-elements.dev/components/<tag>.md (for example s-button.md).
```

Si tu agente no puede leer archivos en `node_modules`, dale en su lugar la URL de
[`llms.txt`](https://polaris-vue-elements.dev/llms.txt).

## Siguientes pasos {#next-steps}

- [Primeros pasos](/es/guide/getting-started): instalación, el runtime de Polaris y `v-model`.
- [Peculiaridades y advertencias](/es/guide/quirks): comportamientos que también conviene poner delante de un agente.
- [Todos los componentes](/es/components/): la referencia de la que provienen las copias en Markdown.
