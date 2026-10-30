- **让间距体现关系。** 较小的 `gap` 表示项目属于同一组，较大的间距则将不同的组区分开。请选择与内容层级相匹配的间距。
- **预料到 inline stack 会换行。** 使用 `direction="inline"` 时，项目在空间不足时会移到新的一行。这通常正是你想要的效果，但如果需要精确控制换行或多行排列，请改用其他布局方式。
- **有意识地设置对齐方式。** 默认对齐方式适用于大多数布局。当项目尺寸不一或需要特定定位时，调整 `alignItems` 或 `justifyContent`。

```vue
<SStack direction="inline" gap="small-200" alignItems="center">
  <SBadge>Draft</SBadge>
  <SText>Last edited today</SText>
</SStack>
```

参阅 [Shopify 关于 `<s-stack>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/stack#best-practices)（英文）以获取完整指南。
