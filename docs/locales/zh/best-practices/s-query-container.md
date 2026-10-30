- **适配容器而不是视口。** query container 让组件能够根据其容器的宽度做出响应。这对出现在不同宽度位置的组件很有帮助，例如位于侧边栏或主栏中的产品卡片。
- **有多个容器时为其命名。** 如果多个 query container 需要不同的查询，请为每个容器设置描述性的 `containerName` 以便定位；未命名的容器都会响应相同的查询。
- **将响应式值写在 props 上。** 容器为 Polaris 组件提供解析响应式 prop 值所需的上下文，例如 `padding="@container (inline-size > 500px) large-500, none"`，因此无需自己编写容器查询 CSS。
- **只在需要的地方使用。** 每个 query container 都会让浏览器跟踪其尺寸并应用条件样式，因此只在需要基于容器的响应式布局时添加，而不是包裹每一个元素。

```vue
<SQueryContainer>
  <SBox padding="@container (inline-size > 500px) large-500, none">
    <!-- … -->
  </SBox>
</SQueryContainer>
```

参阅 [Shopify 关于 `<s-query-container>` 的最佳实践](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/query-container#best-practices)（英文）以获取完整指南。
