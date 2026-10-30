- **Giữ mỗi checkbox độc lập.** Người bán nên có thể chọn bất kỳ tổ hợp lựa chọn nào mà checkbox này không ảnh hưởng đến checkbox khác.
- **Gán cho mỗi checkbox một `label` mô tả rõ.** Điều này quan trọng nhất khi checkbox bật hoặc tắt một cài đặt, để người bán biết chính xác họ đang bật cái gì.
- **Sắp xếp lựa chọn hợp lý.** Sắp theo bảng chữ cái, theo số hoặc theo thời gian để người bán nhanh chóng tìm được lựa chọn mình muốn.
- **Chỉ dùng `indeterminate` cho "chọn tất cả" một phần.** Dùng nó trên checkbox "chọn tất cả" khi chỉ một số mục trong nhóm được chọn.
- **Thêm `details` khi cần ngữ cảnh.** Dùng nó để giải thích thêm một lựa chọn làm gì, chỉ khi riêng nhãn là chưa đủ.

```vue
<SCheckbox
  label="Send order confirmation emails"
  details="Customers get an email as soon as their order is placed."
/>
```

Xem [best practices của Shopify cho `<s-checkbox>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/checkbox#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
