- **配合密码管理器使用。** 设置合适的 `autocomplete` 值，例如 `new-password` 或 `current-password`，让密码管理器帮助商家生成并保存强密码。
- **预先说明规则。** 在商家开始输入之前列出所有密码要求，而不是等输入无效后才显示。这样可以避免挫败感和表单被放弃。
- **引导商家创建密码。** 实时反馈密码强度，并说明如何让密码更强，而不是在没有任何说明的情况下强制执行规则。
- **允许商家粘贴。** 密码管理器及类似工具依赖粘贴功能，禁止粘贴会迫使商家使用能凭记忆输入的弱密码。
- **客户端检查仅作为反馈。** 始终在服务器上校验密码，因为浏览器端的约束很容易被绕过。客户端校验是为了快速响应，而不是为了提供安全保障。

```vue
<SPasswordField label="New password" autocomplete="new-password" details="Use at least 12 characters." />
```

参阅 [Shopify 关于 `<s-password-field>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/forms/password-field#best-practices)（英文）以获取完整指南。
