<sub>**English** | [Tiếng Việt](./i18n/vi/CONTRIBUTING.md)</sub>

# Contributing

Thanks for helping out. Bug reports, docs fixes and pull requests are all welcome.

Everyone taking part is expected to follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Before you start

- **Bug or small fix?** Open a pull request directly, or an issue if you're not sure it's a bug.
- **New feature or a change to the public API?** Open an issue first so we can agree on the shape
  before you write the code.

## Setup

Use the Node version in [`.nvmrc`](./.nvmrc) (`nvm use`), then:

```sh
npm install            # also installs a pre-push hook that runs `npm run check`
npm run dev            # playground (src/App.vue) with live Polaris components
npm run docs:dev       # documentation site
```

## Ground rules

1. **Never edit `src/lib/generated/` or `docs/components/` by hand.** They are overwritten by the
   generators. Change `scripts/generate.mjs` / `scripts/generate-docs.mjs` instead, then run
   `npm run generate && npm run docs:generate` and commit the output.
2. **New form component needs v-model?** Add one line to `src/lib/overrides.ts` (the
   `overrides.spec.ts` drift guard points at exactly what's missing).
3. **Curated docs example?** Add `docs/examples/<tag>.md` (complex live demos go in
   `docs/examples/demos/*.vue`, since SFCs are immune to markdown-it mangling); the docs generator
   inlines it automatically. Hand-written best practices go in `docs/best-practices/<tag>.md`.
4. **Verify Polaris behavior in a real browser.** Claims about Polaris components (slot rules,
   rendering quirks) must be checked against the real CDN runtime (`polaris-2.js`), not just
   jsdom. See [`docs/guide/quirks.md`](./docs/guide/quirks.md) for previously verified findings.
5. **Add a test** for any behavior change in `src/lib/runtime/` or the generators.

## Before opening a pull request

Run the same checks CI runs:

```sh
npm run generate && npm run docs:generate   # generated code must be up to date
npm run check                               # oxlint + eslint + vue-tsc
npx vitest run
npm run build:lib
npm run docs:build                          # if you touched docs or the docs generator
```

Then:

- **Add a line to `CHANGELOG.md`** under `## [Unreleased]` (in `Added`, `Changed`, `Fixed` or
  `Removed`) for anything a user of the package would notice. Docs-only and internal changes
  don't need one.
- **Title the PR in [Conventional Commits](https://www.conventionalcommits.org/) style**:
  `fix: ...`, `feat: ...`, `docs: ...`, `chore: ...`, `test: ...`. Mark breaking changes with `!`
  (`feat!: ...`).
- Keep one change per pull request.

## What happens after you open a pull request

- If this is your first contribution, GitHub Actions waits for a maintainer to approve the CI run.
  That's a GitHub safeguard for pull requests from forks, not a judgment on your change.
- The maintainer reviews, merges, and ships the change in the next release. Releases are cut by
  the maintainer (see [Releasing](./README.md#releasing)).

## Security

Found a vulnerability? Don't open an issue; see [SECURITY.md](./SECURITY.md).

## License

By contributing, you agree that your contributions are licensed under the [MIT License](./LICENSE).
