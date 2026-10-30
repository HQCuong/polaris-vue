- **将其用作通用容器。** `SBox` 负责处理用于组织内容的间距、边框和背景。当需要特定排列方式（例如行或列）时，请改用 `SStack` 或 `SGrid`。
- **先看看有没有语义更明确的组件。** 如果 `SSection` 或 `SBanner` 之类的组件已经能描述内容的性质，请优先使用它们。专用组件的意图更清晰，无障碍支持也更好。
- **为小屏幕做好规划。** 在桌面端看起来正常的布局可能在移动端出问题，因此请使用响应式值来调整间距和布局，而不是固定尺寸。
- **描述区域和交互内容。** 当一个 box 标记了一个独立区域或包含交互内容时，请设置 `accessibilityRole` 和 `accessibilityLabel`，让屏幕阅读器用户能够理解并浏览该结构。
- **保持较浅的嵌套。** box 层层嵌套会让标记变得复杂，样式也难以维护。请寻找更简单的结构或更合适的布局组件。

```vue
<SBox accessibilityRole="region" accessibilityLabel="Shipping summary" padding="base" border="base">
  <!-- … -->
</SBox>
```

参阅 [Shopify 关于 `<s-box>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/box#best-practices)（英文）以获取完整指南。
