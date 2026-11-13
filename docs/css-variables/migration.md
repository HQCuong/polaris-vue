---
title: "Migrating from @shopify/polaris-tokens"
description: "@shopify/polaris-tokens is the token package of Polaris React. Polaris web components don't use it: the runtime defines its own variables, and most names carry over."
---

# Migrating from `@shopify/polaris-tokens` {#migrating-from-polaris-tokens}

`@shopify/polaris-tokens` is the token package of Polaris React. Polaris web components
don't use it: the runtime defines its own variables, and most names carry over. If your
app's CSS came from a Polaris React app, check it against these lists. A name that's only
in the legacy package has no value in a web components app, so CSS that uses it gets the
`var()` fallback you wrote, or nothing.

<CssVariablesMigration />
