- **在顺序有意义时使用。** 编号列表传达顺序、优先级或排名，因此适合分步说明或排序后的建议。如果顺序无关紧要，请改用 `SUnorderedList`。
- **以相同方式书写各项。** 让每一项的语法和结构保持一致，使列表读起来顺畅。各项之间风格不一会让读者更费力。
- **让每一项保持简短。** 列表的价值在于便于快速浏览。如果某些项变得冗长或复杂，可以考虑将其拆分为独立的部分。
- **不要嵌套过深。** 一层嵌套可以组织相关要点，但超过两层就会难以理解，这说明内容需要换一种结构。

```vue
<SOrderedList>
  <SListItem>Choose a shipping carrier</SListItem>
  <SListItem>Print the shipping label</SListItem>
  <SListItem>Mark the order as fulfilled</SListItem>
</SOrderedList>
```

参阅 [Shopify 关于 `<s-ordered-list>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/ordered-list#best-practices)（英文）以获取完整指南。
