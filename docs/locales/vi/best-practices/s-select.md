- **Dùng cho một tập lựa chọn đã biết.** Select phù hợp khi người bán chọn từ một danh sách định sẵn. Khi người bán cần nhập giá trị tùy chỉnh hoặc tìm trong một danh sách dài, một text field gợi ý kết quả khớp khi họ gõ, hoặc một dropdown có thể tìm kiếm, sẽ phù hợp hơn.
- **Sắp xếp các tùy chọn có chủ đích.** Nhóm các tùy chọn liên quan, đặt những tùy chọn phổ biến nhất lên đầu, hoặc sắp xếp theo bảng chữ cái khi không có thứ tự tự nhiên, để người bán nhanh chóng tìm thấy lựa chọn của mình.
- **Viết nhãn dễ lướt.** Cho mỗi tùy chọn đủ ngữ cảnh để người bán phân biệt được các tùy chọn mà không phải mở ra và đọc qua nhiều tùy chọn.
- **Chọn trạng thái ban đầu có chủ đích.** Chọn sẵn một tùy chọn khi có một giá trị mặc định hiển nhiên, và dùng `placeholder` khi người bán nên đưa ra lựa chọn có cân nhắc. Đừng để trạng thái ban đầu mơ hồ.
- **Giải thích lỗi xác thực.** Khi một lựa chọn là bắt buộc hoặc không hợp lệ, dùng `error` để nói cụ thể người bán cần làm gì, vì thông báo được viết riêng giúp họ hoàn thành form nhanh hơn thông báo chung chung.

```vue
<SSelect label="Shipping speed" placeholder="Choose a shipping speed" required>
  <SOption value="standard">Standard (5–7 business days)</SOption>
  <SOption value="express">Express (2–3 business days)</SOption>
  <SOption value="overnight">Overnight (next business day)</SOption>
</SSelect>
```

Xem [best practices của Shopify cho `<s-select>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/select#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
