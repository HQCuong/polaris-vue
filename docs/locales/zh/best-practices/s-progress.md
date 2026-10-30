- **用于可以衡量的工作。** 当工作可以表示为整体的一部分时，使用进度条。当你无法判断某件事需要多长时间或进行到哪一步时，spinner 是更轻量的选择。
- **说明进度的对象。** 为 `accessibilityLabel` 提供准确的描述，例如“正在导入产品”或“已用存储空间”。屏幕阅读器会用这个标签朗读进度条；如果省略，则没有默认值。
- **在数字重要时添加文字。** 进度条本身不显示标签或百分比，因此当商家需要具体数字时，请在旁边添加文字，并让该文字与 `value` 保持同步。
- **将 `max` 设为真实的总量。** 使用真实的数量或上限，例如文件总数或配额大小，而不是全部换算为百分比。这样随着工作完成，更新 `value` 会很简单。
- **只用色调提示问题。** 将 `tone="critical"` 和 `tone="warning"` 留给提示问题的进度，例如额度已用尽。普通的进行中工作保持默认色调。

```vue
<SProgress accessibilityLabel="Importing products" :value="120" :max="300" />
<SText>120 of 300 products imported</SText>
```

参阅 [Shopify 关于 `<s-progress>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/progress#best-practices)（英文）以获取完整指南。
