<script setup lang="ts">
import { ref } from 'vue'
import { SSelect, SOption, SOptionGroup } from '@lib'

const value = ref('')
</script>

<template>
  <SSelect label="Shipping region" placeholder="Select a region" v-model="value">
    <SOptionGroup label="North America">
      <SOption value="us">United States</SOption>
      <SOption value="ca">Canada</SOption>
    </SOptionGroup>
    <SOptionGroup label="Europe">
      <SOption value="fr">France</SOption>
      <SOption value="de">Germany</SOption>
    </SOptionGroup>
  </SSelect>
  <p>Value: <code>{{ value || '(none)' }}</code></p>
</template>
