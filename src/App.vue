<script setup lang="ts">
import { ref } from 'vue'
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

    <SSection heading="State">
      <SStack direction="block" gap="small">
        <SText>name: {{ name }}</SText>
        <SText>bio: {{ bio }}</SText>
        <SText>acceptsMarketing: {{ acceptsMarketing }}</SText>
        <SText>notificationsEnabled: {{ notificationsEnabled }}</SText>
        <SText>favoriteFruit: {{ favoriteFruit }}</SText>
      </SStack>
    </SSection>
  </SPage>
</template>
