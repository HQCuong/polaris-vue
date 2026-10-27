import { describe, expectTypeOf, it } from 'vitest'
import type { SButton, SDateField, STextField } from '../generated/components'

// Type-only assertions: these verify the `onX` event-listener props derived from a
// component's `*Events` shape (see `EventListenerProps` in `runtime/createWrapper.ts`).
// There is no meaningful runtime behavior to assert here — vue-tsc / tsc catches a
// regression at compile time via `@ts-expect-error`, and `expectTypeOf` is also checked
// statically by vitest's type-checking.
describe('typed event listeners', () => {
  type Props = InstanceType<typeof SButton>['$props']

  it('types native events with their DOM types, not the manifest CustomEvent', () => {
    // scripts/dom-event-types.mjs: the manifest says CustomEvent, the runtime fires
    // PointerEvent / FocusEvent / Event.
    expectTypeOf<Props>().toHaveProperty('onClick')
    expectTypeOf<Props['onClick']>().toEqualTypeOf<((event: MouseEvent) => void) | undefined>()
    expectTypeOf<Props['onFocus']>().toEqualTypeOf<((event: FocusEvent) => void) | undefined>()

    type FieldProps = InstanceType<typeof STextField>['$props']
    expectTypeOf<FieldProps['onInput']>().toEqualTypeOf<((event: Event) => void) | undefined>()
    expectTypeOf<FieldProps['onChange']>().toEqualTypeOf<((event: Event) => void) | undefined>()

    // <s-date-field> also re-dispatches focus/blur as plain Events.
    type DateFieldProps = InstanceType<typeof SDateField>['$props']
    expectTypeOf<DateFieldProps['onFocus']>().toEqualTypeOf<((event: Event) => void) | undefined>()
  })

  it('accepts ordinary MouseEvent and Event click handlers', () => {
    type OnClick = Props['onClick']

    const mouseHandler: OnClick = (event: MouseEvent) => event.clientX
    const eventHandler: OnClick = (event: Event) => event.type

    expectTypeOf(mouseHandler).not.toBeUndefined()
    expectTypeOf(eventHandler).not.toBeUndefined()
  })

  it('rejects a handler with an incompatible parameter type', () => {
    type OnClick = Props['onClick']

    // @ts-expect-error a handler expecting `string` is not assignable to `(event: MouseEvent) => void`
    const badHandler: OnClick = (event: string) => event

    expectTypeOf(badHandler).not.toBeUndefined()
  })

  it('rejects a listener prop for an event that does not exist on the component', () => {
    // SButton's events are `click` | `focus` | `blur` — there is no `onNonexistent` prop.
    // @ts-expect-error `onNonexistent` is not a key of SButton's props
    const props: Props = { onNonexistent: () => {} }

    expectTypeOf(props).toEqualTypeOf<Props>()
  })
})
