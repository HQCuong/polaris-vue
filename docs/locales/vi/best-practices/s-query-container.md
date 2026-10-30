- **Thích ứng theo container, không phải viewport.** Query container cho phép component phản hồi theo chiều rộng của container chứa nó. Điều này hữu ích cho các component xuất hiện ở những nơi có chiều rộng khác nhau, như một card sản phẩm trong sidebar hoặc trong cột chính.
- **Đặt tên container khi có nhiều hơn một.** Nếu nhiều query container cần các query khác nhau, hãy đặt cho mỗi container một `containerName` mang tính mô tả để bạn có thể nhắm tới nó; các container không có tên đều phản hồi cùng các query.
- **Đặt giá trị responsive trên prop.** Container cung cấp ngữ cảnh mà các component Polaris dùng để phân giải giá trị prop responsive, chẳng hạn `padding="@container (inline-size > 500px) large-500, none"`, nên bạn không cần tự viết CSS container query.
- **Chỉ dùng ở nơi cần thiết.** Mỗi query container khiến trình duyệt phải theo dõi kích thước của nó và áp dụng style có điều kiện, nên hãy chỉ thêm ở nơi bạn cần responsive theo container thay vì bọc mọi phần tử.

```vue
<SQueryContainer>
  <SBox padding="@container (inline-size > 500px) large-500, none">
    <!-- … -->
  </SBox>
</SQueryContainer>
```

Xem [best practices của Shopify cho `<s-query-container>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/query-container#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
