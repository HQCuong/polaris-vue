- **先说明原因，再给出解决办法。** 只写一个“没有产品”的标题会让商家摸不着头脑。用 `heading` 说明为什么这里没有内容，再由操作引导下一步。
- **以一个主要操作为主。** 在 `primary-action` slot 中放置能让商家摆脱空状态的那一步操作，并将其他选项放在 `secondary-actions` 中。
- **对筛选结果使用不同的措辞。** 资源本身为空和筛选条件没有匹配到任何内容是两种不同的情况。对于筛选结果，请告诉商家如何调整筛选条件。
- **把图形当作锦上添花。** 标题和操作才是关键，因此在紧凑布局中请让 `graphic` slot 留空；如果确实要使用，也只放一个图标或一张图片。

```vue
<SEmptyState heading="You haven't added any products yet">
  <template #primary-action>
    <SButton variant="primary">Add product</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Import products</SButton>
  </template>
</SEmptyState>
```

参阅 [Shopify 关于 `<s-empty-state>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state#best-practices)（英文）以获取完整指南。
