---
title: "@shopify/polaris-tokens からの移行"
description: "@shopify/polaris-tokens は Polaris React のトークンパッケージです。Polaris web components はこれを使いません。"
---

# `@shopify/polaris-tokens` からの移行 {#migrating-from-polaris-tokens}

`@shopify/polaris-tokens` は Polaris React のトークンパッケージです。Polaris web components
はこれを使いません。runtime が独自の変数を定義しており、ほとんどの名前はそのまま引き継がれて
います。アプリの CSS が Polaris React アプリから持ってきたものなら、下の一覧と照らし合わせて
ください。旧パッケージにしかない名前は web components アプリでは値を持たないため、それを使う
CSS には自分で書いた `var()` のフォールバック値が使われるか、何も適用されません。

<CssVariablesMigration />
