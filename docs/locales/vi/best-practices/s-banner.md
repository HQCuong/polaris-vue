- **Mỗi banner chỉ nói một việc.** Mỗi banner nên mang một thông điệp hoặc một hành động bắt buộc duy nhất, để người bán không phải băn khoăn nó nói về điều gì.
- **Viết để đọc lướt nhanh.** Giữ văn bản đủ ngắn để người bán nắm được thông điệp và việc cần làm tiếp theo chỉ trong một cái nhìn.
- **Cho người bán bước tiếp theo.** Banner có `tone="info"`, `tone="warning"` hoặc `tone="critical"` nên kèm một lời kêu gọi hành động nói cụ thể cách tiếp tục.
- **Cho phép người bán đóng banner.** Đặt `dismissible` trừ khi thông điệp cần được xử lý ngay, và tránh những banner nằm mãi trên màn hình mà không có cách đóng.
- **Đặt banner theo phạm vi.** Đặt banner bên ngoài mọi section cho thông điệp về toàn trang, hoặc bên trong một section khi nó liên quan đến nội dung của section đó.

```vue
<SBanner heading="Shipping rates need updating" tone="warning" dismissible>
  Some of your shipping zones have no rates, so customers there can't check out.
  <template #secondary-actions>
    <SButton variant="secondary">Review shipping zones</SButton>
  </template>
</SBanner>
```

Xem [best practices của Shopify cho `<s-banner>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/banner#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
