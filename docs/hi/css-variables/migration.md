---
title: "@shopify/polaris-tokens से migrate करना"
description: "@shopify/polaris-tokens, Polaris React का token package है। Polaris web components इसका इस्तेमाल नहीं करते: runtime अपने ख़ुद के variables परिभाषित करता है, और ज़्यादातर नाम वैसे ही रहते हैं।"
---

# `@shopify/polaris-tokens` से migrate करना {#migrating-from-polaris-tokens}

`@shopify/polaris-tokens`, Polaris React का token package है। Polaris web components इसका
इस्तेमाल नहीं करते: runtime अपने ख़ुद के variables परिभाषित करता है, और ज़्यादातर नाम वैसे ही
रहते हैं। अगर आपके app का CSS किसी Polaris React app से आया है, तो उसे इन सूचियों से मिलाकर
देखें। जो नाम सिर्फ़ legacy package में है, उसकी web components app में कोई value नहीं होती,
इसलिए उसे इस्तेमाल करने वाले CSS को आपका लिखा हुआ `var()` fallback मिलता है, या कुछ भी नहीं।

<CssVariablesMigration />
