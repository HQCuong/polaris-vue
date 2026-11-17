---
title: Shopify Polaris no Vue 3 com agentes de código de IA — llms.txt e AGENTS.md
description: Dê aos agentes de código de IA a documentação do polaris-vue-elements em Markdown — llms.txt, llms-full.txt, uma cópia .md de cada página e o guia AGENTS.md incluído no pacote npm.
---

# Usando o polaris-vue-elements com agentes de IA {#using-polaris-vue-elements-with-ai-agents}

Agentes de código escrevem um código Vue melhor com esta biblioteca quando leem a documentação
dela em vez de adivinhar a partir de exemplos em React ou de tags `<s-*>` puras. A documentação
está disponível em três formas que os agentes conseguem ler, e o pacote npm inclui um guia curto
escrito para eles.

## llms.txt e llms-full.txt {#llms-txt-and-llms-full-txt}

Seguindo a convenção [llms.txt](https://llmstxt.org/), o site publica:

| URL | O que é |
| --- | --- |
| [`/llms.txt`](https://polaris-vue-elements.dev/llms.txt) | Um índice da documentação em inglês: os guias, cada componente por categoria, App Bridge e variáveis CSS, cada um com uma descrição de uma linha e um link para a sua cópia em Markdown. |
| [`/llms-full.txt`](https://polaris-vue-elements.dev/llms-full.txt) | Todas as páginas em inglês em um único arquivo Markdown. |

O `llms.txt` é pequeno o bastante para ser entregue a um agente como ponto de partida; ele segue
os links para as páginas de que precisa. O `llms-full.txt` é grande, então use-o quando toda a
referência precisar estar no contexto de uma só vez.

## Uma cópia em Markdown de cada página {#a-markdown-copy-of-every-page}

Toda página em inglês também existe em Markdown, no mesmo caminho com `.md` adicionado:

```txt
https://polaris-vue-elements.dev/components/s-button.md
https://polaris-vue-elements.dev/components/s-text-field.md
https://polaris-vue-elements.dev/app-bridge/modal.md
https://polaris-vue-elements.dev/guide/quirks.md
```

A cópia de uma página de componente tem o import, o binding de `v-model`, props, events, methods e
slots, sem as demos ao vivo. Cada página HTML aponta para a sua cópia com
`<link rel="alternate" type="text/markdown">`.

## AGENTS.md no pacote npm {#agents-md-in-the-npm-package}

O `polaris-vue-elements` inclui o `AGENTS.md`, um guia compacto para um agente que escreve um app
Vue 3 com a biblioteca: configuração, imports, `v-model`, App Bridge, as peculiaridades conhecidas
e uma lista de todos os componentes com suas tags. Como está dentro do pacote, ele sempre
corresponde à versão que você instalou:

```txt
node_modules/polaris-vue-elements/AGENTS.md
```

## Aponte o seu agente para ele {#point-your-agent-at-it}

A maioria dos agentes de código lê um arquivo de instruções do projeto, como `AGENTS.md`,
`CLAUDE.md` ou uma regra do Cursor. Adicione algumas linhas ao que o seu agente usa, para que ele
leia o guia da biblioteca antes de escrever código de UI:

```md
## UI components

This app uses polaris-vue-elements (Vue 3 wrappers for Shopify Polaris web components).
Before writing or changing UI code, read node_modules/polaris-vue-elements/AGENTS.md.
For one component's props, events and slots, read
https://polaris-vue-elements.dev/components/<tag>.md (for example s-button.md).
```

Se o seu agente não consegue ler arquivos em `node_modules`, entregue a ele a URL do
[`llms.txt`](https://polaris-vue-elements.dev/llms.txt).

## Próximos passos {#next-steps}

- [Primeiros passos](/pt/guide/getting-started): instalação, o runtime do Polaris e `v-model`.
- [Peculiaridades e armadilhas](/pt/guide/quirks): comportamentos que também vale a pena colocar diante de um agente.
- [Todos os componentes](/pt/components/): a referência de onde vêm as cópias em Markdown.
