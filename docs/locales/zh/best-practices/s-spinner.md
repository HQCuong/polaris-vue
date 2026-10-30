- **用于较慢的异步操作。** 当保存表单、获取数据或处理操作等耗时超过约 500ms 时，使用 spinner。对于瞬间完成的操作，spinner 只会一闪而过，分散注意力。
- **局限于正在加载的部分。** 将 spinner 放在页面中正在加载的部分，例如正在保存的按钮或正在获取数据的 section，而不是阻塞整个界面。
- **说明正在加载的内容。** 始终设置 `accessibilityLabel`，例如“正在加载产品”或“正在保存更改”，让屏幕阅读器用户知道正在发生什么。
- **事后报告结果。** spinner 消失后，显示清晰的成功或错误消息，让商家知道操作已完成以及结果如何。

```vue
<SSpinner accessibilityLabel="Loading products" />
```

参阅 [Shopify 关于 `<s-spinner>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/spinner#best-practices)（英文）以获取完整指南。
