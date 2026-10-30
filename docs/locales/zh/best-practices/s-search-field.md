- **用于就地筛选。** 它适合缩小某个特定部分或列表中的内容范围。全局导航或复杂的多步骤搜索则需要更完善的搜索模式。
- **说明搜索的内容。** 编写具体的 `label` 和 `placeholder`，告诉商家搜索涵盖哪些内容，以及可以按哪些属性进行搜索。
- **随商家输入即时响应。** 尽可能在商家输入时更新结果或筛选后的内容，让他们可以不断细化查询，并确信搜索正在生效。
- **为清空和无结果的搜索做好规划。** 清空字段后，恢复显示完整列表。没有匹配结果时，显示一条消息，建议其他操作或扩大搜索范围。
- **等待足够的输入。** 避免执行会返回过多或无意义结果的搜索；在输入两三个字符之后再开始搜索，就足以返回有用的匹配结果。

```vue
<SSearchField label="Search products" placeholder="Search by title, SKU or vendor" />
```

参阅 [Shopify 关于 `<s-search-field>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/forms/search-field#best-practices)（英文）以获取完整指南。
