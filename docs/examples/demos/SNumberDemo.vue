<script setup lang="ts">
import { SNumber, STable, STableHeaderRow, STableHeader, STableBody, STableRow, STableCell } from '@lib'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const revenue = [
  { product: 'Snowboard', total: 1280.5 },
  { product: 'Ski boots', total: 342 },
  { product: 'Poles', total: 58.25 },
]
</script>

<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: baseline; margin-bottom: 12px">
    <SNumber fontSize="large-100" fontWeight="bold">{{ currency.format(1280.5) }}</SNumber>
    <SNumber tone="success" fontWeight="semibold">{{ currency.format(342) }}</SNumber>
    <SNumber tone="critical" fontWeight="semibold">{{ currency.format(-58.25) }}</SNumber>
    <SNumber color="subdued" fontSize="small">{{ currency.format(0) }}</SNumber>
  </div>

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
