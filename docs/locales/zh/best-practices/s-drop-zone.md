- **用 `accept` 说明文件限制。** 为拖放区接受的文件类型设置明确的限制。
- **处理 `droprejected` 并给出有帮助的消息。** 当文件未通过验证时，监听该事件并告诉商家出了什么问题。
- **处理期间考虑使用 `disabled`。** 上传期间禁用拖放区，可以防止商家在此期间继续添加文件。

```vue
<SDropZone label="Product images" accept="image/*" />
```

参阅 [Shopify 关于 `<s-drop-zone>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/forms/drop-zone#best-practices)（英文）以获取完整指南。
