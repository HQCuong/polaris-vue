- **用 chip 来描述，而不是执行操作。** chip 适合用作标签、状态和分类，向商家说明内容的相关信息。它们不是按钮，因此当 chip 需要被点击或移除时，请改用 `SClickableChip`。
- **保持标签简短。** “精选”或“促销中”这样的简短文字一眼就能看懂，而较长的标签会拖慢浏览速度，还可能被截断。
- **让视觉权重与内容相匹配。** 次要的元数据使用 `color="subdued"`，普通标签和分类使用默认颜色。
- **将 chip 放在它所描述的内容旁边。** 让 chip 紧挨它所标注的项目；在列表中，每一行都将其放在相同位置，便于商家快速浏览。
- **在有帮助时添加图标。** 在 `graphic` slot 中放入 `SIcon`，可以让状态或常见分类更容易识别。

```vue
<SChip>
  <SIcon slot="graphic" type="star" />
  Featured
</SChip>
<SChip color="subdued">Imported</SChip>
```

参阅 [Shopify 关于 `<s-chip>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/chip#best-practices)（英文）以获取完整指南。
