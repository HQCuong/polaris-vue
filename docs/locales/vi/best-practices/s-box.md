- **Dùng nó như một container chung.** `SBox` xử lý khoảng cách, viền và nền để nhóm nội dung. Khi bạn cần một cách sắp xếp cụ thể như hàng hoặc cột, hãy dùng `SStack` hoặc `SGrid`.
- **Kiểm tra trước xem có component mang ý nghĩa rõ hơn không.** Nếu đã có component như `SSection` hay `SBanner` mô tả đúng nội dung là gì, hãy ưu tiên nó. Component chuyên dụng thể hiện ý định rõ hơn và có trợ năng tốt hơn.
- **Tính đến màn hình nhỏ hơn.** Bố cục trông ổn trên desktop có thể vỡ trên mobile, vì vậy hãy điều chỉnh khoảng cách và bố cục bằng giá trị responsive thay vì cố định kích thước.
- **Mô tả các vùng và nội dung tương tác.** Khi một box đánh dấu một vùng riêng biệt hoặc chứa nội dung tương tác, hãy đặt `accessibilityRole` và `accessibilityLabel` để người dùng trình đọc màn hình hiểu và di chuyển trong cấu trúc.
- **Giữ lồng nhau ở mức nông.** Xếp box trong box khiến markup phức tạp và styling khó bảo trì. Hãy tìm một cấu trúc đơn giản hơn hoặc một component bố cục phù hợp hơn.

```vue
<SBox accessibilityRole="region" accessibilityLabel="Shipping summary" padding="base" border="base">
  <!-- … -->
</SBox>
```

Xem [best practices của Shopify cho `<s-box>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/box#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
