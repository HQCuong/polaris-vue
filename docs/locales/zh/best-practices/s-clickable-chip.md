- **保持标签简短。** 目标是一到三个词，例如“电子产品”或“夏季促销”。
- **按重要性选择 `color`。** 次要的 chip 使用 `color="subdued"`，标准选项保留默认的 `"base"`。
- **让移除操作易于发现。** 当 chip 为 `removable` 时，确保其移除按钮清晰可见，并具有明确的悬停和焦点状态。
- **将相关的 chip 分组。** 将它们放在一个 inline 的 `SStack` 中，使其水平排列且间距均匀。

```vue
<SStack direction="inline" gap="small-200">
  <SClickableChip>Electronics</SClickableChip>
  <SClickableChip color="subdued" removable>Summer sale</SClickableChip>
</SStack>
```

参阅 [Shopify 关于 `<s-clickable-chip>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable-chip#best-practices)（英文）以获取完整指南。
