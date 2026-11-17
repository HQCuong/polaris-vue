---
title: Vue 3 में Shopify Polaris और AI coding agents — llms.txt और AGENTS.md
description: AI coding agents को polaris-vue-elements के docs Markdown में दें — llms.txt, llms-full.txt, हर page की .md copy, और npm package में आने वाली AGENTS.md गाइड।
---

# AI agents के साथ polaris-vue-elements का इस्तेमाल {#using-polaris-vue-elements-with-ai-agents}

Coding agents इस library के साथ बेहतर Vue code तब लिखते हैं जब वे इसके docs पढ़ते हैं, न कि
React examples या raw `<s-*>` tags से अंदाज़ा लगाते हैं। Docs तीन रूपों में उपलब्ध हैं जिन्हें
agents पढ़ सकते हैं, और npm package में उनके लिए लिखी एक छोटी गाइड भी आती है।

## llms.txt और llms-full.txt {#llms-txt-and-llms-full-txt}

[llms.txt](https://llmstxt.org/) convention के अनुसार, साइट ये प्रकाशित करती है:

| URL | यह क्या है |
| --- | --- |
| [`/llms.txt`](https://polaris-vue-elements.dev/llms.txt) | अंग्रेज़ी docs का एक index: गाइड, श्रेणी के अनुसार हर component, App Bridge और CSS variables, हर एक के साथ एक पंक्ति का विवरण और उसकी Markdown copy का link। |
| [`/llms-full.txt`](https://polaris-vue-elements.dev/llms-full.txt) | सभी अंग्रेज़ी pages एक ही Markdown file में। |

`llms.txt` इतनी छोटी है कि इसे agent को शुरुआती बिंदु के रूप में दिया जा सकता है; वह जिन pages की
उसे ज़रूरत होती है, उनके links पर जाता है। `llms-full.txt` बड़ी है, इसलिए इसे तब इस्तेमाल करें जब पूरा
reference एक साथ context में चाहिए।

## हर page की Markdown copy {#a-markdown-copy-of-every-page}

हर अंग्रेज़ी page उसी path पर `.md` जोड़कर Markdown के रूप में भी मौजूद है:

```txt
https://polaris-vue-elements.dev/components/s-button.md
https://polaris-vue-elements.dev/components/s-text-field.md
https://polaris-vue-elements.dev/app-bridge/modal.md
https://polaris-vue-elements.dev/guide/quirks.md
```

किसी component page की copy में उसका import, `v-model` binding, props, events, methods और
slots होते हैं, live demos के बिना। हर HTML page अपनी copy को
`<link rel="alternate" type="text/markdown">` से link करता है।

## npm package में AGENTS.md {#agents-md-in-the-npm-package}

`polaris-vue-elements` में `AGENTS.md` आती है, जो इस library से Vue 3 app लिखने वाले agent के लिए एक
संक्षिप्त गाइड है: setup, imports, `v-model`, App Bridge, ज्ञात quirks और सभी components की उनके tags
के साथ सूची। क्योंकि यह package के अंदर है, यह हमेशा आपके इंस्टॉल किए हुए version से मेल खाती है:

```txt
node_modules/polaris-vue-elements/AGENTS.md
```

## अपने agent को इसकी ओर इशारा करें {#point-your-agent-at-it}

ज़्यादातर coding agents project की एक instructions file पढ़ते हैं, जैसे `AGENTS.md`, `CLAUDE.md` या
Cursor rule। अपने agent जो file इस्तेमाल करता है उसमें कुछ पंक्तियाँ जोड़ें, ताकि वह UI code लिखने से पहले
library की गाइड पढ़े:

```md
## UI components

This app uses polaris-vue-elements (Vue 3 wrappers for Shopify Polaris web components).
Before writing or changing UI code, read node_modules/polaris-vue-elements/AGENTS.md.
For one component's props, events and slots, read
https://polaris-vue-elements.dev/components/<tag>.md (for example s-button.md).
```

अगर आपका agent `node_modules` में files नहीं पढ़ सकता, तो उसे इसके बजाय
[`llms.txt`](https://polaris-vue-elements.dev/llms.txt) का URL दें।

## अगले कदम {#next-steps}

- [शुरुआत करें](/hi/guide/getting-started): install, Polaris runtime और `v-model`।
- [ज्ञात quirks और सावधानियाँ](/hi/guide/quirks): ऐसे व्यवहार जिन्हें agent के सामने रखना भी उपयोगी है।
- [सभी components](/hi/components/): वह reference जिससे Markdown copies बनती हैं।
