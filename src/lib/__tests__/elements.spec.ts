import type { GlobalComponents } from 'vue'
import { describe, expectTypeOf, it } from 'vitest'
import type { PolarisElementTagName } from '../generated/elements'
import type { ButtonProps, ModalElement } from '../generated/types'

// Type-only assertions for the opt-in `polaris-vue-elements/elements` augmentation,
// which types raw `<s-*>` tags in Vue templates via `GlobalComponents`. Importing from
// generated/elements pulls the augmentation into this test project, the way consumers
// opt in through the package's `./elements` subpath.
describe('raw <s-*> tag types', () => {
  type RawButton = InstanceType<GlobalComponents['s-button']>

  it('types a raw tag with the same props and event listeners as its wrapper', () => {
    expectTypeOf<RawButton['$props']['variant']>().toEqualTypeOf<ButtonProps['variant']>()
    expectTypeOf<RawButton['$props']['onClick']>().toEqualTypeOf<
      ((event: MouseEvent) => void) | undefined
    >()
  })

  it('does not offer v-model on raw tags', () => {
    // v-model needs the wrapper's property/event mapping; a raw custom element has none.
    expectTypeOf<RawButton['$props']>().not.toHaveProperty('modelValue')
    expectTypeOf<InstanceType<GlobalComponents['s-text-field']>['$props']>().not.toHaveProperty(
      'modelValue',
    )
  })

  it('covers every Polaris tag', () => {
    expectTypeOf<PolarisElementTagName>().toExtend<keyof GlobalComponents>()
    expectTypeOf<'s-button'>().toExtend<PolarisElementTagName>()
  })

  it('types the element of a raw tag with its imperative methods', () => {
    expectTypeOf<InstanceType<GlobalComponents['s-modal']>['$el']>().toEqualTypeOf<ModalElement>()
  })
})
