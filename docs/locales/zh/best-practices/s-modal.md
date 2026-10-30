- **只在需要专注做出决定时使用模态框。** 当商家必须做出特定选择或确认某个关键信息时才打开模态框。如果任务或工具可以直接放在页面上，就放在页面上。
- **谨慎使用。** 每个模态框都会打断商家，因此应把它当作重要时刻的最后手段，而不是默认模式。
- **突出主要操作。** 在 `primary-action` slot 中为模态框提供一个清晰、醒目的行动号召。
- **使用具体的动词作为操作标签。** “删除”“保存”或“继续”这样的按钮能告诉商家会发生什么；避免使用“是”“确定”或“提交”这类笼统的标签。
- **讲清破坏性操作的后果。** 当操作会删除或丢弃某些内容时，在模态框正文中说明商家将失去什么。
- **不要嵌套模态框。** 避免在已打开的模态框中再打开另一个模态框。

```vue
<SModal id="delete-product" heading="Delete product?">
  <SParagraph>This permanently deletes the product and its variants. You can't undo this.</SParagraph>
  <SButton slot="primary-action" tone="critical">Delete product</SButton>
  <SButton slot="secondary-actions">Cancel</SButton>
</SModal>
```

参阅 [Shopify 关于 `<s-modal>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/modal#best-practices)（英文）以获取完整指南。
