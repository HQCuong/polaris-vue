- **从合理的日期开始。** 编辑时用现有日期预填 `value`，给出建议时则用最可能的选项预填。
- **将日期限制在合理范围内。** 使用 `allow` 和 `disallow` 缩小商家可选的日期范围，例如将排期字段限制为未来的日期，或将业务字段限制为周一至周五。
- **在 `details` 中说明限制条件。** 写明“必须是未来的日期”之类的要求，让商家在选择之前就了解规则。
- **让 `error` 消息具有可操作性。** 当日期无效时，告诉商家如何修正。

参阅 [Shopify 关于 `<s-date-field>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-field#best-practices)（英文）以获取完整指南。
