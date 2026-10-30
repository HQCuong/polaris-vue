- **Tự xác thực URL.** Khả năng xác thực URL có sẵn của trình duyệt rất tối thiểu và khác nhau giữa các trình duyệt, nên hãy tự thêm các kiểm tra về cấu trúc, giao thức được phép và các định dạng mà trường hợp sử dụng của bạn chấp nhận.
- **Hiển thị định dạng bạn mong đợi.** Cho người bán biết có cần kèm giao thức không, những giao thức nào được phép và bạn muốn loại URL nào. Một URL ví dụ đầy đủ trong `placeholder` sẽ làm rõ điều này.
- **Quyết định cách xử lý khi thiếu giao thức.** Người bán thường bỏ quên `https://`. Hãy chọn tự thêm cho họ, chấp nhận URL không có nó, hoặc hiển thị `error` giải thích phần còn thiếu.
- **Chọn giới hạn độ dài theo nơi URL được dùng.** Trình duyệt và server hỗ trợ độ dài tối đa khác nhau, nên hãy đặt `maxLength` dựa trên đích đến của URL thay vì một con số tùy tiện, và nêu giới hạn khi nó quan trọng.
- **Giải thích URL dùng để làm gì.** Dùng `label` và `details` để làm rõ mục đích, vì URL hình ảnh sản phẩm, liên kết hồ sơ mạng xã hội và một tham chiếu bên ngoài mỗi loại cần một thứ khác nhau.

```vue
<SUrlField label="Product image URL" placeholder="https://example.com/images/product.jpg" details="Link directly to a JPG or PNG file." />
```

Xem [best practices của Shopify cho `<s-url-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/url-field#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
