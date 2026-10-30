- **Đặt nhãn bằng một động từ rõ ràng.** Nói chính xác button làm gì, như "Save", "Edit" hay "Add tags". Dùng kiểu viết hoa chữ đầu câu (sentence case), bỏ các từ thừa như "a" hay "the", và không dùng dấu câu.
- **Chỉ dùng `tone="critical"` cho hành động phá hủy.** Chỉ dùng nó khi một hành động khó hoặc không thể hoàn tác, và nhìn chung hãy chọn tone tương xứng với mức độ quan trọng của hành động.
- **Làm cho thứ bậc thật rõ ràng.** Gán `variant="primary"` cho hành động chính, `variant="secondary"` cho hành động hỗ trợ, và `variant="tertiary"` cho hành động bổ sung, để người bán biết hành động nào quan trọng nhất.
- **Đặt button nhất quán.** Đặt button ở cùng vị trí trong toàn bộ app để người bán quen biết chỗ tìm chúng.
- **Gắn nhãn cho button chỉ có icon.** Nếu button có icon mà không có văn bản, hãy gán `accessibilityLabel` cho biết nó làm gì với người dùng trình đọc màn hình.

```vue
<SButton icon="edit" accessibilityLabel="Edit product" />
```

Xem [best practices của Shopify cho `<s-button>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
