---
title: "Migrando do @shopify/polaris-tokens"
description: "O @shopify/polaris-tokens é o pacote de tokens do Polaris React. Os web components do Polaris não o usam: o runtime define as próprias variáveis, e a maioria dos nomes se mantém."
---

# Migrando do `@shopify/polaris-tokens` {#migrating-from-polaris-tokens}

O `@shopify/polaris-tokens` é o pacote de tokens do Polaris React. Os web components do Polaris
não o usam: o runtime define as próprias variáveis, e a maioria dos nomes se mantém. Se o CSS do
seu app veio de um app em Polaris React, compare-o com estas listas. Um nome que só existe no
pacote legado não tem valor em um app com web components, então o CSS que o usa recebe o
fallback de `var()` que você escreveu, ou nada.

<CssVariablesMigration />
