- **Size it to the context.** Pick a smaller `size` for dense layouts such as tables and lists, and a larger one on profile pages where the person is the focus.
- **Write useful alt text.** Set `alt` to who or what the avatar represents, such as a person's or company's name. If that name already appears as text beside the avatar, use an empty `alt` instead.
- **Keep it next to what it represents.** Place the avatar right beside the name or entity it stands for, so the connection is clear in lists, tables and cards.

```vue
<SAvatar alt="Sarah Chen" initials="SC" size="large" />
```

See [Shopify's best practices for `<s-avatar>`](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/avatar#best-practices) for the full guidance.
