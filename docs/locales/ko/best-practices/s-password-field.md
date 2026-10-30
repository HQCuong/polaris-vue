- **비밀번호 관리자와 함께 동작하게 하세요.** `new-password`나 `current-password`처럼 적절한 `autocomplete` 값을 설정해, 비밀번호 관리자가 판매자의 강력한 비밀번호 생성과 저장을 도울 수 있게 합니다.
- **규칙을 미리 알려 주세요.** 잘못된 입력 후에야 요구 사항을 드러내지 말고, 판매자가 입력을 시작하기 전에 모든 비밀번호 요구 사항을 나열합니다. 이렇게 하면 불만과 폼 이탈을 막을 수 있습니다.
- **비밀번호를 만드는 판매자를 안내하세요.** 맥락 없이 규칙만 강제하지 말고, 비밀번호 강도에 대한 실시간 피드백을 주고 무엇을 하면 더 강해지는지 설명합니다.
- **붙여넣기를 허용하세요.** 비밀번호 관리자 같은 도구는 붙여넣기에 의존하며, 이를 막으면 판매자가 외워서 입력할 수 있는 더 약한 비밀번호를 쓰게 됩니다.
- **클라이언트 측 검사는 피드백 용도로만 취급하세요.** 브라우저의 제약은 쉽게 우회할 수 있으므로 비밀번호는 항상 서버에서 검증합니다. 클라이언트 측 검증은 빠르게 반응하기 위한 것이지 보안을 제공하기 위한 것이 아닙니다.

```vue
<SPasswordField label="New password" autocomplete="new-password" details="Use at least 12 characters." />
```

전체 가이드는 [`<s-password-field>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/forms/password-field#best-practices)(영어)를 참고하세요.
