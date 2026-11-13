// Public entry of `polaris-vue-elements/app-bridge`: Vue counterparts of the
// `@shopify/app-bridge-react` 4.3.0 components and hook. Nothing in the main entry
// (`src/lib/index.ts`) imports from this folder, so apps that don't use App Bridge
// components never load this code.

// Same as app-bridge-react's `index.d.ts`: re-export every App Bridge type, which also
// brings the `shopify` global and the element interfaces into scope for importers.
export type * from '@shopify/app-bridge-types'

export { useAppBridge } from './useAppBridge'
export { Modal } from './Modal'
export { SaveBar } from './SaveBar'
export { AppWindow } from './AppWindow'
export { TitleBar } from './TitleBar'
export { NavMenu } from './NavMenu'
export type {
  AppWindowProps,
  ModalProps,
  NavMenuProps,
  OverlayEvents,
  OverlayOpenProps,
  SaveBarProps,
  TitleBarProps,
} from './types'
