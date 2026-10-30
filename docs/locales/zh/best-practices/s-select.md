- **用于已知的选项集合。** 当商家从预定义列表中选择时，select 很合适。当商家需要输入自定义值或在很长的列表中查找时，更适合使用能在输入时提示匹配项的文本字段，或可搜索的下拉菜单。
- **有意识地排列选项。** 将相关选项分组、把最常用的放在最前面，或在没有自然顺序时按字母排序，让商家能快速找到所需选项。
- **编写便于浏览的标签。** 为每个选项提供足够的上下文，让商家无需展开并逐一阅读多个选项就能区分它们。
- **有意识地选择初始状态。** 存在明显的默认值时预先选中一个选项；当商家需要主动做出选择时，使用 `placeholder`。不要让初始状态含糊不清。
- **解释校验问题。** 当某个选择是必填项或无效时，用 `error` 具体告诉商家该怎么做，因为有针对性的消息比笼统的消息更能帮助他们更快完成表单。

```vue
<SSelect label="Shipping speed" placeholder="Choose a shipping speed" required>
  <SOption value="standard">Standard (5–7 business days)</SOption>
  <SOption value="express">Express (2–3 business days)</SOption>
  <SOption value="overnight">Overnight (next business day)</SOption>
</SSelect>
```

参阅 [Shopify 关于 `<s-select>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/forms/select#best-practices)（英文）以获取完整指南。
