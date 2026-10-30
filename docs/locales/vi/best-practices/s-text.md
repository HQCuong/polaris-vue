- **Chọn `type` có ngữ nghĩa.** Chọn `"strong"` để đánh dấu từ hoặc cụm từ quan trọng, `"address"` cho địa chỉ bưu chính hoặc email, và `"redundant"` cho văn bản cung cấp ngữ cảnh cho người dùng trình đọc màn hình khi cùng nội dung đó đã xuất hiện trên màn hình. Chọn đúng type giúp công nghệ hỗ trợ thể hiện được ý nghĩa của văn bản.
- **Nhấn mạnh có chừng mực.** Áp dụng `type="strong"` cho từ hoặc con số quan trọng trong câu, không phải cho cả câu; nhấn mạnh quá nhiều sẽ mất tác dụng và khiến văn bản khó đọc lướt hơn.
- **Dùng tone cho trạng thái nội dòng.** Các tone như `"critical"`, `"success"` hoặc `"caution"` thu hút sự chú ý vào một trạng thái, nhưng hãy kèm theo câu chữ rõ ràng thay vì để màu sắc tự truyền tải thông điệp.
- **Đừng làm mờ điều quan trọng.** `color="subdued"` phù hợp với dấu thời gian và metadata, nhưng tránh dùng cho thông tin quan trọng mà người bán phải đọc.

```vue
<SParagraph>
  Order shipped to <SText type="address">150 Elgin St, Ottawa</SText>.
  <SText type="strong">Payment pending.</SText>
</SParagraph>
```

Xem [best practices của Shopify cho `<s-text>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/text#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
