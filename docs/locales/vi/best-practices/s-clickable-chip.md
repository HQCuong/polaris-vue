- **Giữ nhãn ngắn.** Mục tiêu là một đến ba từ, ví dụ "Electronics" hay "Summer sale".
- **Chọn `color` theo mức độ quan trọng.** Dùng `color="subdued"` cho chip phụ và giữ giá trị mặc định `"base"` cho các lựa chọn thông thường.
- **Làm cho thao tác xóa dễ nhận ra.** Khi chip là `removable`, hãy kiểm tra rằng nút xóa của nó hiển thị rõ và có trạng thái hover và focus rõ ràng.
- **Nhóm các chip liên quan.** Bố trí chúng trong một `SStack` inline để chúng thẳng hàng theo chiều ngang với khoảng cách đều nhau.

```vue
<SStack direction="inline" gap="small-200">
  <SClickableChip>Electronics</SClickableChip>
  <SClickableChip color="subdued" removable>Summer sale</SClickableChip>
</SStack>
```

Xem [best practices của Shopify cho `<s-clickable-chip>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable-chip#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
