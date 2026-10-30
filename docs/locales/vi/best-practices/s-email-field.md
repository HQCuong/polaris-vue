- **Dùng `label` cụ thể.** Những tên như "Customer email" hay "Order notification email" rõ ràng hơn một "Email" hay "Email address" đơn thuần.
- **Thêm ngữ cảnh trong `details`.** Giải thích vì sao cần địa chỉ email hoặc nó được dùng như thế nào, ví dụ "Required for digital receipts".
- **Thể hiện định dạng trong `placeholder`.** Một địa chỉ mẫu như "you@example.com" cho thấy cần nhập gì; đừng chỉ lặp lại nhãn.
- **Viết thông báo `error` giúp khắc phục được.** Cho người bán biết cách sửa địa chỉ, ví dụ "Enter a valid email address".

```vue
<SEmailField
  label="Order notification email"
  details="We'll send order updates to this address."
  placeholder="you@example.com"
/>
```

Xem [best practices của Shopify cho `<s-email-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/email-field#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
