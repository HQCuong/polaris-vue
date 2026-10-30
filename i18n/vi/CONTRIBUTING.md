<sub>[English](../../CONTRIBUTING.md) | **Tiếng Việt**</sub>

# Hướng dẫn đóng góp

> Bản dịch này có thể chậm hơn bản tiếng Anh. Nếu có chỗ không khớp, [bản tiếng Anh](../../CONTRIBUTING.md) là bản chính thức.

Cảm ơn bạn đã muốn giúp một tay. Báo lỗi, sửa tài liệu hay pull request đều được hoan nghênh.

Mọi người tham gia đều cần tuân theo [Quy tắc ứng xử](./CODE_OF_CONDUCT.md).

## Trước khi bắt đầu

- **Lỗi hoặc sửa nhỏ?** Mở pull request luôn, hoặc mở issue nếu bạn chưa chắc đó có phải lỗi không.
- **Tính năng mới hoặc thay đổi public API?** Mở issue trước để thống nhất hướng làm rồi
  hãy viết code.

## Thiết lập

Dùng phiên bản Node trong [`.nvmrc`](../../.nvmrc) (`nvm use`), rồi chạy:

```sh
npm install            # cài luôn pre-push hook chạy `npm run check`
npm run dev            # playground (src/App.vue) với component Polaris chạy thật
npm run docs:dev       # site tài liệu
```

## Quy tắc chung

1. **Không bao giờ sửa tay `src/lib/generated/` hoặc `docs/components/`.** Các thư mục này bị
   generator ghi đè. Hãy sửa `scripts/generate.mjs` / `scripts/generate-docs.mjs`, rồi chạy
   `npm run generate && npm run docs:generate` và commit kết quả.
2. **Form component mới cần v-model?** Thêm một dòng vào `src/lib/overrides.ts` (drift guard
   trong `overrides.spec.ts` sẽ chỉ đúng chỗ còn thiếu).
3. **Ví dụ tài liệu viết tay?** Thêm `docs/examples/<tag>.md` (demo phức tạp đặt trong
   `docs/examples/demos/*.vue`, vì SFC không bị markdown-it làm hỏng); generator tài liệu
   sẽ tự chèn vào trang. Mục best practices viết tay nằm trong `docs/best-practices/<tag>.md`.
4. **Kiểm chứng hành vi của Polaris trên trình duyệt thật.** Mọi khẳng định về component Polaris
   (quy tắc slot, lỗi hiển thị) phải được kiểm tra với runtime thật trên CDN (`polaris-2.js`), không
   chỉ với jsdom. Xem [`docs/guide/quirks.md`](../../docs/guide/quirks.md) để biết các phát hiện đã
   được kiểm chứng trước đó.
5. **Thêm test** cho mọi thay đổi hành vi trong `src/lib/runtime/` hoặc các generator.

## Trước khi mở pull request

Chạy đúng các bước kiểm tra mà CI chạy:

```sh
npm run generate && npm run docs:generate   # code generated phải mới nhất
npm run check                               # oxlint + eslint + vue-tsc
npx vitest run
npm run build:lib
npm run docs:build                          # nếu bạn sửa tài liệu hoặc generator tài liệu
```

Sau đó:

- **Thêm một dòng vào `CHANGELOG.md`** dưới `## [Unreleased]` (trong `Added`, `Changed`, `Fixed`
  hoặc `Removed`) cho mọi thay đổi mà người dùng package sẽ nhận ra. Thay đổi chỉ về tài liệu hoặc
  nội bộ thì không cần. CHANGELOG viết bằng tiếng Anh.
- **Đặt tiêu đề PR theo [Conventional Commits](https://www.conventionalcommits.org/)**:
  `fix: ...`, `feat: ...`, `docs: ...`, `chore: ...`, `test: ...`. Đánh dấu breaking change bằng `!`
  (`feat!: ...`).
- Mỗi pull request chỉ một thay đổi.

## Sau khi mở pull request

- Nếu đây là lần đóng góp đầu tiên, GitHub Actions sẽ chờ maintainer duyệt cho chạy CI. Đó là
  cơ chế an toàn của GitHub với pull request từ fork, không phải đánh giá về thay đổi của bạn.
- Maintainer review, merge, và đưa thay đổi vào bản phát hành kế tiếp. Bản phát hành do
  maintainer tạo (xem [Phát hành](./README.md#phát-hành)).

## Bảo mật

Phát hiện lỗ hổng? Đừng mở issue; xem [Chính sách bảo mật](./SECURITY.md).

## Giấy phép

Khi đóng góp, bạn đồng ý rằng đóng góp của mình được cấp phép theo [Giấy phép MIT](../../LICENSE).
