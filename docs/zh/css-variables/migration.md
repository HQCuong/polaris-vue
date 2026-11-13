---
title: "从 @shopify/polaris-tokens 迁移"
description: "@shopify/polaris-tokens 是 Polaris React 的令牌包。Polaris web components 并不使用它： 运行时定义了自己的变量，大多数名称都沿用了下来。"
---

# 从 `@shopify/polaris-tokens` 迁移 {#migrating-from-polaris-tokens}

`@shopify/polaris-tokens` 是 Polaris React 的令牌包。Polaris web components 并不使用它：
运行时定义了自己的变量，大多数名称都沿用了下来。如果你的应用的 CSS 来自某个 Polaris React
应用，请对照下面的列表检查。只存在于旧版包中的名称在 web components 应用中没有值，
因此使用它的 CSS 只会得到你写的 `var()` 回退值，或者什么都得不到。

<CssVariablesMigration />
