- **将 tooltip 用于额外的、非必要的细节。** 它适合那些有助于理解但并非必需的信息。绝不要将错误、必要信息或必须遵循的说明藏在 tooltip 中。
- **与仅图标按钮搭配使用。** 图标按钮需要 tooltip 来说明其作用；请写明操作，如有键盘快捷键也一并注明。
- **保持文字简短。** 一个简短的短语或句子最为理想。如果内容较长，它可能值得放在界面中更显眼的位置。
- **把大量 tooltip 视为警示信号。** 如果界面需要大量 tooltip 才能让人理解，请改进标签、布局或信息架构。
- **别忘了触屏设备。** tooltip 只在桌面端有效，不会在触摸屏上显示，因此在移动端请默认显示重要信息。

```vue
<SButton icon="delete" accessibilityLabel="Delete product" interestFor="delete-tip" />
<STooltip id="delete-tip">Delete product</STooltip>
```

参阅 [Shopify 关于 `<s-tooltip>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/tooltip#best-practices)（英文）以获取完整指南。
