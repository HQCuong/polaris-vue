---
title: Shopify Polaris in Vue 3 with AI coding agents — llms.txt and AGENTS.md
description: Give AI coding agents the polaris-vue-elements docs as Markdown — llms.txt, llms-full.txt, a .md copy of every page, and the AGENTS.md guide shipped in the npm package.
---

# Using polaris-vue-elements with AI agents

Coding agents write better Vue code with this library when they read its docs instead of
guessing from React examples or raw `<s-*>` tags. The docs are available in three forms
that agents can read, and the npm package ships a short guide written for them.

## llms.txt and llms-full.txt

Following the [llms.txt](https://llmstxt.org/) convention, the site publishes:

| URL | What it is |
| --- | --- |
| [`/llms.txt`](https://polaris-vue-elements.dev/llms.txt) | An index of the English docs: the guides, every component by category, App Bridge and CSS variables, each with a one-line description and a link to its Markdown copy. |
| [`/llms-full.txt`](https://polaris-vue-elements.dev/llms-full.txt) | All English pages in one Markdown file. |

`llms.txt` is small enough to give an agent as a starting point; it follows the links to the
pages it needs. `llms-full.txt` is large, so use it when the whole reference should be in
context at once.

## A Markdown copy of every page

Every English page also exists as Markdown at the same path with `.md` added:

```txt
https://polaris-vue-elements.dev/components/s-button.md
https://polaris-vue-elements.dev/components/s-text-field.md
https://polaris-vue-elements.dev/app-bridge/modal.md
https://polaris-vue-elements.dev/guide/quirks.md
```

A component page's copy has its import, `v-model` binding, props, events, methods and
slots, without the live demos. Each HTML page links its copy with
`<link rel="alternate" type="text/markdown">`.

## AGENTS.md in the npm package

`polaris-vue-elements` ships `AGENTS.md`, a compact guide for an agent writing a Vue 3 app
with the library: setup, imports, `v-model`, App Bridge, the known quirks and a list of all
components with their tags. Because it is inside the package, it always matches the version
you have installed:

```txt
node_modules/polaris-vue-elements/AGENTS.md
```

## Point your agent at it

Most coding agents read a project instructions file, such as `AGENTS.md`, `CLAUDE.md` or a
Cursor rule. Add a few lines to the one your agent uses, so it reads the library's guide
before it writes UI code:

```md
## UI components

This app uses polaris-vue-elements (Vue 3 wrappers for Shopify Polaris web components).
Before writing or changing UI code, read node_modules/polaris-vue-elements/AGENTS.md.
For one component's props, events and slots, read
https://polaris-vue-elements.dev/components/<tag>.md (for example s-button.md).
```

If your agent can't read files in `node_modules`, give it the
[`llms.txt`](https://polaris-vue-elements.dev/llms.txt) URL instead.

## Next steps

- [Getting started](/guide/getting-started): install, the Polaris runtime and `v-model`.
- [Known quirks & gotchas](/guide/quirks): behaviors worth putting in front of an agent too.
- [All components](/components/): the reference the Markdown copies come from.
