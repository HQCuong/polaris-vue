<script setup>
import SNumberDemo from './demos/SNumberDemo.vue'
</script>

<div class="demo-surface">

<SNumberDemo />

</div>

```vue
<script setup>
import { SNumber, STable, STableHeaderRow, STableHeader, STableBody, STableRow, STableCell } from 'polaris-vue-elements'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const revenue = [
  { product: 'Snowboard', total: 1280.5 },
  { product: 'Ski boots', total: 342 },
  { product: 'Poles', total: 58.25 },
]
</script>

<template>
  <!-- SNumber's default slot renders the value as given — format and localize it yourself. -->
  <SNumber fontSize="large-100" fontWeight="bold">{{ currency.format(1280.5) }}</SNumber>
  <SNumber tone="success" fontWeight="semibold">{{ currency.format(342) }}</SNumber>
  <SNumber tone="critical" fontWeight="semibold">{{ currency.format(-58.25) }}</SNumber>
  <SNumber color="subdued" fontSize="small">{{ currency.format(0) }}</SNumber>

  <!-- tabular numerals line up nicely in a table column -->
  <STable variant="auto">
    <STableHeaderRow>
      <STableHeader listSlot="primary">Product</STableHeader>
      <STableHeader format="currency">Total</STableHeader>
    </STableHeaderRow>
    <STableBody>
      <STableRow v-for="row in revenue" :key="row.product">
        <STableCell>{{ row.product }}</STableCell>
        <STableCell><SNumber>{{ currency.format(row.total) }}</SNumber></STableCell>
      </STableRow>
    </STableBody>
  </STable>
</template>
```
