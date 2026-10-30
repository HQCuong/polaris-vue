- **Dùng tooltip cho chi tiết bổ sung, không thiết yếu.** Chúng phù hợp với thông tin giúp hiểu rõ hơn nhưng không bắt buộc. Đừng bao giờ giấu lỗi, thông tin thiết yếu hoặc hướng dẫn bắt buộc trong tooltip.
- **Kết hợp với nút chỉ có icon.** Một nút icon cần tooltip để giải thích chức năng; hãy ghi rõ hành động và phím tắt của nó, nếu có.
- **Giữ văn bản ngắn gọn.** Một cụm từ hoặc một câu ngắn là lý tưởng. Nếu nội dung dài, có lẽ nó xứng đáng có một vị trí dễ thấy hơn trong UI.
- **Coi việc có nhiều tooltip là dấu hiệu cảnh báo.** Nếu giao diện cần nhiều tooltip mới dễ hiểu, hãy cải thiện nhãn, bố cục hoặc kiến trúc thông tin.
- **Lưu ý thiết bị cảm ứng.** Tooltip chỉ hoạt động trên desktop và không xuất hiện trên màn hình cảm ứng, nên hãy hiển thị thông tin quan trọng một cách mặc định trên mobile.

```vue
<SButton icon="delete" accessibilityLabel="Delete product" interestFor="delete-tip" />
<STooltip id="delete-tip">Delete product</STooltip>
```

Xem [best practices của Shopify cho `<s-tooltip>`](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/tooltip#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
