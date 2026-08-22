<script setup lang="ts">
import { SDivider, SParagraph } from '@lib'
</script>

<template>
  <SParagraph>Content above the divider.</SParagraph>
  <SDivider />
  <SParagraph>Content below the divider.</SParagraph>
  <SDivider color="strong" />
  <SParagraph color="subdued">A stronger divider variant.</SParagraph>
</template>
