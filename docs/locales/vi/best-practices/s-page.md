- **Đặt tiêu đề cho mọi trang.** Đặt `heading` thành một tiêu đề mô tả trang mà người bán đang xem.
- **Thêm breadcrumb khi trang nằm trong một luồng.** Khi trang là một bước trong một luồng lớn hơn, hãy đặt các liên kết quay lại trong slot `breadcrumb-actions`.
- **Hành động ở header phải áp dụng cho cả trang.** Chỉ đặt hành động ở header khi chúng áp dụng cho toàn bộ trang, không phải cho một phần của trang.
- **Giới hạn số lượng hành động.** Dùng tối đa một hành động chính và ba hành động phụ trên một trang.
- **Không đặt hành động ở cuối trang.** Đừng đặt bất kỳ hành động nào ở cuối trang.

```vue
<SPage heading="Edit product">
  <template #breadcrumb-actions>
    <SLink href="/products">Products</SLink>
  </template>
  <template #primary-action>
    <SButton variant="primary">Save</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Duplicate</SButton>
    <SButton>Archive</SButton>
  </template>
  <!-- … -->
</SPage>
```

Xem [best practices của Shopify cho `<s-page>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
