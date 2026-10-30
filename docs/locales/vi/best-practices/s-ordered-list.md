- **Dùng khi thứ tự có ý nghĩa.** Danh sách đánh số thể hiện thứ tự, mức ưu tiên hoặc xếp hạng, nên phù hợp với hướng dẫn từng bước hoặc các đề xuất được xếp hạng. Nếu thứ tự không quan trọng, hãy dùng `SUnorderedList`.
- **Viết các mục theo cùng một cách.** Cho mọi mục cùng ngữ pháp và cấu trúc để danh sách dễ đọc. Đổi cách viết giữa các mục khiến người đọc phải vất vả hơn.
- **Giữ mỗi mục ngắn gọn.** Danh sách hiệu quả vì dễ lướt nhanh. Nếu các mục trở nên dài hoặc phức tạp, hãy cân nhắc tách chúng thành các phần riêng.
- **Đừng lồng quá sâu.** Một cấp lồng có thể giúp sắp xếp các ý liên quan, nhưng vượt quá hai cấp sẽ khó theo dõi và cho thấy nội dung cần một cấu trúc khác.

```vue
<SOrderedList>
  <SListItem>Choose a shipping carrier</SListItem>
  <SListItem>Print the shipping label</SListItem>
  <SListItem>Mark the order as fulfilled</SListItem>
</SOrderedList>
```

Xem [best practices của Shopify cho `<s-ordered-list>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/ordered-list#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
