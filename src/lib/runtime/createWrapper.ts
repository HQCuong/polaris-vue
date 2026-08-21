import { defineComponent, h, cloneVNode, type VNode } from 'vue'
import { vModelOverrides } from '../overrides'

/**
 * Describes a single prop derived from the Custom Elements Manifest.
 */
export interface ComponentPropMeta {
  /** camelCase JS property name (e.g. `accessibilityLabel`). */
  name: string
  /** Lowercase HTML attribute name, or `null` when the prop is property-only. */
  attribute: string | null
  /** The manifest type text, verbatim (e.g. `"auto" | "primary" | "secondary"`). */
  type: string
}

/**
 * Describes a single Polaris web component, as derived from the manifest.
 */
export interface ComponentMeta {
  /** The custom element tag name (e.g. `s-button`). */
  tagName: string
  props: ComponentPropMeta[]
  events: string[]
  slots: string[]
}

type UnknownRecord = Record<string, unknown>

/**
 * A lightweight constructor-shaped type for the props of a generated wrapper component,
 * used purely so callers (and template type-checking) see the manifest-derived prop
 * types. Deliberately not `DefineComponent<...>` — casting to that type here trips a TS
 * "two different types with this name" recursion error, since the concrete component
 * defined below is itself a `DefineComponent` instantiated with different type args.
 */
export type WrapperComponent<P> = {
  new (): { $props: Partial<P> & { modelValue?: unknown } }
}

function applyElementProperties(el: unknown, bindings: Array<[string, unknown]>): void {
  const target = el as UnknownRecord
  for (const [key, value] of bindings) {
    target[key] = value
  }
}

/**
 * Creates a Vue component that wraps a single Polaris custom element.
 *
 * - All manifest-derived props are declared so they don't leak into `$attrs`.
 * - Props that map to an HTML attribute are serialized onto the element as attributes
 *   (booleans render as an empty-string attribute when `true`, and are omitted otherwise).
 * - Props that are property-only (no matching attribute) are assigned directly as DOM
 *   properties on the element once it is mounted/updated.
 * - Any remaining `$attrs` (class, style, aria-*, native event listeners, arbitrary
 *   attributes) are passed straight through to the underlying element.
 * - When the tag has a v-model mapping in `overrides.ts`, a `modelValue` prop is
 *   accepted and an `update:modelValue` event is emitted from the mapped DOM event.
 */
export function createWrapper<P extends object = UnknownRecord>(
  meta: ComponentMeta,
): WrapperComponent<P> {
  const vModel = vModelOverrides[meta.tagName]

  const propsDef: Record<string, { type: null; default: undefined }> = {}
  for (const prop of meta.props) {
    propsDef[prop.name] = { type: null, default: undefined }
  }
  if (vModel) {
    propsDef.modelValue = { type: null, default: undefined }
  }

  const component = defineComponent({
    name: meta.tagName,
    inheritAttrs: false,
    props: propsDef,
    emits: vModel ? ['update:modelValue'] : [],
    setup(props, { attrs, slots, emit }) {
      return () => {
        const finalAttrs: UnknownRecord = { ...attrs }
        const propertyBindings: Array<[string, unknown]> = []
        const typedProps = props as UnknownRecord

        for (const prop of meta.props) {
          const value = typedProps[prop.name]
          if (value === undefined) continue
          if (prop.attribute) {
            if (prop.type === 'boolean') {
              if (value) finalAttrs[prop.attribute] = ''
            } else {
              finalAttrs[prop.attribute] = value
            }
          } else {
            propertyBindings.push([prop.name, value])
          }
        }

        if (vModel) {
          const modelValue = typedProps.modelValue
          if (modelValue !== undefined) {
            const propMeta = meta.props.find((prop) => prop.name === vModel.prop)
            if (propMeta?.attribute) {
              if (propMeta.type === 'boolean') {
                if (modelValue) finalAttrs[propMeta.attribute] = ''
              } else {
                finalAttrs[propMeta.attribute] = modelValue
              }
            } else {
              propertyBindings.push([vModel.prop, modelValue])
            }
          }

          const eventKey = `on${vModel.event.charAt(0).toUpperCase()}${vModel.event.slice(1)}`
          const userListener = finalAttrs[eventKey] as ((event: Event) => void) | undefined
          finalAttrs[eventKey] = (event: Event) => {
            const target = event.target as unknown as UnknownRecord
            emit('update:modelValue', target[vModel.prop])
            userListener?.(event)
          }
        }

        if (propertyBindings.length > 0) {
          finalAttrs.onVnodeMounted = (vnode: { el: unknown }) => {
            applyElementProperties(vnode.el, propertyBindings)
          }
          finalAttrs.onVnodeUpdated = (vnode: { el: unknown }) => {
            applyElementProperties(vnode.el, propertyBindings)
          }
        }

        const children: VNode[] = []
        if (slots.default) children.push(...slots.default())
        for (const slotName of meta.slots) {
          if (!slotName || slotName === 'default') continue
          const slotFn = slots[slotName]
          if (!slotFn) continue
          for (const vnode of slotFn()) {
            children.push(cloneVNode(vnode, { slot: slotName }))
          }
        }

        return h(meta.tagName, finalAttrs, children)
      }
    },
  })

  return component as unknown as WrapperComponent<P>
}
