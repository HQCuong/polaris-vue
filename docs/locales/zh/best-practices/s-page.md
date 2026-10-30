- **为每个页面设置标题。** 将 `heading` 设为能描述商家当前所在页面的标题。
- **在流程中添加面包屑。** 当页面是某个较大流程中的一步时，在 `breadcrumb-actions` slot 中放置返回的链接。
- **页眉操作应作用于整个页面。** 只有适用于整个页面（而不是其中某一部分）的操作才放在页眉中。
- **限制操作的数量。** 一个页面最多使用一个主要操作和三个次要操作。
- **页面底部不要放置操作。** 不要在页面末尾放置任何操作。

```vue
<SPage heading="Edit product">
  <template #breadcrumb-actions>
    <SLink href="/products">Products</SLink>
  </template>
  <template #primary-action>
    <SButton variant="primary">Save</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Duplicate</SButton>
    <SButton>Archive</SButton>
  </template>
  <!-- … -->
</SPage>
```

参阅 [Shopify 关于 `<s-page>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page#best-practices)（英文）以获取完整指南。
