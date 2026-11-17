---
title: Shopify Polaris trong Vue 3 với AI coding agent — llms.txt và AGENTS.md
description: Cung cấp tài liệu polaris-vue-elements dưới dạng Markdown cho AI coding agent — llms.txt, llms-full.txt, bản .md của mọi trang và hướng dẫn AGENTS.md đi kèm trong package npm.
---

# Dùng polaris-vue-elements với AI agent {#using-polaris-vue-elements-with-ai-agents}

Coding agent viết code Vue tốt hơn với thư viện này khi chúng đọc tài liệu thay vì
đoán từ các ví dụ React hay từ các thẻ `<s-*>` thô. Tài liệu có sẵn ở ba dạng mà
agent đọc được, và package npm đi kèm một hướng dẫn ngắn viết riêng cho chúng.

## llms.txt và llms-full.txt {#llms-txt-and-llms-full-txt}

Theo quy ước [llms.txt](https://llmstxt.org/), site xuất bản:

| URL | Là gì |
| --- | --- |
| [`/llms.txt`](https://polaris-vue-elements.dev/llms.txt) | Mục lục tài liệu tiếng Anh: các guide, mọi component theo danh mục, App Bridge và CSS variables, mỗi mục có mô tả một dòng và liên kết tới bản Markdown của nó. |
| [`/llms-full.txt`](https://polaris-vue-elements.dev/llms-full.txt) | Toàn bộ các trang tiếng Anh trong một file Markdown. |

`llms.txt` đủ nhỏ để đưa cho agent làm điểm xuất phát; agent sẽ theo các liên kết tới
những trang nó cần. `llms-full.txt` rất lớn, nên dùng khi cần đặt toàn bộ tài liệu
tham khảo vào context cùng một lúc.

## Bản Markdown của mọi trang {#a-markdown-copy-of-every-page}

Mọi trang tiếng Anh cũng tồn tại dưới dạng Markdown ở cùng đường dẫn, thêm `.md`:

```txt
https://polaris-vue-elements.dev/components/s-button.md
https://polaris-vue-elements.dev/components/s-text-field.md
https://polaris-vue-elements.dev/app-bridge/modal.md
https://polaris-vue-elements.dev/guide/quirks.md
```

Bản sao của một trang component có import, binding `v-model`, props, events, methods và
slots, không có các demo chạy trực tiếp. Mỗi trang HTML liên kết tới bản sao của nó bằng
`<link rel="alternate" type="text/markdown">`.

## AGENTS.md trong package npm {#agents-md-in-the-npm-package}

`polaris-vue-elements` đi kèm `AGENTS.md`, một hướng dẫn gọn cho agent viết app Vue 3
với thư viện: thiết lập, import, `v-model`, App Bridge, các điểm bất thường đã biết và
danh sách tất cả component cùng thẻ của chúng. Vì nằm bên trong package, nó luôn khớp
với phiên bản bạn đã cài:

```txt
node_modules/polaris-vue-elements/AGENTS.md
```

## Chỉ cho agent của bạn {#point-your-agent-at-it}

Hầu hết coding agent đọc một file hướng dẫn của dự án, chẳng hạn `AGENTS.md`, `CLAUDE.md`
hoặc một rule của Cursor. Hãy thêm vài dòng vào file mà agent của bạn dùng, để nó đọc
hướng dẫn của thư viện trước khi viết code UI:

```md
## UI components

This app uses polaris-vue-elements (Vue 3 wrappers for Shopify Polaris web components).
Before writing or changing UI code, read node_modules/polaris-vue-elements/AGENTS.md.
For one component's props, events and slots, read
https://polaris-vue-elements.dev/components/<tag>.md (for example s-button.md).
```

Nếu agent của bạn không đọc được file trong `node_modules`, hãy đưa cho nó URL
[`llms.txt`](https://polaris-vue-elements.dev/llms.txt).

## Bước tiếp theo {#next-steps}

- [Bắt đầu](/vi/guide/getting-started): cài đặt, runtime của Polaris và `v-model`.
- [Các điểm bất thường & lưu ý](/vi/guide/quirks): những hành vi cũng nên đặt trước mắt agent.
- [Tất cả component](/vi/components/): tài liệu tham khảo mà các bản Markdown được tạo từ đó.
