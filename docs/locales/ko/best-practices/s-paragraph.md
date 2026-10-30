- **문단을 짧게 유지하세요.** 전문 용어 없이 쉬운 말로 두세 문장에서 네 문장 정도를 목표로 합니다. 판매자는 훑어보는 경향이 있으므로 긴 내용은 작은 단위로 나눕니다.
- **tone으로 의도를 나타내세요.** `tone="critical"`은 오류에, `"caution"`은 경고에, `"success"`는 확인에 적합합니다. 색상에만 의존하지 말고 항상 명확한 문구로 뒷받침합니다.
- **접근성을 고려해 설계하세요.** 시각적으로 보는 판매자가 레이아웃이나 아이콘으로 파악하는 맥락은 스크린 리더 전용 텍스트(`accessibilityVisibility="exclusive"`)로 추가하고, tone이 적용된 텍스트도 읽을 수 있을 만큼 대비가 충분한지 확인합니다.
- **줄 수 제한은 신중하게 사용하세요.** `lineClamp`는 카드나 미리보기처럼 좁은 곳에서 유용하지만, 잘라내기로 중요한 정보가 가려지게 해서는 안 됩니다.

전체 가이드는 [`<s-paragraph>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/paragraph#best-practices)(영어)를 참고하세요.
