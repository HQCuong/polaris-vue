- **只包裹数字本身。** 将数值本身放在 `SNumber` 中，周围的文字则放在 `SText` 或 `SParagraph` 中。等宽数字能让数字整齐对齐，却会让普通文字显得参差不齐。
- **先在应用中格式化数值。** `SNumber` 控制数字的显示样式，而不负责数值的格式化，因此请自行添加货币符号、小数位和千位分隔符，以匹配商家的区域设置。
- **只在数字带有状态时使用色调。** 当数字本身传达某种信号（例如库存已售罄）时才设置 `tone`。给每个数字都加上色调，反而会让任何数字都不再突出。
- **按重要性设置数字大小。** 为商家应首先看到的数字（例如总计）设置较大的 `fontSize`，次要数字保持默认大小。

```vue
<SText>Total: </SText><SNumber fontSize="large">$1,240.50</SNumber>
<SText>In stock: </SText><SNumber tone="critical">0</SNumber>
```

参阅 [Shopify 关于 `<s-number>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/number#best-practices)（英文）以获取完整指南。
