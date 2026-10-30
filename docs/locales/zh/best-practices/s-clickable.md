- **为没有可见文字的元素添加标签。** 如果可点击区域内没有可读的文字，请设置 `accessibilityLabel`，让屏幕阅读器用户知道它的用途。
- **选择合适的模式。** 将其用作按钮来触发操作，设置 `href` 用于导航，提交表单时则设置 `type="submit"`。
- **解释禁用状态。** 设置 `disabled` 时，要让该状态在视觉上清晰可辨，并添加文字告诉商家为什么该元素无法使用。

参阅 [Shopify 关于 `<s-clickable>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable#best-practices)（英文）以获取完整指南。
