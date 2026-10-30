<sub>[English](../../CONTRIBUTING.md) | [Tiếng Việt](../vi/CONTRIBUTING.md) | **한국어** | [简体中文](../zh/CONTRIBUTING.md) | [日本語](../ja/CONTRIBUTING.md) | [Deutsch](../de/CONTRIBUTING.md) | [Français](../fr/CONTRIBUTING.md)</sub>

# 기여 가이드

> 이 번역은 영어 원문보다 늦게 갱신될 수 있습니다. 내용이 다를 경우 [영어 원문](../../CONTRIBUTING.md)이 기준입니다.

도움을 주셔서 감사합니다. 버그 리포트, 문서 수정, pull request 모두 환영합니다.

참여하는 모든 분은 [행동 강령](./CODE_OF_CONDUCT.md)을 따라야 합니다.

## 시작하기 전에

- **버그 또는 작은 수정인가요?** 바로 pull request를 열어 주세요. 버그인지 확실하지 않다면 issue를 열어 주세요.
- **새 기능이나 공개 API 변경인가요?** 코드를 작성하기 전에 먼저 issue를 열어 방향을
  합의해 주세요.

## 설정

[`.nvmrc`](../../.nvmrc)에 지정된 Node 버전을 사용한 뒤(`nvm use`), 다음을 실행합니다.

```sh
npm install            # also installs a pre-push hook that runs `npm run check`
npm run dev            # playground (src/App.vue) with live Polaris components
npm run docs:dev       # documentation site
```

## 기본 규칙

1. **`src/lib/generated/`나 `docs/components/`를 직접 수정하지 마세요.** 이 디렉터리들은
   generator가 덮어씁니다. 대신 `scripts/generate.mjs` / `scripts/generate-docs.mjs`를 수정한 뒤
   `npm run generate && npm run docs:generate`를 실행하고 결과물을 커밋하세요.
2. **새 폼 컴포넌트에 v-model이 필요한가요?** `src/lib/overrides.ts`에 한 줄을 추가하세요
   (`overrides.spec.ts` drift guard가 무엇이 빠졌는지 정확히 알려 줍니다).
3. **직접 작성한 문서 예제인가요?** `docs/examples/<tag>.md`를 추가하세요(복잡한 라이브 데모는
   `docs/examples/demos/*.vue`에 둡니다. SFC는 markdown-it에 의해 깨지지 않기 때문입니다). 문서 generator가
   자동으로 페이지에 삽입합니다. 직접 작성한 모범 사례는 `docs/best-practices/<tag>.md`에 둡니다.
4. **Polaris의 동작은 실제 브라우저에서 검증하세요.** Polaris 컴포넌트에 대한 주장(slot 규칙,
   렌더링 특이 사항)은 jsdom만이 아니라 실제 CDN runtime(`polaris-2.js`)으로 확인해야 합니다.
   이전에 검증된 내용은 [`docs/guide/quirks.md`](../../docs/guide/quirks.md)를 참고하세요.
5. `src/lib/runtime/`이나 generator의 동작을 바꾸는 경우 **테스트를 추가하세요**.

## Pull request를 열기 전에

CI와 같은 검사를 실행하세요.

```sh
npm run generate && npm run docs:generate   # generated code must be up to date
npm run check                               # oxlint + eslint + vue-tsc
npx vitest run
npm run build:lib
npm run docs:build                          # if you touched docs or the docs generator
```

그런 다음:

- 패키지 사용자가 알아챌 만한 변경이라면 **`CHANGELOG.md`에 한 줄을 추가하세요.** `## [Unreleased]` 아래의
  `Added`, `Changed`, `Fixed`, `Removed` 중 하나에 적습니다. 문서만 바뀌었거나 내부적인 변경이라면
  필요 없습니다. CHANGELOG는 영어로 작성합니다.
- **PR 제목은 [Conventional Commits](https://www.conventionalcommits.org/) 형식으로 작성하세요.**
  `fix: ...`, `feat: ...`, `docs: ...`, `chore: ...`, `test: ...`. breaking change는 `!`로 표시합니다
  (`feat!: ...`).
- pull request 하나에는 변경 하나만 담아 주세요.

## Pull request를 연 후에

- 첫 기여라면 GitHub Actions는 메인테이너가 CI 실행을 승인할 때까지 기다립니다.
  이는 fork에서 온 pull request에 대한 GitHub의 보호 장치일 뿐, 변경 내용에 대한 평가가 아닙니다.
- 메인테이너가 리뷰하고 merge한 뒤 다음 릴리스에 포함합니다. 릴리스는 메인테이너가
  만듭니다([릴리스](./README.md#릴리스) 참고).

## 보안

취약점을 발견하셨나요? issue를 열지 말고 [보안 정책](./SECURITY.md)을 참고하세요.

## 라이선스

기여하는 것으로, 기여한 내용이 [MIT 라이선스](../../LICENSE)에 따라 라이선스가 부여되는 데 동의하게 됩니다.
