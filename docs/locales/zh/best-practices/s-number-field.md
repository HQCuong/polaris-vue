- **只用于纯数值。** 适用于数量、尺寸或百分比等。如果值可能包含字母或符号（例如产品代码或电话号码），请改用 `STextField`。
- **显示单位。** 使用 `prefix` 或 `suffix` 说明数字的度量单位，免得商家猜测自己输入的是美元、千克还是百分比。
- **设置符合业务规则的限制。** 提供反映实际允许范围的 `min` 和 `max` 值，在商家提交表单之前就引导他们输入有效内容。
- **校验并解释错误。** 检查每一个数值输入；校验失败时，用 `error` 准确说明问题所在以及如何修正，而不是显示一条笼统的消息。

```vue
<SNumberField label="Discount" suffix="%" :min="0" :max="100" />
```

参阅 [Shopify 关于 `<s-number-field>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/forms/number-field#best-practices)（英文）以获取完整指南。
