- **说明颜色的用途。** 使用“按钮背景色”或“标题文字颜色”这样的 `label`，而不是笼统的“颜色”。
- **编辑时显示当前颜色。** 将 `value` 设为现有颜色，让商家看到自己正在修改的原始值。

```vue
<SColorField label="Button background color" value="#1a1a1a" />
```

参阅 [Shopify 关于 `<s-color-field>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/forms/color-field#best-practices)（英文）以获取完整指南。
