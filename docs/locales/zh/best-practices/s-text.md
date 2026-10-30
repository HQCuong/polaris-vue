- **选择语义化的 `type`。** 用 `"strong"` 标记关键词或短语，用 `"address"` 表示邮寄地址或电子邮件地址，用 `"redundant"` 表示当相同内容已显示在屏幕上时为屏幕阅读器用户提供上下文的文字。选择正确的类型能让辅助技术表达出文字的含义。
- **谨慎使用强调。** 将 `type="strong"` 用于句子中的关键词或数字，而不是整个句子；强调过多会失去效果，并让文字更难浏览。
- **用色调表示行内状态。** `"critical"`、`"success"` 或 `"caution"` 等色调能吸引对状态的注意，但请搭配清晰的措辞，而不是让颜色单独传达信息。
- **不要弱化重要内容。** `color="subdued"` 适合时间戳和元数据，但不要将其用于商家必须阅读的关键信息。

```vue
<SParagraph>
  Order shipped to <SText type="address">150 Elgin St, Ottawa</SText>.
  <SText type="strong">Payment pending.</SText>
</SParagraph>
```

参阅 [Shopify 关于 `<s-text>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/text#best-practices)（英文）以获取完整指南。
