- **Use tables for data merchants compare.** Tables fit many records that share the same attributes and need to be scanned side by side. For a simple list with nothing to compare, pick a simpler component.
- **Plan for the mobile list layout.** On mobile the table turns into a list, so check that your headers and values still read well as stacked label and value pairs rather than a grid.
- **Keep the column count low.** Many columns make a table hard to scan and force horizontal scrolling. Show only the columns merchants need for their task, and consider revealing the rest on demand.
- **Write clear column headers.** Keep each `STableHeader` short and descriptive so merchants know exactly what data the column holds.
- **Plan for large datasets.** Big tables hurt performance and usability. Turn on `paginate` once you have more than roughly 50 to 100 rows, or think about adding filters or search so merchants can get to the right records quicker.

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

See [Shopify's best practices for `<s-table>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/table#best-practices) for the full guidance.
