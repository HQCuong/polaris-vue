- **自行校验 URL。** 浏览器内置的 URL 校验非常有限，且因浏览器而异，因此请针对结构、允许的协议以及你的用例所接受的格式添加自己的检查。
- **展示你期望的格式。** 告诉商家是否需要包含协议、允许哪些协议，以及需要哪种 URL。在 `placeholder` 中提供完整的示例 URL 可以把这一点说清楚。
- **决定如何处理缺少的协议。** 商家经常省略 `https://`。请决定是替他们自动补上、接受不带协议的 URL，还是显示一条说明缺少什么的 `error`。
- **根据 URL 的使用场景选择长度限制。** 浏览器和服务器能处理的最大长度各不相同，因此请根据 URL 的目标位置（而不是随意的数字）设置 `maxLength`，并在限制重要时加以说明。
- **说明 URL 的用途。** 使用 `label` 和 `details` 说明用途，因为产品图片 URL、社交主页链接和外部参考链接各自需要不同的内容。

```vue
<SUrlField label="Product image URL" placeholder="https://example.com/images/product.jpg" details="Link directly to a JPG or PNG file." />
```

参阅 [Shopify 关于 `<s-url-field>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/forms/url-field#best-practices)（英文）以获取完整指南。
