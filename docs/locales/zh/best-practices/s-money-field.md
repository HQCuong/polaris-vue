- **将 `min` 和 `max` 设为符合实际的限制。** 例如，产品价格可以使用 0.01 作为 `min`，使其不能为零；折扣可以在 0 到订单总额之间；退款金额可以以已付款金额为上限。同时，务必根据你的业务规则校验数值。
- **在 `error` 中写明具体的限制。** 不要写“金额无效”，而应写类似“价格不得低于 $0.01”的内容，让商家知道自己违反了哪项限制。
- **不要在 `label` 和 `placeholder` 中加入货币符号。** 添加“$”之类的符号可能会与字段本身已处理的货币格式冲突。
- **按用途为金额命名。** “产品基础价格”或“折扣金额”比“金额”或“价格”传达的信息更多。
- **编辑时预填 `value`。** 对于已有的值显示当前金额；对于新条目，可以考虑一个合理的默认值，例如 0.00 或常见价格。

```vue
<SMoneyField label="Product base price" :min="0.01" />
```

参阅 [Shopify 关于 `<s-money-field>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/forms/money-field#best-practices)（英文）以获取完整指南。
