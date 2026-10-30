- **将相关操作放在一起。** 把属于同一任务的行动号召分为一组，让商家能看到可选项以及它们之间的关系。
- **保持视觉层级。** 对主要操作的按钮使用 `variant="primary"`，对辅助操作使用 `variant="secondary"` 或 `variant="tertiary"`，以引导注意力。
- **不要添加过多按钮。** 一长排选项会让商家无所适从，更难做出决定。
- **对切换类选项使用分段按钮组。** 对于紧密相关的选项（例如切换视图或筛选条件），设置 `gap="none"` 将按钮合并为一个分段控件。
- **将破坏性操作单独区分。** 有意识地安排它们的位置，并设置 `tone="critical"`，使其不容易被误触。

```vue
<SButtonGroup gap="none">
  <SButton>List</SButton>
  <SButton>Grid</SButton>
</SButtonGroup>
```

参阅 [Shopify 关于 `<s-button-group>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button-group#best-practices)（英文）以获取完整指南。
