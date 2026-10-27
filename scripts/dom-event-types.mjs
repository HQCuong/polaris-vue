// Runtime types for Polaris events the manifest mistypes. Shared by generate.mjs (the
// `*Events` interfaces) and generate-docs.mjs (the Events tables) so the two can't drift.
//
// The manifest declares every event as `CustomEvent`, but these are native DOM events:
// in a browser against polaris-2.js, `click` is a PointerEvent, `focus`/`blur` are
// FocusEvents, and `input`/`change` are plain Events (an InputEvent when typing into a
// text field), with no `detail`. Typed as `CustomEvent`, an ordinary `(e: MouseEvent)`
// click handler fails vue-tsc. Checked on every component that declares these events
// (2026-10-27, Chrome).
//
// `click` is typed as MouseEvent rather than PointerEvent: PointerEvent extends it, and
// browsers have differed on which one a keyboard-activated click produces. `input` is
// typed as Event because checkboxes, selects, choice lists and pickers fire plain Events.
const DOM_EVENT_TYPES = {
  click: 'MouseEvent',
  focus: 'FocusEvent',
  blur: 'FocusEvent',
  input: 'Event',
  change: 'Event',
}

// `<s-date-field>` re-dispatches focus/blur as plain Events alongside the native
// FocusEvents, so a FocusEvent annotation would be wrong for some of its listeners.
const TAG_EXCEPTIONS = {
  's-date-field': { focus: 'Event', blur: 'Event' },
}

/**
 * The event type to expose for `eventName` on `tagName`, given the manifest's own type
 * text. Only replaces the manifest's blanket `CustomEvent`; any other manifest type
 * (including a future, more precise one) is kept as is.
 */
export function domEventType(tagName, eventName, manifestType) {
  if (manifestType !== 'CustomEvent') return manifestType
  return TAG_EXCEPTIONS[tagName]?.[eventName] ?? DOM_EVENT_TYPES[eventName] ?? manifestType
}
