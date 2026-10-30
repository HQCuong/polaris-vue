- **让预期输入一目了然。** 编写 `label` 和 `placeholder`，告诉商家应输入什么以及使用什么格式。含糊的措辞会导致猜测、校验错误和挫败感。
- **用前缀或后缀补充上下文。** 使用 `prefix` 和 `suffix` 显示值的类型及格式，例如商家应输入完整 URL 还是仅输入子域名，应输入完整价格还是仅输入金额。
- **根据实际需求设置约束。** 依据真实的业务需求（而不是随意的数字）设置 `minLength`、`maxLength` 和校验规则，并告诉商家这些约束是什么。
- **尽早给出具体的反馈。** 在商家输入时就告诉他们输入是否有效，而不是只在提交时才提示。输入无效时，用 `error` 说明问题所在以及如何修正。

```vue
<STextField label="Store address" prefix="https://" suffix=".myshopify.com" />
```

参阅 [Shopify 关于 `<s-text-field>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field#best-practices)（英文）以获取完整指南。
