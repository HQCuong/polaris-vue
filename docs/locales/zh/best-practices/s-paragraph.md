- **保持段落简短。** 每段以两到四句为宜，使用通俗易懂、不含术语的语言。商家往往是快速浏览的，因此请将较长的内容拆分成小段。
- **用色调表明意图。** `tone="critical"` 适用于错误，`"caution"` 适用于警告，`"success"` 适用于确认。始终用清晰的措辞配合颜色，而不是只依赖颜色。
- **为无障碍而设计。** 对于视力正常的商家能从布局或图标中获取的上下文，添加仅供屏幕阅读器读取的文字（`accessibilityVisibility="exclusive"`），并确保带色调的文字有足够的对比度以便阅读。
- **谨慎限制行数。** `lineClamp` 在卡片或预览等狭小空间中很有用，但绝不能让截断隐藏关键信息。

参阅 [Shopify 关于 `<s-paragraph>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/paragraph#best-practices)（英文）以获取完整指南。
