- **Định cỡ theo câu trả lời mong đợi.** Số `rows` hiển thị cho biết nên viết bao nhiêu: một vùng nhập thấp gợi ý câu trả lời ngắn, còn vùng cao hơn yêu cầu nhiều chi tiết hơn.
- **Đặt giới hạn độ dài phản ánh nhu cầu thực.** Chọn `minLength` và `maxLength` dựa trên những gì nội dung thực sự cần, và cho người bán biết các giới hạn đó ngay từ đầu.
- **Dùng placeholder làm ví dụ.** Viết `placeholder` thể hiện loại nội dung, định dạng và giọng điệu bạn mong đợi, thay vì lặp lại mục đích của trường.
- **Hiển thị còn bao nhiêu chỗ.** Khi bạn áp đặt độ dài tối đa, hãy cho người bán thấy còn bao nhiêu ký tự để họ viết vừa mà không vượt quá.

```vue
<STextArea label="Product description" :rows="6" :maxLength="500" placeholder="Handwoven from organic cotton, this throw adds warmth to any room." />
```

Xem [best practices của Shopify cho `<s-text-area>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-area#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
