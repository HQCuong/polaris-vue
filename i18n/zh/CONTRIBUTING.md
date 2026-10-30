<sub>[English](../../CONTRIBUTING.md) | [Tiếng Việt](../vi/CONTRIBUTING.md) | [한국어](../ko/CONTRIBUTING.md) | **简体中文** | [日本語](../ja/CONTRIBUTING.md) | [Deutsch](../de/CONTRIBUTING.md) | [Français](../fr/CONTRIBUTING.md)</sub>

# 贡献指南

> 本译文可能落后于英文版。如有出入，以[英文版](../../CONTRIBUTING.md)为准。

感谢你愿意出一份力。无论是 bug 报告、文档修正还是 pull request，我们都非常欢迎。

所有参与者都应遵守[行为准则](./CODE_OF_CONDUCT.md)。

## 开始之前

- **Bug 或小修复？** 直接提交 pull request；如果不确定是不是 bug，可以先开一个 issue。
- **新功能或公共 API 的变更？** 请先开 issue，在写代码之前就方案达成一致。

## 环境配置

使用 [`.nvmrc`](../../.nvmrc) 中指定的 Node 版本（`nvm use`），然后运行：

```sh
npm install            # 同时会安装一个运行 `npm run check` 的 pre-push hook
npm run dev            # playground（src/App.vue），运行真实的 Polaris 组件
npm run docs:dev       # 文档站点
```

## 基本规则

1. **切勿手动编辑 `src/lib/generated/` 或 `docs/components/`。** 它们会被生成器覆盖。请改为修改
   `scripts/generate.mjs` / `scripts/generate-docs.mjs`，然后运行
   `npm run generate && npm run docs:generate` 并提交生成结果。
2. **新的表单组件需要 v-model？** 在 `src/lib/overrides.ts` 中加一行即可（`overrides.spec.ts`
   中的 drift guard 会准确指出缺少什么）。
3. **手写的文档示例？** 添加 `docs/examples/<tag>.md`（复杂的在线演示放在
   `docs/examples/demos/*.vue` 中，因为 SFC 不会被 markdown-it 破坏）；文档生成器会自动将其
   内联到页面中。手写的最佳实践放在 `docs/best-practices/<tag>.md`。
4. **在真实浏览器中验证 Polaris 的行为。** 关于 Polaris 组件的任何结论（slot 规则、渲染上的
   怪异行为）都必须用 CDN 上的真实 runtime（`polaris-2.js`）验证，而不能只依赖 jsdom。之前已
   验证过的发现请参阅 [`docs/guide/quirks.md`](../../docs/guide/quirks.md)。
5. 对 `src/lib/runtime/` 或生成器的任何行为变更，都要**添加测试**。

## 提交 pull request 之前

运行与 CI 相同的检查：

```sh
npm run generate && npm run docs:generate   # 生成的代码必须是最新的
npm run check                               # oxlint + eslint + vue-tsc
npx vitest run
npm run build:lib
npm run docs:build                          # 如果改动了文档或文档生成器
```

然后：

- 对于包的使用者能察觉到的任何改动，**在 `CHANGELOG.md` 中添加一行**，放在 `## [Unreleased]`
  下（归入 `Added`、`Changed`、`Fixed` 或 `Removed`）。仅涉及文档或内部实现的改动则不需要。
  CHANGELOG 使用英文撰写。
- **PR 标题遵循 [Conventional Commits](https://www.conventionalcommits.org/) 风格**：
  `fix: ...`、`feat: ...`、`docs: ...`、`chore: ...`、`test: ...`。破坏性变更用 `!` 标注
  （`feat!: ...`）。
- 每个 pull request 只包含一项改动。

## 提交 pull request 之后

- 如果这是你第一次贡献，GitHub Actions 会等待维护者批准后才运行 CI。这是 GitHub 针对来自
  fork 的 pull request 的安全措施，并不是对你的改动的评价。
- 维护者会审查、合并，并在下一个版本中发布你的改动。版本由维护者发布（参见
  [发布](./README.md#发布)）。

## 安全

发现了安全漏洞？请不要开 issue；请参阅[安全策略](./SECURITY.md)。

## 许可证

提交贡献即表示你同意你的贡献以 [MIT 许可证](../../LICENSE)授权。
