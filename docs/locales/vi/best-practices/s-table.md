- **Dùng bảng cho dữ liệu người bán cần so sánh.** Bảng phù hợp với nhiều bản ghi có cùng thuộc tính và cần được đọc lướt cạnh nhau. Với một danh sách đơn giản không có gì để so sánh, hãy chọn một component đơn giản hơn.
- **Tính đến bố cục danh sách trên mobile.** Trên mobile, bảng chuyển thành danh sách, nên hãy kiểm tra rằng header và giá trị vẫn dễ đọc khi xếp chồng thành các cặp nhãn–giá trị thay vì dạng lưới.
- **Giữ số cột ít.** Nhiều cột khiến bảng khó đọc lướt và buộc phải cuộn ngang. Chỉ hiển thị những cột người bán cần cho công việc của họ, và cân nhắc hiển thị phần còn lại khi được yêu cầu.
- **Viết header cột rõ ràng.** Giữ mỗi `STableHeader` ngắn gọn và mang tính mô tả để người bán biết chính xác cột chứa dữ liệu gì.
- **Tính đến tập dữ liệu lớn.** Bảng lớn ảnh hưởng đến hiệu năng và khả năng sử dụng. Bật `paginate` khi bạn có hơn khoảng 50 đến 100 hàng, hoặc cân nhắc thêm bộ lọc hay tìm kiếm để người bán đến được đúng bản ghi nhanh hơn.

```vue
<STable paginate hasNextPage>
  <STableHeaderRow>
    <STableHeader>Product</STableHeader>
    <STableHeader format="numeric">Inventory</STableHeader>
  </STableHeaderRow>
  <STableBody>
    <STableRow>
      <STableCell>Snowboard</STableCell>
      <STableCell>24</STableCell>
    </STableRow>
  </STableBody>
</STable>
```

Xem [best practices của Shopify cho `<s-table>`](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/table#best-practices) (tiếng Anh) để có hướng dẫn đầy đủ.
