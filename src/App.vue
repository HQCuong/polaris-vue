<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import {
  SPage,
  SSection,
  SStack,
  SButton,
  SBadge,
  SBanner,
  SSpinner,
  SText,
  STextField,
  STextArea,
  SCheckbox,
  SSwitch,
  SSelect,
  SOption,
  SModal,
  SPopover,
  STooltip,
} from '@/lib'

const count = ref(0)

function increment(): void {
  count.value += 1
}

// Form state, round-tripped through v-model on the wrapper components below.
const name = ref('Ada Lovelace')
const bio = ref('Writes playground demos for polaris-vue.')
const acceptsMarketing = ref(true)
const notificationsEnabled = ref(false)
const favoriteFruit = ref('apple')

// Overlays: modal/popover/tooltip demo state.
const modalRef = useTemplateRef<InstanceType<typeof SModal>>('modal')
const modalStatus = ref('never opened')

function openModalImperatively(): void {
  modalRef.value?.$el.showOverlay()
}

function onModalAftershow(): void {
  modalStatus.value = 'open'
}

function onModalAfterhide(): void {
  modalStatus.value = 'closed'
}
</script>

<template>
  <SPage heading="polaris-vue playground">
    <SSection heading="Actions">
      <SStack direction="inline" gap="base" alignItems="center">
        <SButton variant="primary" @click="increment">Primary action</SButton>
        <SButton variant="secondary" @click="increment">Secondary action</SButton>
        <SButton variant="tertiary" @click="increment">Tertiary action</SButton>
        <SButton variant="primary" loading>Loading</SButton>
        <SButton variant="secondary" disabled>Disabled</SButton>
        <SBadge tone="info">Clicks: {{ count }}</SBadge>
      </SStack>
    </SSection>

    <SSection heading="Feedback">
      <SStack direction="block" gap="base">
        <SBanner heading="Heads up" tone="info">
          <SText>This banner needs slot content, or it renders empty.</SText>
        </SBanner>
        <SBanner heading="Something went wrong" tone="critical">
          <SText>Critical banners use the same default-slot pattern.</SText>
        </SBanner>
        <SStack direction="inline" gap="base" alignItems="center">
          <SSpinner accessibilityLabel="Loading content" />
          <SBadge tone="success">Success</SBadge>
          <SBadge tone="warning">Warning</SBadge>
          <SBadge tone="critical">Critical</SBadge>
          <SBadge tone="neutral">Neutral</SBadge>
        </SStack>
      </SStack>
    </SSection>

    <SSection heading="Form">
      <SStack direction="block" gap="base">
        <STextField v-model="name" label="Name" placeholder="Your name" />
        <STextArea v-model="bio" label="Bio" :rows="3" />
        <SCheckbox v-model="acceptsMarketing" label="Accepts marketing emails" />
        <SSwitch v-model="notificationsEnabled" label="Enable notifications" />
        <SSelect v-model="favoriteFruit" label="Favorite fruit">
          <SOption value="apple">Apple</SOption>
          <SOption value="banana">Banana</SOption>
          <SOption value="cherry">Cherry</SOption>
        </SSelect>
      </SStack>
    </SSection>

    <SSection heading="Overlays">
      <SStack direction="block" gap="base">
        <SStack direction="inline" gap="base" alignItems="center">
          <SButton commandFor="demo-modal" command="--show">Open modal (declarative)</SButton>
          <SButton @click="openModalImperatively">Open modal (imperative)</SButton>
          <SButton commandFor="demo-popover" command="--toggle">Toggle popover</SButton>
          <SButton interestFor="demo-tooltip">Hover me for a tooltip</SButton>
        </SStack>

        <SPopover id="demo-popover">
          <SText>Popover content, opened via commandFor/command on a button.</SText>
        </SPopover>

        <STooltip id="demo-tooltip">Tooltip content, activated via interestFor.</STooltip>

        <SModal
          ref="modal"
          id="demo-modal"
          heading="Demo modal"
          @aftershow="onModalAftershow"
          @afterhide="onModalAfterhide"
        >
          <SText>This modal is controlled both declaratively (commandFor/command) and imperatively (typed $el methods).</SText>
          <template #primary-action>
            <SButton variant="primary" command="--hide" commandFor="demo-modal">Close</SButton>
          </template>
          <template #secondary-actions>
            <SButton variant="secondary" command="--hide" commandFor="demo-modal">Cancel</SButton>
          </template>
        </SModal>
      </SStack>
    </SSection>

    <SSection heading="State">
      <SStack direction="block" gap="small">
        <SText>name: {{ name }}</SText>
        <SText>bio: {{ bio }}</SText>
        <SText>acceptsMarketing: {{ acceptsMarketing }}</SText>
        <SText>notificationsEnabled: {{ notificationsEnabled }}</SText>
        <SText>favoriteFruit: {{ favoriteFruit }}</SText>
        <SText>modalStatus: {{ modalStatus }}</SText>
      </SStack>
    </SSection>
  </SPage>
</template>
