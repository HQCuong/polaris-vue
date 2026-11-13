---
title: "Migrar desde @shopify/polaris-tokens"
description: "@shopify/polaris-tokens es el paquete de tokens de Polaris React. Los web components de Polaris no lo usan: el runtime define sus propias variables, y la mayoría de los nombres se mantienen."
---

# Migrar desde `@shopify/polaris-tokens` {#migrating-from-polaris-tokens}

`@shopify/polaris-tokens` es el paquete de tokens de Polaris React. Los web components de
Polaris no lo usan: el runtime define sus propias variables, y la mayoría de los nombres se
mantienen. Si el CSS de tu app viene de una app de Polaris React, compáralo con estas listas. Un
nombre que solo existe en el paquete antiguo no tiene valor en una app con web components, así
que el CSS que lo usa recibe el fallback de `var()` que hayas escrito, o nada.

<CssVariablesMigration />
