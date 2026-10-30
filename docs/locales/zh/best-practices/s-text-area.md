- **根据预期的回答设置大小。** 可见的 `rows` 数量暗示了应写多少内容：较矮的文本区域引导简短的回答，较高的则要求更多细节。
- **设置符合实际需求的长度限制。** 根据内容的实际需要选择 `minLength` 和 `maxLength`，并提前告知商家这些限制。
- **将占位符用作示例。** 编写能展示你期望的内容类型、格式和语气的 `placeholder` 文字，而不是重复该字段的用途。
- **显示剩余空间。** 当你限制最大长度时，让商家看到还剩多少字符，以便在不超出限制的情况下完成内容。

```vue
<STextArea label="Product description" :rows="6" :maxLength="500" placeholder="Handwoven from organic cotton, this throw adds warmth to any room." />
```

参阅 [Shopify 关于 `<s-text-area>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-area#best-practices)（英文）以获取完整指南。
