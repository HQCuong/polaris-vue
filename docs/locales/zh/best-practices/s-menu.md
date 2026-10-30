- **将菜单用于次要操作。** 让“保存”等主要操作直接显示在页面上。菜单适合放置商家不常用的操作或破坏性操作，例如“归档”或“导出数据”，这些操作不需要一直占据空间。
- **标签采用“动词 + 名词”的形式。** “编辑详情”或“导出为 CSV”这样的标签准确说明了会发生什么；避免使用“选项”“更多”或“设置”这类含糊的标签。
- **将较长的菜单拆分为多个部分。** 当菜单有四个或更多项目时，用带有 `heading` 的 `SSection` 将相关操作分组，例如用“管理”放日常操作，用“危险区域”放破坏性操作。
- **添加能辅助标签的图标。** 像表示编辑的 `edit`、表示删除的 `delete` 或表示导出的 `download` 这样的图标能帮助商家识别操作，但它们应强化文字，而不能取代文字。
- **只禁用暂时不可用的操作。** 当某个操作在当前情境下不适用时（例如对已退款的订单再次退款），为该项目设置 `disabled`。如果某个操作永远不适用，就不要把它放进菜单。

```vue
<SButton commandFor="product-actions">Product actions</SButton>
<SMenu id="product-actions" accessibilityLabel="Product actions">
  <SSection heading="Manage">
    <SButton icon="edit">Edit product</SButton>
    <SButton icon="duplicate">Duplicate product</SButton>
  </SSection>
  <SSection heading="Danger zone">
    <SButton icon="archive">Archive product</SButton>
    <SButton icon="delete" tone="critical">Delete product</SButton>
  </SSection>
</SMenu>
```

参阅 [Shopify 关于 `<s-menu>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/actions/menu#best-practices)（英文）以获取完整指南。
