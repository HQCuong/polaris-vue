- **Giải thích nguyên nhân, rồi đến cách khắc phục.** Một tiêu đề trơn "No products" khiến người bán phải đoán. Dùng `heading` để nói vì sao chưa có gì, và để hành động đảm nhận bước tiếp theo.
- **Dẫn dắt bằng một hành động chính.** Dùng slot `primary-action` cho bước duy nhất đưa người bán ra khỏi trạng thái trống, và đặt các lựa chọn khác trong `secondary-actions`.
- **Diễn đạt khác cho kết quả lọc.** Một tài nguyên chưa có gì và một bộ lọc không khớp gì là hai tình huống khác nhau. Với kết quả lọc, hãy cho người bán biết cách điều chỉnh bộ lọc.
- **Coi hình minh họa là phần thêm.** Tiêu đề và hành động mới là phần chính, vì vậy hãy để trống slot `graphic` trong bố cục dày đặc, và khi có dùng, hãy giới hạn ở một icon hoặc một hình ảnh.

```vue
<SEmptyState heading="You haven't added any products yet">
  <template #primary-action>
    <SButton variant="primary">Add product</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Import products</SButton>
  </template>
</SEmptyState>
```

Xem [best practices của Shopify cho `<s-empty-state>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
