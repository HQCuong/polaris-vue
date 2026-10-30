- **Nêu giới hạn file bằng `accept`.** Đặt giới hạn rõ ràng về loại file mà drop zone chấp nhận.
- **Xử lý `droprejected` bằng một thông báo hữu ích.** Khi file không vượt qua kiểm tra, hãy lắng nghe event này và cho người bán biết điều gì đã sai.
- **Cân nhắc `disabled` trong lúc xử lý.** Tắt drop zone trong lúc upload giúp người bán không thêm file khác trong thời gian đó.

```vue
<SDropZone label="Product images" accept="image/*" />
```

Xem [best practices của Shopify cho `<s-drop-zone>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/drop-zone#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
