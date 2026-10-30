- **Hiển thị cho các tác vụ bất đồng bộ chậm.** Dùng spinner khi những việc như lưu form, tải dữ liệu hoặc xử lý một hành động mất hơn khoảng 500ms. Với các hành động hoàn tất tức thì, spinner chỉ nhấp nháy và gây phân tâm.
- **Giữ nó ở đúng chỗ đang tải.** Đặt spinner trong phần của trang đang tải, chẳng hạn một nút đang lưu hoặc một section đang tải dữ liệu, thay vì chặn toàn bộ giao diện.
- **Nói rõ cái gì đang tải.** Luôn đặt `accessibilityLabel`, ví dụ "Loading products" hoặc "Saving changes", để người dùng trình đọc màn hình biết chuyện gì đang diễn ra.
- **Báo kết quả sau đó.** Khi spinner biến mất, hiển thị một thông báo thành công hoặc lỗi rõ ràng để người bán biết thao tác đã hoàn tất và kết quả ra sao.

```vue
<SSpinner accessibilityLabel="Loading products" />
```

Xem [best practices của Shopify cho `<s-spinner>`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/spinner#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
