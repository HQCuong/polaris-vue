- **맥락에 맞게 크기를 정하세요.** 표나 목록처럼 밀도가 높은 레이아웃에서는 더 작은 `size`를, 사람이 중심이 되는 프로필 페이지에서는 더 큰 값을 고릅니다.
- **유용한 대체 텍스트를 작성하세요.** `alt`에는 사람이나 회사 이름처럼 아바타가 나타내는 대상을 지정합니다. 그 이름이 이미 아바타 옆에 텍스트로 표시된다면 빈 `alt`를 사용합니다.
- **나타내는 대상 바로 옆에 두세요.** 아바타를 해당 이름이나 항목 바로 옆에 배치해 목록, 표, 카드에서 둘의 연결이 분명하게 드러나도록 합니다.

```vue
<SAvatar alt="Sarah Chen" initials="SC" size="large" />
```

전체 가이드는 [`<s-avatar>`에 대한 Shopify 모범 사례](https://shopify.dev/docs/api/app-home/latest/web-components/media-and-visuals/avatar#best-practices)(영어)를 참고하세요.
