- **Bắt đầu với một ngày hợp lý.** Điền sẵn `value` để người bán chọn nhanh hơn.
- **Cung cấp lối tắt cho các lựa chọn phổ biến.** Các preset như "Today", "Last 7 days" hay "This month" giúp người bán khỏi phải nhấp qua từng trang lịch.
- **Dùng `type="range"` cho ngày bắt đầu và ngày kết thúc.** Chọn theo khoảng phù hợp với báo cáo, phân tích và các bộ lọc khác dựa trên một khoảng thời gian.
- **Chặn những ngày không áp dụng.** Dùng `allow` và `disallow` để người bán không thể chọn những ngày không hợp lệ với trường hợp sử dụng của bạn.
- **Chừa khoảng trống quanh picker.** Cho nó đủ không gian để không cản trở bàn phím ảo hoặc các phần tử tương tác khác.
- **Tính đến những ngày ở xa.** Lật từng tháng một trở nên tẻ nhạt khi vượt quá vài năm, vì vậy với những ngày nằm ngoài khoảng 5–10 năm, hãy cung cấp preset hoặc cho phép người bán nhập năm trực tiếp.

```vue
<SDatePicker type="range" />
```

Xem [best practices của Shopify cho `<s-date-picker>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-picker#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
