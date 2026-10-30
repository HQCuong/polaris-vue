- **Gom các hành động liên quan lại với nhau.** Nhóm các lời kêu gọi hành động thuộc cùng một tác vụ để người bán thấy được các lựa chọn và mối liên hệ giữa chúng.
- **Giữ thứ bậc thị giác.** Dùng `variant="primary"` cho button của hành động chính và `variant="secondary"` hoặc `variant="tertiary"` cho các hành động phụ để định hướng sự chú ý.
- **Đừng thêm quá nhiều button.** Một hàng dài các lựa chọn khiến người bán bị choáng ngợp và khó quyết định hơn.
- **Dùng nhóm phân đoạn cho các nút chuyển đổi.** Với các lựa chọn liên quan chặt chẽ, như chuyển chế độ xem hoặc bộ lọc, đặt `gap="none"` để nối các button thành một segmented control.
- **Tách riêng hành động phá hủy.** Đặt chúng ở vị trí có chủ đích và gán `tone="critical"` để khó bị kích hoạt nhầm.

```vue
<SButtonGroup gap="none">
  <SButton>List</SButton>
  <SButton>Grid</SButton>
</SButtonGroup>
```

Xem [best practices của Shopify cho `<s-button-group>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button-group#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
