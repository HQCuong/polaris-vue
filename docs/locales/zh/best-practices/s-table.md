- **将表格用于商家需要比较的数据。** 表格适合大量具有相同属性、需要并排浏览的记录。对于没有比较需求的简单列表，请选择更简单的组件。
- **为移动端的列表布局做好规划。** 在移动端，表格会变成列表，因此请检查表头和值在以“标签-值”对堆叠显示（而不是网格）时是否依然易读。
- **控制列数。** 列数过多会使表格难以浏览，并迫使用户水平滚动。只显示商家完成任务所需的列，并考虑按需显示其余列。
- **编写清晰的列标题。** 让每个 `STableHeader` 简短且具有描述性，让商家确切知道该列包含什么数据。
- **为大型数据集做好规划。** 大型表格会影响性能和易用性。当行数超过大约 50 到 100 行时，开启 `paginate`，或者考虑添加筛选或搜索，让商家更快找到所需记录。

```vue
<STable paginate hasNextPage>
  <STableHeaderRow>
    <STableHeader>Product</STableHeader>
    <STableHeader format="numeric">Inventory</STableHeader>
  </STableHeaderRow>
  <STableBody>
    <STableRow>
      <STableCell>Snowboard</STableCell>
      <STableCell>24</STableCell>
    </STableRow>
  </STableBody>
</STable>
```

参阅 [Shopify 关于 `<s-table>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/table#best-practices)（英文）以获取完整指南。
