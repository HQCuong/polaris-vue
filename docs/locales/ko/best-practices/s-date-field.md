- **적절한 날짜로 시작하세요.** 편집할 때는 기존 날짜로, 제안할 때는 가능성이 높은 날짜로 `value`를 미리 채웁니다.
- **의미 있는 날짜로 제한하세요.** `allow`와 `disallow`로 판매자가 고를 수 있는 날짜를 좁힙니다. 예를 들어 일정 필드는 앞으로의 날짜로, 영업일 필드는 월요일부터 금요일까지로 제한할 수 있습니다.
- **제한 사항은 `details`에서 설명하세요.** "Must be a future date"처럼 요구 사항을 명시해 판매자가 고르기 전에 규칙을 알 수 있게 합니다.
- **`error` 메시지는 해결 방법을 담아 작성하세요.** 날짜가 유효하지 않을 때 판매자에게 어떻게 고칠 수 있는지 알려 줍니다.

전체 가이드는 [`<s-date-field>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-field#best-practices)(영어)를 참고하세요.
