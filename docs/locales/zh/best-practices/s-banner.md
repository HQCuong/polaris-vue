- **每个横幅只讲一件事。** 每个横幅应只承载一条消息或一个必需的操作，避免商家不清楚它的用意。
- **便于快速浏览。** 文字要足够简短，让商家一眼就能理解消息内容以及下一步该做什么。
- **为商家提供下一步操作。** 使用 `tone="info"`、`tone="warning"` 或 `tone="critical"` 的横幅应包含一个行动号召，具体说明如何继续。
- **允许商家关闭横幅。** 除非消息需要立即处理，否则请设置 `dismissible`，并避免使用一直停留在屏幕上且无法关闭的横幅。
- **按作用范围放置横幅。** 关于整个页面的消息，将横幅放在所有 section 之外；与某个 section 的内容相关时，则放在该 section 内部。

```vue
<SBanner heading="Shipping rates need updating" tone="warning" dismissible>
  Some of your shipping zones have no rates, so customers there can't check out.
  <template #secondary-actions>
    <SButton variant="secondary">Review shipping zones</SButton>
  </template>
</SBanner>
```

参阅 [Shopify 关于 `<s-banner>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner#best-practices)（英文）以获取完整指南。
