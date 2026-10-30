- **Dùng icon để truyền đạt thông tin, không phải để trang trí.** Icon nên giải thích một hành động làm gì hoặc thể hiện một trạng thái, như icon xóa trên hành động xóa hoặc dấu tích cho việc đã hoàn thành. Đừng thêm icon chỉ để cho đẹp.
- **Hãy nhất quán.** Khi một icon đã đại diện cho một hành động hay khái niệm, hãy giữ nguyên như vậy trong toàn bộ app. Nếu `edit` nghĩa là chỉnh sửa ở một chỗ, hãy dùng nó cho việc chỉnh sửa ở mọi chỗ.
- **Kết hợp icon với văn bản khi có thể.** Khi đứng một mình, ngay cả icon quen thuộc cũng có thể được hiểu theo nhiều cách. Chỉ dùng icon đơn lẻ khi không gian chật hẹp, chẳng hạn button chỉ có icon kèm `accessibilityLabel`.
- **Chọn icon được nhận biết rộng rãi.** Ưu tiên icon có ý nghĩa đã quen thuộc, như `search`, `delete` và `plus`. Nếu một icon cần giải thích, hãy chọn icon khác.
- **Để `tone` mang ý nghĩa.** Dùng `tone="critical"` cho hành động phá hủy, `tone="success"` cho trạng thái tích cực và `tone="warning"` để cảnh báo. Tone nên truyền đạt điều gì đó, không phải để trang trí.

```vue
<SIcon type="alert-triangle" tone="warning" />
```

Xem [best practices của Shopify cho `<s-icon>`](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/icon#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
