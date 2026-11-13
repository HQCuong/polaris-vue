import { Comment, Fragment, type VNode } from 'vue'

export interface ModalChildren {
  titleBar: VNode | undefined
  saveBar: VNode | undefined
  content: VNode[]
}

function flatten(nodes: VNode[], out: VNode[] = []): VNode[] {
  for (const node of nodes) {
    if (node.type === Fragment && Array.isArray(node.children)) {
      // v-for and <template v-if> render fragments; React's Children.toArray flattens too.
      flatten(node.children as VNode[], out)
    } else if (node.type !== Comment) {
      // Comments are v-if placeholders.
      out.push(node)
    }
  }
  return out
}

/**
 * Splits a `Modal` default slot the way `Modal` in `@shopify/app-bridge-react` 4.3.0
 * does: the last title bar and the last save bar stay as direct children of
 * `ui-modal`, everything else is modal content. `isTitleBar`/`isSaveBar` identify the
 * `TitleBar`/`SaveBar` components; raw `<ui-title-bar>`/`<ui-save-bar>` tags are
 * matched by tag name.
 */
export function splitModalChildren(
  nodes: VNode[],
  isTitleBar: (type: unknown) => boolean,
  isSaveBar: (type: unknown) => boolean,
): ModalChildren {
  let titleBar: VNode | undefined
  let saveBar: VNode | undefined
  const content: VNode[] = []
  for (const node of flatten(nodes)) {
    if (node.type === 'ui-title-bar' || isTitleBar(node.type)) titleBar = node
    else if (node.type === 'ui-save-bar' || isSaveBar(node.type)) saveBar = node
    else content.push(node)
  }
  return { titleBar, saveBar, content }
}
