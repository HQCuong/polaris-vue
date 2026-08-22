import { describe, expectTypeOf, it } from 'vitest'
import type { SButton } from '../generated/components'

// Type-only assertions: these verify the `onX` event-listener props derived from a
// component's `*Events` shape (see `EventListenerProps` in `runtime/createWrapper.ts`).
// There is no meaningful runtime behavior to assert here — vue-tsc / tsc catches a
// regression at compile time via `@ts-expect-error`, and `expectTypeOf` is also checked
// statically by vitest's type-checking.
describe('typed event listeners', () => {
  type Props = InstanceType<typeof SButton>['$props']

  it('accepts a correctly-typed onClick handler on SButton props', () => {
    expectTypeOf<Props>().toHaveProperty('onClick')
    expectTypeOf<Props['onClick']>().toEqualTypeOf<((event: CustomEvent) => void) | undefined>()
  })

  it('rejects a handler with an incompatible parameter type', () => {
    type OnClick = Props['onClick']

    // A handler expecting `string` is not assignable to `(event: CustomEvent) => void`.
    // @ts-expect-error a handler expecting `string` is not assignable to `(event: CustomEvent) => void`
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
