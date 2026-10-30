- **Nhóm các nội dung thuộc về nhau.** Cho mỗi section một nhiệm vụ duy nhất và nhất quán, dù là thông tin liên quan hay các điều khiển liên quan; khi đó nó vừa là một container trực quan vừa bổ sung ý nghĩa cho cấu trúc trang.
- **Viết tiêu đề mang tính mô tả.** Người bán lướt qua `heading` để định hướng, nên hãy nêu rõ bên trong có gì thay vì dùng một tiêu đề chung chung.
- **Chỉ lồng sâu đến mức nội dung cần.** Một section lồng nhau ảnh hưởng đến thứ bậc tiêu đề và dàn ý của trang chứ không phải cách nó hiển thị. Giữ tối đa hai hoặc ba cấp, và chỉ lồng khi cấu trúc bổ sung giúp nội dung rõ ràng hơn.
- **Bỏ padding khi nội dung cần trải từ mép này sang mép kia.** Dùng `padding="none"` cho những thứ như bảng hoặc hình ảnh cần lấp đầy section, sau đó kiểm tra rằng nội dung bên trong vẫn giữ đủ khoảng cách riêng.
- **Thêm `accessibilityLabel` khi tiêu đề chưa đủ.** Khi tiêu đề hiển thị trên màn hình chưa làm rõ mục đích của section với người dùng trình đọc màn hình, hãy cung cấp một nhãn bổ sung phần ngữ cảnh còn thiếu.
- **Chọn đúng slot header.** Đặt các chi tiết bổ nghĩa cho chính tiêu đề, như tooltip hoặc một con số đếm, vào `accessory`. Đặt thông tin về toàn bộ section, như một badge trạng thái, vào `supplemental`. Các hành động như nút hoặc menu thuộc về `accessory`, vì `supplemental` không nhận chúng.

```vue
<SSection heading="Products" padding="none">
  <STable>
    <!-- … -->
  </STable>
</SSection>
```

Xem [best practices của Shopify cho `<s-section>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/section#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
