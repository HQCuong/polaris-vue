- **让每个复选框相互独立。** 商家应能勾选任意组合的选项，而不会因为一个复选框影响另一个。
- **为每个复选框提供描述性的 `label`。** 当复选框用于开启或关闭某项设置时，这一点尤为重要，这样商家才能确切知道自己启用的是什么。
- **按逻辑顺序排列选项。** 按字母、数字或时间排序，让商家能快速找到想要的选项。
- **`indeterminate` 只用于部分选中的“全选”。** 当“全选”复选框所在分组中只有部分项目被勾选时，在该复选框上使用它。
- **在有助于理解时添加 `details`。** 仅当单靠标签不足以说明时，才用它进一步解释某个选项的作用。

```vue
<SCheckbox
  label="Send order confirmation emails"
  details="Customers get an email as soon as their order is placed."
/>
```

参阅 [Shopify 关于 `<s-checkbox>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/forms/checkbox#best-practices)（英文）以获取完整指南。
