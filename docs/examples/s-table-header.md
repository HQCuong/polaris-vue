<script setup>
import STableDemo from './demos/STableDemo.vue'
</script>

<STableDemo />

```vue
<script setup>
import {
  STable,
  STableHeaderRow,
  STableHeader,
  STableBody,
  STableRow,
  STableCell,
  SBadge,
} from 'polaris-vue'
</script>

<template>
  <STable variant="auto">
    <STableHeaderRow>
      <!-- STableHeader labels a column. `format` styles cell content (e.g. currency),
           and `listSlot` designates its role when the table falls back to `list` layout. -->
      <STableHeader listSlot="primary">Order</STableHeader>
      <STableHeader listSlot="secondary">Customer</STableHeader>
      <STableHeader format="currency">Total</STableHeader>
      <STableHeader>Status</STableHeader>
    </STableHeaderRow>
    <STableBody>
      <STableRow>
        <STableCell>#1001</STableCell>
        <STableCell>Alex Morgan</STableCell>
        <STableCell>$120.00</STableCell>
        <STableCell><SBadge tone="success">Fulfilled</SBadge></STableCell>
      </STableRow>
      <STableRow>
        <STableCell>#1002</STableCell>
        <STableCell>Sam Rivera</STableCell>
        <STableCell>$45.50</STableCell>
        <STableCell><SBadge tone="warning">Pending</SBadge></STableCell>
      </STableRow>
      <STableRow>
        <STableCell>#1003</STableCell>
        <STableCell>Jamie Lee</STableCell>
        <STableCell>$310.25</STableCell>
        <STableCell><SBadge tone="critical">Cancelled</SBadge></STableCell>
      </STableRow>
    </STableBody>
  </STable>
</template>
```
