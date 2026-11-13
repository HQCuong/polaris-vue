---
title: "Migration von @shopify/polaris-tokens"
description: "@shopify/polaris-tokens ist das Token-Paket von Polaris React. Polaris Web Components verwenden es nicht: Die Runtime definiert ihre eigenen Variablen, und die meisten Namen bleiben gleich."
---

# Migration von `@shopify/polaris-tokens` {#migrating-from-polaris-tokens}

`@shopify/polaris-tokens` ist das Token-Paket von Polaris React. Polaris Web Components
verwenden es nicht: Die Runtime definiert ihre eigenen Variablen, und die meisten Namen
bleiben gleich. Stammt das CSS der App aus einer Polaris-React-App, lohnt ein Abgleich mit
diesen Listen. Ein Name, der nur im alten Paket existiert, hat in einer Web-Components-App
keinen Wert, sodass CSS, das ihn verwendet, den selbst angegebenen `var()`-Fallback erhält
oder gar nichts.

<CssVariablesMigration />
