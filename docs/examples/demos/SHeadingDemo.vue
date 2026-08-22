<script setup lang="ts">
import { SHeading, SParagraph } from '@lib'
</script>

<template>
  <SHeading>Default heading</SHeading>
  <SParagraph>Renders as a semantic heading element by default.</SParagraph>

  <SHeading accessibilityRole="presentation">Presentational heading</SHeading>
  <SParagraph>Same visual style, but stripped from the accessibility tree's heading structure.</SParagraph>

  <SHeading :lineClamp="1" style="max-width: 220px">
    A long heading that gets truncated to a single line via lineClamp
  </SHeading>
</template>
