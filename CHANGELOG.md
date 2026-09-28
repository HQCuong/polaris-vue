# Changelog

All notable changes to `polaris-vue-elements` are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). While the version is `0.x`,
minor releases may include breaking changes, which are always called out below.

Wrapper and type changes follow `@shopify/polaris-types`, whose major version matches the
[Polaris CDN](https://polaris-vue.vict0r.net/guide/quirks)
major your app loads (`polaris-1.js`, `polaris-2.js`, …).

## [Unreleased]

## [0.2.0] - 2026-09-28

Generated from `@shopify/polaris-types` 1.1.0 (was 1.0.7).

### Added

- `SEmptyState`, `SNumber` and `SProgress` wrappers for the new `<s-empty-state>`,
  `<s-number>` and `<s-progress>` components.
- `SDatePicker`: `visibleMonths` prop.
- `SHeading`: `fontSize` prop.
- `SText` and `SParagraph`: `fontSize` and `fontWeight` props.
- `SSection`: `subheading` prop, and `accessory`, `graphic`, `primary-action`,
  `secondary-actions` and `supplemental` slots.
- `SPage`: `supplemental-start` slot.
- `SAvatar`: `small-100` and `large-100` sizes.
- New icon names for the `icon` / `type` props of `SBadge`, `SButton`, `SIcon`,
  `SPressButton`, `SSelect` and `STextField` (mostly `*-filled` variants).

### Changed

- Docs and README load the Polaris runtime from the stable, semver'd
  `https://cdn.shopify.com/shopifycloud/polaris-1.js` channel instead of the legacy
  `polaris.js` URL (which serves the same build today but never moves to a new major).
  Polaris 2.0 (`polaris-2.0-rc.js`) is a visual update with the same component API, so these
  wrappers work with it unchanged.

### Removed

- **Breaking (types):** `SModal` no longer accepts `alignSelf` — Shopify removed it from
  `<s-modal>`.
- **Breaking (types):** the `channels-filled` icon name was removed upstream.

## [0.1.0] - 2026-08-22

Initial release: typed Vue 3 wrappers for the 59 Shopify Polaris web components in
`@shopify/polaris-types` 1.0.7, generated from its Custom Elements Manifest.

### Added

- One wrapper component per `<s-*>` element, with typed props, typed event listeners and
  forwarded named slots.
- `v-model` support for form components (text, number, money, date, color and URL fields,
  checkbox, switch, select, choice list, date picker, drop zone, …).
- Typed element refs for components with imperative methods (e.g. `SModal`'s
  `showOverlay()` / `hideOverlay()` / `toggleOverlay()`).
- ESM build with bundled type declarations; `vue` ^3.5 as a peer dependency.

[Unreleased]: https://github.com/HQCuong/polaris-vue/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/HQCuong/polaris-vue/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/HQCuong/polaris-vue/releases/tag/v0.1.0
