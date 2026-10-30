- **Dùng để lọc tại chỗ.** Nó phù hợp để thu hẹp nội dung của một phần hoặc một danh sách cụ thể. Điều hướng toàn cục hoặc các tìm kiếm phức tạp, nhiều bước cần một mẫu tìm kiếm mạnh mẽ hơn.
- **Nói rõ đang tìm kiếm gì.** Viết `label` và `placeholder` cụ thể, cho người bán biết tìm kiếm bao gồm nội dung nào và họ có thể tìm theo những thuộc tính nào.
- **Phản hồi khi người bán gõ.** Khi có thể, hãy cập nhật kết quả hoặc nội dung được lọc ngay khi người bán gõ, để họ có thể tinh chỉnh truy vấn và tin rằng tìm kiếm đang hoạt động.
- **Tính đến trường hợp xóa tìm kiếm và không có kết quả.** Khi trường bị xóa trống, hãy hiển thị lại toàn bộ danh sách. Khi không có gì khớp, hiển thị một thông báo gợi ý hành động khác hoặc một tìm kiếm rộng hơn.
- **Chờ đủ dữ liệu nhập.** Tránh chạy những tìm kiếm trả về quá nhiều kết quả hoặc kết quả vô nghĩa; bắt đầu sau hai hoặc ba ký tự là đủ để trả về các kết quả hữu ích.

```vue
<SSearchField label="Search products" placeholder="Search by title, SKU or vendor" />
```

Xem [best practices của Shopify cho `<s-search-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/search-field#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
