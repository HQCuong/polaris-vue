<script setup lang="ts">
// Type-only fixture: checked by `vue-tsc --build` (tsconfig.vitest.json), never run.
// It pins how consumers' templates type-check against `polaris-vue-elements/app-bridge`
// and the opt-in `polaris-vue-elements/app-bridge/elements` raw-tag types.
import { ref } from 'vue'
import type { AppBridgeElementTagName } from '../app-bridge/elements'
import { AppWindow, Modal, NavMenu, SaveBar, TitleBar } from '../app-bridge'

const rawTag: AppBridgeElementTagName = 'ui-modal'
const open = ref(false)
const modal = ref<InstanceType<typeof Modal> | null>(null)
function onShow(event: Event): void {
  void event
  void modal.value?.$el.show()
}
</script>

<template>
  <Modal ref="modal" id="m" v-model:open="open" variant="large" @show="onShow" @hide="onShow">
    <p>Content</p>
    <TitleBar title="Title">
      <button variant="primary" tone="critical">OK</button>
    </TitleBar>
  </Modal>
  <!-- @vue-expect-error variant is a union -->
  <Modal variant="bogus" />
  <SaveBar id="s" v-model:open="open" :discard-confirmation="true">
    <button variant="primary">Save</button>
    <button>Discard</button>
  </SaveBar>
  <AppWindow src="/window" v-model:open="open" />
  <!-- @vue-expect-error src is required -->
  <AppWindow />
  <NavMenu>
    <a href="/" rel="home">Home</a>
  </NavMenu>

  <component :is="rawTag" />
  <ui-modal id="raw" variant="small" @show="onShow" />
  <!-- @vue-expect-error variant is a union -->
  <ui-modal variant="bogus" />
  <ui-save-bar id="raw-sb" :discardConfirmation="true" />
  <ui-title-bar title="Raw" />
  <s-app-window src="/w" />
  <!-- @vue-expect-error src is required -->
  <s-app-window />
  <s-app-nav>
    <a href="/" rel="home">Home</a>
  </s-app-nav>
  <ui-nav-menu />
</template>
