---
title: Vue में Shopify Polaris web components — ज्ञात quirks
description: Vue 3 से इस्तेमाल किए जाने पर Shopify Polaris web components के browser में जाँचे गए quirks — slot की ज़रूरतें, events का timing और v-model का व्यवहार, जो आम Vue component libraries से अलग है।
---

# ज्ञात quirks और सावधानियाँ {#known-quirks-gotchas}

ये underlying Polaris web components के असली, browser में जाँचे गए व्यवहार हैं,
जो हमेशा वैसे नहीं होते जैसी आप किसी आम Vue component library से आने पर
उम्मीद करेंगे। इनसे टकराने से पहले इसे पढ़ लेने से आपका debugging का
कुछ समय बचेगा।

## 1. `<SBanner>` को slot content चाहिए {#_1-sbanner-needs-slot-content}

सिर्फ़ `heading` attribute काफ़ी नहीं है — `<s-banner>` तब तक खाली render होता है जब तक
उसके default slot में भी content न हो।

```vue
<!-- ❌ Don't: renders an empty banner -->
<SBanner heading="Heads up" tone="info" />

<!-- ✅ Do: give it body content via the default slot -->
<SBanner heading="Heads up" tone="info">
  <SText>Something you should know about.</SText>
</SBanner>
```

## 2. Modal के action slots सिर्फ़ कुछ ख़ास button variants स्वीकार करते हैं {#_2-modal-action-slots-only-accept-specific-button-variants}

`SModal` का `primary-action` slot सिर्फ़ एक ही button स्वीकार करता है, जिसका
`variant="primary"` हो। Polaris अंदर ही अंदर slot content को manually assign करता है, और
जो भी node मेल नहीं खाता, वह **चुपचाप हटा दिया जाता है** — न कोई warning, न कोई error, वह
बस render नहीं होता। `secondary-actions` ऐसे buttons स्वीकार करता है जिनका `variant`
`secondary` या `auto` हो।

```vue
<!-- ❌ Don't: wrong variant in primary-action, vanishes silently -->
<template #primary-action>
  <SButton variant="secondary" command="--hide" commandFor="demo-modal">Close</SButton>
</template>

<!-- ✅ Do: primary-action must be variant="primary" -->
<template #primary-action>
  <SButton variant="primary" command="--hide" commandFor="demo-modal">Close</SButton>
</template>

<!-- ✅ Do: secondary-actions accepts secondary or auto -->
<template #secondary-actions>
  <SButton variant="secondary" command="--hide" commandFor="demo-modal">Cancel</SButton>
</template>
```

## 3. Number type वाले props को bind करना चाहिए, string attributes की तरह नहीं लिखना चाहिए {#_3-number-typed-props-must-be-bound-not-written-as-string-attributes}

Polaris का अपना documentation सामान्य HTML attributes (जैसे `rows="3"`) दिखाता है,
लेकिन Vue में यह भ्रामक है: `number` type वाले props के लिए `vue-tsc` एक
bound expression की उम्मीद करता है, string literal की नहीं।

```vue
<!-- ❌ Don't: vue-tsc rejects a string literal for a number prop -->
<STextArea label="Bio" rows="3" />

<!-- ✅ Do: bind it so it's passed as a number -->
<STextArea label="Bio" :rows="3" />
```

## 4. Slot assignment सिर्फ़ एक बार, connect के समय होता है {#_4-slot-assignment-happens-once-at-connect-time}

Parent के mount होने के बाद किसी child का `slot` attribute बदलने से वह दोबारा
assign नहीं होता। अगर किसी element को एक named slot से दूसरे में ले जाना हो, तो
`slot` को reactively बदलने के बजाय उसे दोबारा render करें (जैसे `v-if`/`:key` से)।

```vue
<!-- ❌ Don't: dynamically re-pointing `slot` after mount is a no-op -->
<SButton :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>

<!-- ✅ Do: force re-creation when the slot assignment needs to change -->
<SButton :key="isPrimary" :slot="isPrimary ? 'primary-action' : 'secondary-actions'">...</SButton>
```

## 5. Polaris runtime का version CDN पर तय होता है — इस library का version runtime का version नहीं है {#_5-the-polaris-runtime-is-versioned-on-the-cdn-—-this-library-s-version-is-not-the-runtime-s-version}

अगस्त 2026 से Polaris CDN semantic versioning का पालन करता है
([changelog](https://shopify.dev/changelog/the-polaris-cdn-is-adopting-semantic-versioning))।
अपनी release प्रक्रिया के अनुसार channel चुनें:

| URL | क्या देता है |
| --- | --- |
| `polaris-2.js` | Stable 2.x channel — Shopify admin की नई visual style; compatible (minor) updates अपने आप मिलते हैं। **सुझाया गया।** |
| `polaris-2.0.js` | Pinned release — जब तक आप pin नहीं बदलते, कोई feature, fix या visual बदलाव नहीं। |
| `polaris-1.js` | पिछला stable 1.x channel। |
| `polaris.js` | Legacy URL — फ़िलहाल `polaris-1.js` वाला ही build देता है और अपने आप कभी नए major पर नहीं जाता। |

नया major (जैसे 2.0) हमेशा वैकल्पिक होता है: script URL आप खुद बदलते हैं। Polaris
2.0 एक visual update है: इसका Custom Elements Manifest
(`@shopify/polaris-types@2.0.0`) वही tags, props, events और slots declare करता है
जो 1.1 में हैं, साथ में कुछ नई चीज़ें (`SThumbnail` का `loading` prop, `STextField` के और
icons), इसलिए ये wrappers `polaris-1.js` के साथ भी काम करते हैं।

आप कोई भी channel लोड करें, runtime आपके इंस्टॉल किए गए `polaris-vue-elements` के version
से स्वतंत्र रूप से update होता है। इस library का version सिर्फ़ यह दिखाता है कि इसके
generate किए गए **types और wrappers** कितने ताज़ा हैं:

- पुराना wrapper पहले से मौजूद components को कभी नहीं तोड़ता — बस हो सकता है कि उसमें
  उन features के typed props/events न हों जो Shopify ने wrapper के आख़िरी बार
  generate होने के बाद जोड़े।
- अज्ञात props फिर भी काम करते हैं: वे बिना type के `$attrs` के ज़रिए
  underlying element तक पहुँच जाते हैं।
- अज्ञात/नए components फिर भी काम करते हैं: जब तक उनके लिए typed wrapper generate न हो,
  सीधे raw custom element tag (जैसे `<s-new-component>`) इस्तेमाल करें।

```vue
<template>
  <!-- A brand-new Polaris component with no polaris-vue-elements wrapper yet still works -->
  <s-new-component some-new-prop="value" />
</template>
```
