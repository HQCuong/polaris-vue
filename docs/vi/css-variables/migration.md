---
title: "Chuyển đổi từ @shopify/polaris-tokens"
description: "@shopify/polaris-tokens là gói token của Polaris React. Polaris web components không dùng gói này: runtime định nghĩa các biến riêng của nó, và phần lớn tên được giữ nguyên."
---

# Chuyển đổi từ `@shopify/polaris-tokens` {#migrating-from-polaris-tokens}

`@shopify/polaris-tokens` là gói token của Polaris React. Polaris web components không dùng
gói này: runtime định nghĩa các biến riêng của nó, và phần lớn tên được giữ nguyên. Nếu CSS
của ứng dụng bạn được lấy từ một ứng dụng Polaris React, hãy đối chiếu nó với các danh sách
dưới đây. Một tên chỉ có trong gói cũ sẽ không có giá trị trong ứng dụng dùng web components,
nên CSS dùng tên đó sẽ nhận giá trị dự phòng `var()` mà bạn đã viết, hoặc không nhận gì cả.

<CssVariablesMigration />
