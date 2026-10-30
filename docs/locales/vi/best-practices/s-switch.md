- **Đừng kết hợp switch với nút lưu.** Switch có hiệu lực ngay khi được bật/tắt, nên thêm nút lưu sẽ khiến người bán không chắc khi nào thay đổi thực sự được áp dụng.
- **Làm rõ thiết lập.** Viết `label` cho người bán biết switch điều khiển gì và bật hay tắt nghĩa là gì, để họ không phải gạt thử mới biết.
- **Mô tả hệ quả.** Dùng `details` để giải thích điều gì thay đổi khi switch được bật/tắt, đặc biệt với các thiết lập ảnh hưởng đến tính năng hoặc dữ liệu quan trọng, để người bán có thể quyết định một cách tự tin.
- **Nhóm và sắp xếp các switch liên quan.** Khi một trang có nhiều switch, hãy giữ các thiết lập liên quan ở cạnh nhau theo thứ tự hợp lý để người bán dễ tìm và cấu hình.
- **Giải thích vì sao switch không khả dụng.** Khi một switch bị vô hiệu hóa (`disabled`) do quyền hạn, phụ thuộc hoặc giới hạn của gói, hãy cho người bán biết lý do, đó có phải là tạm thời không, và họ cần làm gì để mở khóa.

```vue
<SSwitch label="Send order confirmation emails" details="Customers get an email as soon as they place an order." />
```

Xem [best practices của Shopify cho `<s-switch>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/switch#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
