<script setup lang="ts">
import { SButton, SPopover, SText } from '@lib'
</script>

<template>
  <SButton commandFor="docs-example-popover" command="--toggle">Toggle popover</SButton>

  <SPopover id="docs-example-popover">
    <SText>Popover content, opened via commandFor/command on the button above.</SText>
  </SPopover>
</template>
