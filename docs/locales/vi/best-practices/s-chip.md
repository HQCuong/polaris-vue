- **Dùng chip để mô tả, không phải để hành động.** Chip phù hợp cho tag, trạng thái và danh mục cho người bán biết điều gì đó về nội dung. Chúng không phải button, nên khi chip cần được nhấp hoặc đóng, hãy dùng `SClickableChip`.
- **Giữ nhãn ngắn.** Văn bản ngắn như "Featured" hay "On sale" có thể đọc trong nháy mắt, còn nhãn dài làm chậm việc đọc lướt và có thể bị cắt.
- **Chọn độ nổi bật phù hợp với nội dung.** Dùng `color="subdued"` cho metadata phụ và màu mặc định cho tag và danh mục thông thường.
- **Đặt chip cạnh thứ nó mô tả.** Giữ chip bên cạnh mục mà nó gắn nhãn, và trong danh sách hãy đặt chúng ở cùng vị trí trên mỗi hàng để người bán đọc lướt nhanh.
- **Thêm icon khi có ích.** Một `SIcon` trong slot `graphic` có thể giúp nhận ra trạng thái hoặc danh mục quen thuộc dễ hơn.

```vue
<SChip>
  <SIcon slot="graphic" type="star" />
  Featured
</SChip>
<SChip color="subdued">Imported</SChip>
```

Xem [best practices của Shopify cho `<s-chip>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/chip#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
