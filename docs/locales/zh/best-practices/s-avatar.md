- **根据场景选择尺寸。** 在表格和列表等紧凑布局中使用较小的 `size`，在以人物为焦点的个人资料页面上使用较大的尺寸。
- **编写有用的替代文本。** 将 `alt` 设置为头像所代表的人或事物，例如某个人或公司的名称。如果该名称已经以文本形式显示在头像旁边，请改用空的 `alt`。
- **让头像紧挨它所代表的对象。** 将头像放在它所代表的名称或实体旁边，使两者在列表、表格和卡片中的关联一目了然。

```vue
<SAvatar alt="Sarah Chen" initials="SC" size="large" />
```

参阅 [Shopify 关于 `<s-avatar>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/avatar#best-practices)（英文）以获取完整指南。
