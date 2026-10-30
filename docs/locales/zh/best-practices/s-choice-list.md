- **让选择模式与选项相匹配。** 对互斥的选项（例如付款方式或配送速度）保持单选；当商家可以选择多个选项时，设置 `multiple`。
- **让选项标签描述结果。** “新订单的电子邮件通知”比“电子邮件”传达的信息更多。标签要简短，但要清晰到可以独立理解。
- **将 `label` 写成问题或陈述。** 像“选择哪种配送方式？”或“选择通知偏好”这样的标题，比“选项”或“设置”这类含糊的词更能让商家明白。
- **在 `details` slot 中解释复杂的选项。** 当商家需要了解选择某个选项意味着什么时，为该 `SChoice` 添加详细说明。
- **让 `error` 消息具体明确。** 准确告诉商家缺少什么，例如“请至少选择一项通知偏好”，而不是笼统的“必填字段”。

```vue
<SChoiceList label="Which shipping method?">
  <SChoice value="standard">Standard shipping</SChoice>
  <SChoice value="express">
    Express shipping
    <template #details>
      <SText>Costs more, but orders arrive in 1–2 business days.</SText>
    </template>
  </SChoice>
</SChoiceList>
```

参阅 [Shopify 关于 `<s-choice-list>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list#best-practices)（英文）以获取完整指南。
