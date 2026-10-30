- **使用具体的 `label`。** “客户电子邮件”或“订单通知邮箱”这样的名称比简单的“电子邮件”或“电子邮件地址”更清晰。
- **在 `details` 中补充背景信息。** 说明为什么需要该地址或它将如何使用，例如“用于接收电子收据”。
- **在 `placeholder` 中展示格式。** 像“you@example.com”这样的示例地址可以展示应输入的内容；不要只是重复标签。
- **让 `error` 消息具有可操作性。** 告诉商家如何修正地址，例如“请输入有效的电子邮件地址”。

```vue
<SEmailField
  label="Order notification email"
  details="We'll send order updates to this address."
  placeholder="you@example.com"
/>
```

参阅 [Shopify 关于 `<s-email-field>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/forms/email-field#best-practices)（英文）以获取完整指南。
