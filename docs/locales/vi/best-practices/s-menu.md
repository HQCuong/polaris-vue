- **Dùng menu cho hành động phụ.** Giữ các hành động chính như "Save" hiển thị ngay trên trang. Menu phù hợp với các hành động người bán ít dùng hơn hoặc hành động phá hủy, như "Archive" hay "Export data", vốn không cần chiếm chỗ cố định.
- **Viết nhãn theo dạng động từ cộng danh từ.** Nhãn như "Edit details" hay "Export as CSV" nói chính xác điều gì sẽ xảy ra; tránh nhãn mơ hồ như "Options", "More" hay "Settings".
- **Chia menu dài thành các section.** Khi menu có từ bốn mục trở lên, hãy nhóm các hành động liên quan trong một `SSection` có `heading`, ví dụ "Manage" cho các hành động thường ngày và "Danger zone" cho hành động phá hủy.
- **Thêm icon hỗ trợ cho nhãn.** Icon như `edit` cho chỉnh sửa, `delete` cho xóa hay `download` cho xuất dữ liệu giúp người bán nhận ra hành động, nhưng chúng nên củng cố văn bản, không bao giờ thay thế nó.
- **Chỉ vô hiệu hóa những gì tạm thời không khả dụng.** Đặt `disabled` cho một mục khi hành động không áp dụng trong ngữ cảnh hiện tại, như hoàn tiền cho một đơn hàng đã được hoàn tiền. Nếu một hành động không bao giờ áp dụng, hãy bỏ nó khỏi menu.

```vue
<SButton commandFor="product-actions">Product actions</SButton>
<SMenu id="product-actions" accessibilityLabel="Product actions">
  <SSection heading="Manage">
    <SButton icon="edit">Edit product</SButton>
    <SButton icon="duplicate">Duplicate product</SButton>
  </SSection>
  <SSection heading="Danger zone">
    <SButton icon="archive">Archive product</SButton>
    <SButton icon="delete" tone="critical">Delete product</SButton>
  </SSection>
</SMenu>
```

Xem [best practices của Shopify cho `<s-menu>`](https://shopify.dev/docs/api/app-home/latest/web-components/actions/menu#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
