- **Chọn chế độ chọn phù hợp với các lựa chọn.** Giữ chế độ chọn một cho các lựa chọn loại trừ lẫn nhau, như phương thức thanh toán hoặc tốc độ giao hàng, và đặt `multiple` khi người bán có thể chọn nhiều hơn một.
- **Viết nhãn lựa chọn mô tả kết quả.** "Email notifications for new orders" nói được nhiều hơn "Email". Giữ nhãn ngắn, nhưng đủ rõ để tự đứng độc lập.
- **Viết `label` dưới dạng câu hỏi hoặc câu khẳng định.** Một tiêu đề như "Which shipping method?" hay "Select notification preferences" cho người bán biết nhiều hơn một từ mơ hồ như "Options" hay "Settings".
- **Giải thích lựa chọn phức tạp trong slot `details`.** Thêm details cho từng `SChoice` khi người bán cần hiểu việc chọn nó có ý nghĩa gì.
- **Viết thông báo `error` cụ thể.** Nói chính xác cho người bán điều gì còn thiếu, ví dụ "Select at least one notification preference", thay vì một câu chung chung như "Required field".

```vue
<SChoiceList label="Which shipping method?">
  <SChoice value="standard">Standard shipping</SChoice>
  <SChoice value="express">
    Express shipping
    <template #details>
      <SText>Costs more, but orders arrive in 1–2 business days.</SText>
    </template>
  </SChoice>
</SChoiceList>
```

Xem [best practices của Shopify cho `<s-choice-list>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
