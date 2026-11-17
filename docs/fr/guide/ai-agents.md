---
title: Shopify Polaris dans Vue 3 avec des agents de code IA — llms.txt et AGENTS.md
description: Donnez aux agents de code IA la documentation de polaris-vue-elements en Markdown — llms.txt, llms-full.txt, une copie .md de chaque page et le guide AGENTS.md livré dans le package npm.
---

# Utiliser polaris-vue-elements avec des agents IA {#using-polaris-vue-elements-with-ai-agents}

Les agents de code écrivent un meilleur code Vue avec cette bibliothèque lorsqu'ils lisent
sa documentation plutôt que de deviner à partir d'exemples React ou de balises `<s-*>`
brutes. La documentation est disponible sous trois formes lisibles par les agents, et le
package npm livre un court guide écrit pour eux.

## llms.txt et llms-full.txt {#llms-txt-and-llms-full-txt}

Conformément à la convention [llms.txt](https://llmstxt.org/), le site publie :

| URL | Ce que c'est |
| --- | --- |
| [`/llms.txt`](https://polaris-vue-elements.dev/llms.txt) | Un index de la documentation en anglais : les guides, chaque composant par catégorie, App Bridge et les variables CSS, chacun avec une description d'une ligne et un lien vers sa copie Markdown. |
| [`/llms-full.txt`](https://polaris-vue-elements.dev/llms-full.txt) | Toutes les pages en anglais dans un seul fichier Markdown. |

`llms.txt` est assez petit pour être donné à un agent comme point de départ ; il suit les
liens vers les pages dont il a besoin. `llms-full.txt` est volumineux : utilisez-le lorsque
toute la référence doit tenir dans le contexte en une fois.

## Une copie Markdown de chaque page {#a-markdown-copy-of-every-page}

Chaque page en anglais existe aussi en Markdown, au même chemin avec `.md` ajouté :

```txt
https://polaris-vue-elements.dev/components/s-button.md
https://polaris-vue-elements.dev/components/s-text-field.md
https://polaris-vue-elements.dev/app-bridge/modal.md
https://polaris-vue-elements.dev/guide/quirks.md
```

La copie d'une page de composant contient son import, son binding `v-model`, ses props,
ses events, ses méthodes et ses slots, sans les démos interactives. Chaque page HTML
référence sa copie avec `<link rel="alternate" type="text/markdown">`.

## AGENTS.md dans le package npm {#agents-md-in-the-npm-package}

`polaris-vue-elements` livre `AGENTS.md`, un guide compact pour un agent qui écrit une app
Vue 3 avec la bibliothèque : installation, imports, `v-model`, App Bridge, les particularités
connues et la liste de tous les composants avec leurs balises. Comme il se trouve dans le
package, il correspond toujours à la version que vous avez installée :

```txt
node_modules/polaris-vue-elements/AGENTS.md
```

## Orienter votre agent vers ces ressources {#point-your-agent-at-it}

La plupart des agents de code lisent un fichier d'instructions du projet, tel que
`AGENTS.md`, `CLAUDE.md` ou une règle Cursor. Ajoutez quelques lignes à celui que votre
agent utilise, afin qu'il lise le guide de la bibliothèque avant d'écrire du code d'UI :

```md
## UI components

This app uses polaris-vue-elements (Vue 3 wrappers for Shopify Polaris web components).
Before writing or changing UI code, read node_modules/polaris-vue-elements/AGENTS.md.
For one component's props, events and slots, read
https://polaris-vue-elements.dev/components/<tag>.md (for example s-button.md).
```

Si votre agent ne peut pas lire les fichiers de `node_modules`, donnez-lui plutôt l'URL de
[`llms.txt`](https://polaris-vue-elements.dev/llms.txt).

## Étapes suivantes {#next-steps}

- [Prise en main](/fr/guide/getting-started) : installation, le runtime Polaris et `v-model`.
- [Particularités connues et pièges](/fr/guide/quirks) : des comportements qu'il vaut aussi la peine de mettre sous les yeux d'un agent.
- [Tous les composants](/fr/components/) : la référence dont proviennent les copies Markdown.
