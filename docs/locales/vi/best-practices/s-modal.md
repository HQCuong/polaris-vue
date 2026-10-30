- **Chỉ dùng modal cho quyết định cần sự tập trung.** Mở modal khi người bán phải đưa ra một lựa chọn cụ thể hoặc xác nhận một điều quan trọng. Nếu tác vụ hoặc công cụ có thể nằm ngay trên trang, hãy giữ nó ở đó.
- **Dùng một cách hạn chế.** Mỗi modal đều làm gián đoạn người bán, vì vậy hãy coi nó là giải pháp cuối cùng cho những thời điểm quan trọng, không phải một pattern mặc định.
- **Làm cho hành động chính nổi bật.** Cho modal một lời kêu gọi hành động rõ ràng, nổi bật trong slot `primary-action`.
- **Gắn nhãn hành động bằng động từ cụ thể.** Các button như "Delete", "Save" hay "Continue" cho người bán biết điều gì sẽ xảy ra; tránh nhãn chung chung như "Yes", "OK" hay "Submit".
- **Nói rõ hậu quả của hành động phá hủy.** Khi hành động xóa hoặc hủy bỏ một thứ gì đó, hãy mô tả trong nội dung modal những gì người bán sẽ mất.
- **Đừng lồng modal.** Tránh mở một modal thứ hai từ bên trong một modal đang mở.

```vue
<SModal id="delete-product" heading="Delete product?">
  <SParagraph>This permanently deletes the product and its variants. You can't undo this.</SParagraph>
  <SButton slot="primary-action" tone="critical">Delete product</SButton>
  <SButton slot="secondary-actions">Cancel</SButton>
</SModal>
```

Xem [best practices của Shopify cho `<s-modal>`](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/modal#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
