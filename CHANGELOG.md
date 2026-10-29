# Changelog

All notable changes to `polaris-vue-elements` are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). While the version is `0.x`,
minor releases may include breaking changes, which are always called out below.

Wrapper and type changes follow `@shopify/polaris-types`, whose major version matches the
[Polaris CDN](https://polaris-vue-elements.dev/guide/quirks)
major your app loads (`polaris-1.js`, `polaris-2.js`, …).

## [Unreleased]

## [0.4.1] - 2026-10-29

Still generated from `@shopify/polaris-types` 2.0.0.

### Fixed

- A boolean prop written as a bare attribute (`<SChip removable />`, `<SButton disabled />`) is
  now on. Vue passes such an attribute to a prop declared without a Boolean type as `''`, which
  the wrapper treated as falsy, so the attribute never reached the element and only
  `:removable="true"` worked.

## [0.4.0] - 2026-10-27

Still generated from `@shopify/polaris-types` 2.0.0.

### Added

- Opt-in types for raw `<s-*>` tags: add `"types": ["polaris-vue-elements/elements"]` to
  `tsconfig.json` and Volar / vue-tsc type-check `<s-button variant="…">` in templates the
  same way they check the `SButton` wrapper, by augmenting Vue's `GlobalComponents` for
  every Polaris tag. Types only; `v-model` remains wrapper-only.

### Fixed

- `click`, `focus`, `blur`, `input` and `change` listeners are typed with the events the
  Polaris runtime actually fires (`MouseEvent`, `FocusEvent`, `Event`) instead of the
  manifest's blanket `CustomEvent`. An ordinary `@click="(e: MouseEvent) => …"` handler
  previously failed vue-tsc. **Breaking (types):** handlers annotated with `CustomEvent`,
  or reading `event.detail` (always `undefined` at runtime for these events), no longer
  type-check.

## [0.3.0] - 2026-10-27

Generated from `@shopify/polaris-types` 2.0.0 (was 1.1.0). No props, slots or icons were
removed.

### Added

- `SThumbnail` `loading` prop (`"eager" | "lazy"`).
- `STextField` `icon` accepts 41 more icon names, mostly `*-filled` variants (such as
  `globe-filled` and `file-filled`) plus `magic`, `text-magic`, `rank-top` and others.

### Changed

- **Docs and examples now load the stable Polaris 2 runtime**
  (`https://cdn.shopify.com/shopifycloud/polaris-2.js`) instead of `polaris-1.js`. Apps
  that stay on `polaris-1.js` keep working with these wrappers; only the additions above
  need the 2.x runtime.

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

[Unreleased]: https://github.com/HQCuong/polaris-vue/compare/v0.4.1...HEAD
[0.4.1]: https://github.com/HQCuong/polaris-vue/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/HQCuong/polaris-vue/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/HQCuong/polaris-vue/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/HQCuong/polaris-vue/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/HQCuong/polaris-vue/releases/tag/v0.1.0
