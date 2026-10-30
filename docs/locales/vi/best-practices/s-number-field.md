- **Chỉ dùng cho giá trị thuần số.** Dùng nó cho những thứ như số lượng, số đo hoặc phần trăm. Nếu giá trị có thể chứa chữ cái hoặc ký hiệu, chẳng hạn mã sản phẩm hay số điện thoại, hãy dùng `STextField`.
- **Hiển thị đơn vị.** Dùng `prefix` hoặc `suffix` để cho biết con số đo cái gì, để người bán không phải đoán mình đang nhập đô la, kilôgam hay phần trăm.
- **Đặt giới hạn khớp với quy tắc nghiệp vụ.** Đặt giá trị `min` và `max` phản ánh đúng những gì được phép, giúp người bán nhập giá trị hợp lệ ngay trước khi gửi form.
- **Kiểm tra và giải thích lỗi.** Kiểm tra mọi giá trị số được nhập, và khi có giá trị không hợp lệ, dùng `error` để nói chính xác sai ở đâu và cách sửa, thay vì hiển thị một thông báo chung chung.

```vue
<SNumberField label="Discount" suffix="%" :min="0" :max="100" />
```

Xem [best practices của Shopify cho `<s-number-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/number-field#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
