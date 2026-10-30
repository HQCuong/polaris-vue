- **根据场景选择尺寸。** 在表格单元格、列表项或多个徽章并排出现的地方使用 `size="base"`。只有需要强调的单个徽章才使用 `size="large"`，例如显示在页面顶部的主要状态。
- **标签控制在一到两个词。** 像“已发货”或“缺货”这样的短标签便于快速浏览。状态请使用表示已完成的说法，例如用“已退款”而不是“退款”。
- **让色调与状态相匹配。** 对需要处理的错误或紧急问题使用 `tone="critical"`，对需要关注的问题使用 `tone="warning"`，对正面的确认使用 `tone="success"`，对中性状态使用 `tone="info"`。同一状态在整个应用中应使用相同的色调。
- **让徽章紧挨它所描述的内容。** 在列表项中，将徽章放在标题附近。在表格中，为徽章单独设置一列，方便商家浏览。
- **仅将徽章用于系统状态。** 徽章是由系统设置的静态指示器，因此不要将其用于商家创建的标签或可以移除的项目。

```vue
<SBadge tone="success">Fulfilled</SBadge>
<SBadge tone="warning">Partially refunded</SBadge>
```

参阅 [Shopify 关于 `<s-badge>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/badge#best-practices)（英文）以获取完整指南。
