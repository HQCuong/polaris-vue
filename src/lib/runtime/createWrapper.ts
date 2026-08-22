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
 * Derives `onX` event-listener props from an events shape `E` (e.g.
 * `{ click: CustomEvent }` -> `{ onClick?: (event: CustomEvent) => void }`), the way Vue's
 * template compiler maps `@click` to an `onClick` prop.
 */
export type EventListenerProps<E> = {
  [K in keyof E as `on${Capitalize<string & K>}`]?: (event: E[K]) => void
}

/**
 * A lightweight constructor-shaped type for the props of a generated wrapper component,
 * used purely so callers (and template type-checking) see the manifest-derived prop
 * and event-listener types. Deliberately not `DefineComponent<...>` — casting to that
 * type here trips a TS "two different types with this name" recursion error, since the
 * concrete component defined below is itself a `DefineComponent` instantiated with
 * different type args.
 */
export type WrapperComponent<P, E = UnknownRecord, El extends HTMLElement = HTMLElement> = {
  new (): {
    $props: Partial<P> & EventListenerProps<E> & { modelValue?: unknown }
    /**
     * The wrapped custom element's root DOM node, typed to include any imperative
     * methods declared on it (e.g. `ModalElement#showOverlay`). Vue single-root
     * components' `$el` IS the root element at runtime, so this is truthful typing —
     * no runtime shim is involved.
     */
    $el: El
  }
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
export function createWrapper<
  P extends object = UnknownRecord,
  E extends object = UnknownRecord,
  El extends HTMLElement = HTMLElement,
>(meta: ComponentMeta): WrapperComponent<P, E, El> {
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
        // Forward every user-provided named slot verbatim (as Vue's `#name` spells it),
        // rather than gating on `meta.slots` (the manifest-derived slot-name list). The
        // manifest's slot names can drift from what the live custom element actually
        // accepts (e.g. Shopify Polaris expects camelCase `primaryAction`, not the
        // manifest's kebab-case `primary-action`, for `s-modal`'s slot), which silently
        // dropped user content when forwarding was gated on that list. Driving off the
        // actual slots the caller passed makes this robust to manifest drift and also
        // supports slots the manifest doesn't document at all.
        for (const slotName of Object.keys(slots)) {
          if (slotName === 'default') continue
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

  return component as unknown as WrapperComponent<P, E, El>
}
