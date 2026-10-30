- **Làm rõ dữ liệu cần nhập.** Viết `label` và `placeholder` cho người bán biết cần nhập gì và theo định dạng nào. Câu chữ mơ hồ dẫn đến phải đoán, lỗi xác thực và sự khó chịu.
- **Thêm ngữ cảnh bằng prefix hoặc suffix.** Dùng `prefix` và `suffix` để thể hiện loại giá trị và định dạng của nó, ví dụ người bán nên gõ cả URL hay chỉ subdomain, hoặc giá đầy đủ hay chỉ số tiền.
- **Dựa ràng buộc trên yêu cầu thực.** Đặt `minLength`, `maxLength` và các quy tắc xác thực theo nhu cầu nghiệp vụ thực tế thay vì những con số tùy tiện, và cho người bán biết chúng là gì.
- **Phản hồi sớm và cụ thể.** Cho người bán biết dữ liệu nhập có hợp lệ hay không ngay khi họ gõ, không chỉ khi gửi. Khi không hợp lệ, dùng `error` để giải thích sai ở đâu và cách sửa.

```vue
<STextField label="Store address" prefix="https://" suffix=".myshopify.com" />
```

Xem [best practices của Shopify cho `<s-text-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
