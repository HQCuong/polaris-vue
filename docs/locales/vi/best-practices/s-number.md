- **Chỉ bọc con số.** Đặt riêng giá trị số trong `SNumber` và để phần chữ xung quanh trong `SText` hoặc `SParagraph`. Chữ số dạng bảng (tabular) giúp các con số thẳng hàng gọn gàng nhưng khiến chữ thường trông không đều.
- **Định dạng giá trị trong app trước.** `SNumber` điều khiển cách chữ số hiển thị chứ không định dạng giá trị, nên bạn tự thêm ký hiệu tiền tệ, phần thập phân và dấu phân cách hàng nghìn sao cho khớp với locale của người bán.
- **Chỉ dùng tone khi con số mang trạng thái.** Đặt `tone` khi bản thân con số báo hiệu điều gì đó, chẳng hạn hàng tồn kho đã hết. Đặt tone cho mọi con số thì sẽ chẳng con số nào nổi bật.
- **Định cỡ con số theo mức độ quan trọng.** Cho con số mà người bán nên đọc trước, như tổng tiền, một `fontSize` lớn hơn, và để các con số phụ ở cỡ mặc định.

```vue
<SText>Total: </SText><SNumber fontSize="large">$1,240.50</SNumber>
<SText>In stock: </SText><SNumber tone="critical">0</SNumber>
```

Xem [best practices của Shopify cho `<s-number>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/number#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
