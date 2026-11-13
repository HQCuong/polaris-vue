---
title: "Migrer depuis @shopify/polaris-tokens"
description: "@shopify/polaris-tokens est le package de tokens de Polaris React. Les web components Polaris ne l'utilisent pas : le runtime définit ses propres variables, et la plupart des noms sont conservés."
---

# Migrer depuis `@shopify/polaris-tokens` {#migrating-from-polaris-tokens}

`@shopify/polaris-tokens` est le package de tokens de Polaris React. Les web components
Polaris ne l'utilisent pas : le runtime définit ses propres variables, et la plupart des
noms sont conservés. Si le CSS de votre app provient d'une app Polaris React, vérifiez-le
à l'aide de ces listes. Un nom qui n'existe que dans l'ancien package n'a aucune valeur
dans une app à base de web components : le CSS qui l'utilise obtient alors la valeur de
repli `var()` que vous avez écrite, ou rien du tout.

<CssVariablesMigration />
