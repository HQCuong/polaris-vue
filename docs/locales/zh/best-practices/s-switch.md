- **不要将开关与保存按钮搭配使用。** 开关一经切换便立即生效，因此添加保存按钮会让商家不确定更改究竟何时生效。
- **让设置项一目了然。** 编写一个 `label`，告诉商家这个开关控制什么，以及开和关分别意味着什么，免得他们必须拨动一下才能弄清楚。
- **说明后果。** 使用 `details` 解释切换开关后会发生什么变化，尤其是影响重要功能或数据的设置，让商家能够放心地做出决定。
- **将相关开关分组并排序。** 当页面上有多个开关时，将相关设置按合理的顺序放在一起，让商家能轻松找到并配置它们。
- **解释开关不可用的原因。** 当开关因权限、依赖关系或套餐限制而处于 `disabled` 状态时，告诉商家原因、是否只是暂时的，以及需要做什么才能启用它。

```vue
<SSwitch label="Send order confirmation emails" details="Customers get an email as soon as they place an order." />
```

参阅 [Shopify 关于 `<s-switch>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/forms/switch#best-practices)（英文）以获取完整指南。
