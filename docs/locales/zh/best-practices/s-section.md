- **将相关内容归为一组。** 让每个 section 只承担一项连贯的职责，无论是相关信息还是相关控件；这样它既是一个视觉容器，也能为页面结构增添含义。
- **编写描述性的标题。** 商家会快速浏览 `heading` 来寻找方向，因此请说明其中的内容，而不是使用笼统的标题。
- **只按内容需要的深度嵌套。** 嵌套的 section 影响的是标题层级和页面大纲，而不是外观。最多保持两到三层，并且只在额外的结构能让内容更清晰时才嵌套。
- **当内容需要贯穿边缘时去掉内边距。** 对于应填满 section 的表格或图片等内容，使用 `padding="none"`，然后检查内部内容本身是否保留了足够的间距。
- **当标题不足以说明时添加 `accessibilityLabel`。** 当屏幕上的标题无法让屏幕阅读器用户明白该 section 的用途时，为其提供一个补充缺失上下文的标签。
- **选择合适的页眉 slot。** 修饰标题本身的细节（例如 tooltip 或计数）放在 `accessory` 中。关于整个 section 的信息（例如状态徽章）放在 `supplemental` 中。按钮或菜单等操作应放在 `accessory` 中，因为 `supplemental` 不接受操作。

```vue
<SSection heading="Products" padding="none">
  <STable>
    <!-- … -->
  </STable>
</SSection>
```

参阅 [Shopify 关于 `<s-section>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/section#best-practices)（英文）以获取完整指南。
