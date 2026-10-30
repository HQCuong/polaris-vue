- **Giữ đoạn văn ngắn.** Hướng tới hai đến bốn câu bằng ngôn ngữ đơn giản, không dùng thuật ngữ chuyên môn. Người bán thường đọc lướt, nên hãy chia nội dung dài thành các phần nhỏ hơn.
- **Dùng tone để thể hiện ý định.** `tone="critical"` phù hợp với lỗi, `"caution"` với cảnh báo và `"success"` với xác nhận. Luôn kèm theo câu chữ rõ ràng thay vì chỉ dựa vào màu sắc.
- **Thiết kế cho trợ năng.** Thêm văn bản chỉ dành cho trình đọc màn hình (`accessibilityVisibility="exclusive"`) cho phần ngữ cảnh mà người bán nhìn thấy được nhận biết qua bố cục hoặc icon, và đảm bảo văn bản có tone vẫn đủ độ tương phản để đọc.
- **Cắt dòng một cách cẩn thận.** `lineClamp` hữu ích ở những chỗ chật như card hoặc bản xem trước, nhưng đừng bao giờ để việc cắt bớt che mất thông tin quan trọng.

Xem [best practices của Shopify cho `<s-paragraph>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/paragraph#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
