/**
 * Hand-written v-model mappings for Polaris web components.
 *
 * The Custom Elements Manifest has no concept of v-model, so this small map tells
 * `createWrapper` which prop/event pair to bind `modelValue` / `update:modelValue` to,
 * keyed by tag name. Every entry is verified against the manifest by
 * `src/lib/__tests__/overrides.spec.ts` (the tag must exist and the event must be real),
 * and that spec also fails if a new form-like component appears in the manifest without
 * a matching entry here.
 */
export interface VModelOverride {
  /** camelCase property name to bind `modelValue` to. */
  prop: string
  /** DOM event name to listen for and re-emit as `update:modelValue`. */
  event: string
}

export const vModelOverrides: Record<string, VModelOverride> = {
  's-text-field': { prop: 'value', event: 'input' },
  's-text-area': { prop: 'value', event: 'input' },
  's-search-field': { prop: 'value', event: 'input' },
  's-email-field': { prop: 'value', event: 'input' },
  's-password-field': { prop: 'value', event: 'input' },
  's-url-field': { prop: 'value', event: 'input' },
  's-number-field': { prop: 'value', event: 'input' },
  's-money-field': { prop: 'value', event: 'input' },
  's-color-field': { prop: 'value', event: 'input' },
  's-color-picker': { prop: 'value', event: 'input' },
  's-date-field': { prop: 'value', event: 'input' },
  // Value is the (string) representation of the selected file(s), not the FileList.
  's-drop-zone': { prop: 'value', event: 'input' },
  // Checkbox/switch model the `checked` state, not `value`.
  's-checkbox': { prop: 'checked', event: 'change' },
  's-switch': { prop: 'checked', event: 'change' },
  's-select': { prop: 'value', event: 'change' },
  // Multi-select list; models the `values` array, no `input` event exists.
  's-choice-list': { prop: 'values', event: 'change' },
  // Has both `input` and `change`; prefer `input` per the input>change tie-break rule.
  's-date-picker': { prop: 'value', event: 'input' },
}
