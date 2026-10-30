- **Để khoảng cách phản ánh mối quan hệ.** Một `gap` nhỏ cho thấy các mục thuộc về nhau, còn `gap` lớn hơn tách biệt các nhóm khác nhau. Chọn khoảng cách khớp với thứ bậc nội dung của bạn.
- **Lường trước việc stack inline sẽ xuống dòng.** Với `direction="inline"`, các mục chuyển sang dòng mới khi hết chỗ. Đó thường là điều bạn muốn, nhưng nếu cần kiểm soát chính xác việc ngắt dòng hoặc nhiều hàng, hãy dùng một cách bố cục khác.
- **Đặt căn chỉnh có chủ đích.** Căn chỉnh mặc định phù hợp với hầu hết bố cục. Điều chỉnh `alignItems` hoặc `justifyContent` khi các mục có kích thước khác nhau hoặc cần vị trí cụ thể.

```vue
<SStack direction="inline" gap="small-200" alignItems="center">
  <SBadge>Draft</SBadge>
  <SText>Last edited today</SText>
</SStack>
```

Xem [best practices của Shopify cho `<s-stack>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/stack#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
