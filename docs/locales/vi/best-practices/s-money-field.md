- **Đặt `min` và `max` ở giới hạn thực tế.** Ví dụ, giá sản phẩm có thể dùng `min` là 0.01 để không thể bằng 0, giảm giá có thể nằm trong khoảng từ 0 đến tổng đơn hàng, và hoàn tiền có thể bị giới hạn ở số tiền đã thanh toán. Luôn kiểm tra giá trị theo quy tắc nghiệp vụ của bạn nữa.
- **Nêu chính xác giới hạn trong `error`.** Thay vì "Invalid amount", hãy nói kiểu như "Price must be at least $0.01" để người bán biết họ đã vi phạm ràng buộc nào.
- **Không đưa ký hiệu tiền tệ vào `label` và `placeholder`.** Thêm "$" hoặc ký hiệu tương tự có thể xung đột với định dạng tiền tệ mà field đã tự xử lý.
- **Gắn nhãn số tiền theo mục đích của nó.** "Product base price" hay "Discount amount" cho người bán biết nhiều hơn "Amount" hay "Price".
- **Điền sẵn `value` khi chỉnh sửa.** Hiển thị số tiền hiện tại cho các giá trị có sẵn; với mục mới, hãy cân nhắc một giá trị mặc định hợp lý như 0.00 hoặc một mức giá điển hình.

```vue
<SMoneyField label="Product base price" :min="0.01" />
```

Xem [best practices của Shopify cho `<s-money-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/money-field#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
