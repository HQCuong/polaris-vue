- **Tương thích với trình quản lý mật khẩu.** Đặt giá trị `autocomplete` phù hợp, chẳng hạn `new-password` hoặc `current-password`, để trình quản lý mật khẩu có thể giúp người bán tạo và lưu mật khẩu mạnh.
- **Nêu rõ quy tắc ngay từ đầu.** Liệt kê mọi yêu cầu về mật khẩu trước khi người bán bắt đầu nhập, thay vì chỉ cho biết sau khi họ nhập sai. Điều này tránh gây khó chịu và khiến người dùng bỏ dở form.
- **Hướng dẫn người bán khi tạo mật khẩu.** Đưa ra phản hồi trực tiếp về độ mạnh của mật khẩu và giải thích cách làm nó mạnh hơn, thay vì chỉ áp đặt quy tắc mà không có ngữ cảnh.
- **Cho phép người bán dán.** Trình quản lý mật khẩu và các công cụ tương tự phụ thuộc vào việc dán, và chặn dán sẽ đẩy người bán sang dùng mật khẩu yếu hơn mà họ có thể gõ theo trí nhớ.
- **Coi kiểm tra phía client chỉ là phản hồi.** Luôn xác thực mật khẩu trên server của bạn, vì các ràng buộc của trình duyệt rất dễ bị vượt qua. Xác thực phía client là để phản hồi nhanh, không phải để đảm bảo bảo mật.

```vue
<SPasswordField label="New password" autocomplete="new-password" details="Use at least 12 characters." />
```

Xem [best practices của Shopify cho `<s-password-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/password-field#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
