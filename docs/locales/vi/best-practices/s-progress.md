- **Dùng cho công việc đo lường được.** Dùng thanh tiến trình khi bạn có thể biểu diễn công việc như một phần của tổng thể. Khi bạn không biết việc gì đó sẽ mất bao lâu hoặc đã đi được bao xa, spinner là lựa chọn nhẹ nhàng hơn.
- **Gọi tên thứ đang tiến triển.** Đặt cho `accessibilityLabel` một mô tả chính xác, ví dụ "Importing products" hoặc "Storage used". Trình đọc màn hình đọc thanh tiến trình theo nhãn đó, và sẽ không có giá trị mặc định nếu bạn bỏ trống.
- **Thêm văn bản khi con số quan trọng.** Bản thân thanh tiến trình không hiển thị nhãn hay phần trăm, nên hãy đặt văn bản bên cạnh khi người bán cần các con số, và giữ văn bản đó đồng bộ với `value`.
- **Đặt `max` bằng tổng thực tế.** Dùng số lượng hoặc giới hạn thực, chẳng hạn có bao nhiêu file hay hạn mức lớn bao nhiêu, thay vì quy tất cả về phần trăm. Như vậy `value` sẽ dễ cập nhật khi công việc hoàn thành.
- **Chỉ dùng tone để báo hiệu vấn đề.** Dành `tone="critical"` và `tone="warning"` cho tiến trình cho thấy có vấn đề, chẳng hạn một giới hạn đã bị dùng hết. Để công việc đang tiến hành bình thường ở tone mặc định.

```vue
<SProgress accessibilityLabel="Importing products" :value="120" :max="300" />
<SText>120 of 300 products imported</SText>
```

Xem [best practices của Shopify cho `<s-progress>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/progress#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
