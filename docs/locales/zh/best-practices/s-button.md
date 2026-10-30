- **使用清晰的动词作为标签。** 准确说明按钮的作用，例如“保存”“编辑”或“添加标签”。使用句子大小写，省略“a”“the”等冗余词，并且不要加标点。
- **`tone="critical"` 只用于破坏性操作。** 仅当操作难以或无法撤销时才使用它；一般来说，色调应与操作的重要程度相匹配。
- **让层级一目了然。** 为主要操作设置 `variant="primary"`，为辅助操作设置 `variant="secondary"`，为补充操作设置 `variant="tertiary"`，让商家能分辨出哪个操作最重要。
- **保持按钮位置一致。** 在整个应用中将按钮放在相同的位置，让商家知道去哪里找它们。
- **为仅含图标的按钮添加标签。** 如果按钮只有图标没有文字，请为其设置 `accessibilityLabel`，告诉屏幕阅读器用户它的作用。

```vue
<SButton icon="edit" accessibilityLabel="Edit product" />
```

参阅 [Shopify 关于 `<s-button>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button#best-practices)（英文）以获取完整指南。
