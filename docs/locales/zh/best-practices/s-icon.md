- **用图标传达信息，而不是装饰。** 图标应说明某个操作的作用或展示某种状态，例如删除操作上的删除图标，或表示已完成的对勾。不要仅仅为了美观而添加图标。
- **保持一致。** 一旦某个图标代表了某个操作或概念，就在整个应用中保持不变。如果 `edit` 在一处表示编辑，那么在所有地方都用它表示编辑。
- **尽可能将图标与文字搭配使用。** 即使是常见的图标，单独出现时也可能有多种理解。只在空间紧张时单独使用图标，例如带有 `accessibilityLabel` 的仅图标按钮。
- **选择广为人知的图标。** 优先使用含义约定俗成的图标，例如 `search`、`delete` 和 `plus`。如果一个图标需要解释，请换一个。
- **让 `tone` 承载含义。** 破坏性操作使用 `tone="critical"`，正面状态使用 `tone="success"`，需要谨慎时使用 `tone="warning"`。色调应传达信息，而不是用于装饰。

```vue
<SIcon type="alert-triangle" tone="warning" />
```

参阅 [Shopify 关于 `<s-icon>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/icon#best-practices)（英文）以获取完整指南。
