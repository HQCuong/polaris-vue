- **Chọn kích thước theo ngữ cảnh.** Dùng `size="base"` trong ô bảng, mục danh sách, hoặc bất cứ đâu có nhiều badge nằm cạnh nhau. Chỉ dùng `size="large"` cho một badge duy nhất cần được nhấn mạnh, chẳng hạn trạng thái chính hiển thị ở đầu trang.
- **Giữ nhãn trong một hoặc hai từ.** Nhãn ngắn như "Fulfilled" hay "Out of stock" giúp đọc lướt nhanh. Viết trạng thái ở thì quá khứ, ví dụ "Refunded" thay vì "Refund".
- **Chọn tone phù hợp với trạng thái.** Dùng `tone="critical"` cho lỗi hoặc vấn đề khẩn cấp cần xử lý, `tone="warning"` cho vấn đề cần chú ý, `tone="success"` cho xác nhận tích cực, và `tone="info"` cho trạng thái trung tính. Dùng cùng một tone cho cùng một trạng thái ở mọi nơi trong app của bạn.
- **Đặt badge cạnh thứ nó mô tả.** Trong một mục danh sách, đặt badge gần tiêu đề. Trong bảng, dành cho badge một cột riêng để người bán có thể đọc lướt.
- **Chỉ dùng badge cho trạng thái hệ thống.** Badge là chỉ báo tĩnh do hệ thống đặt, vì vậy đừng dùng chúng cho tag do người bán tạo hoặc cho các mục họ có thể xóa.

```vue
<SBadge tone="success">Fulfilled</SBadge>
<SBadge tone="warning">Partially refunded</SBadge>
```

Xem [best practices của Shopify cho `<s-badge>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/badge#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
