- **साथ रहने वाले content को समूह में रखें।** हर section को एक ही, सुसंगत काम दें, चाहे वह संबंधित जानकारी हो या संबंधित controls; तब वह एक visual container की तरह काम करता है और page की संरचना में अर्थ जोड़ता है।
- **वर्णनात्मक headings लिखें।** Merchants अपना रास्ता खोजने के लिए `heading` पर सरसरी नज़र डालते हैं, इसलिए किसी सामान्य title का सहारा लेने के बजाय बताएँ कि अंदर क्या है।
- **केवल उतनी गहराई तक nest करें जितनी content को ज़रूरत हो।** Nested section यह नहीं बदलता कि वह कैसा दिखता है, बल्कि heading hierarchy और page की रूपरेखा को प्रभावित करता है। इसे अधिकतम दो या तीन स्तरों तक रखें, और केवल तभी nest करें जब अतिरिक्त संरचना content को अधिक स्पष्ट बनाए।
- **जब content किनारे से किनारे तक फैलना चाहिए तो padding हटा दें।** Tables या images जैसी चीज़ों के लिए जिन्हें section भरना चाहिए, `padding="none"` का उपयोग करें, फिर जाँचें कि अंदर के content में अपनी पर्याप्त spacing बनी रहे।
- **जब heading पर्याप्त न हो तो `accessibilityLabel` जोड़ें।** जब screen पर दिखने वाली heading screen readers का उपयोग करने वालों के लिए section का उद्देश्य स्पष्ट न करे, तो उन्हें ऐसा label दें जो छूटा हुआ context पूरा करे।
- **सही header slot चुनें।** Heading को ही बदलने वाले विवरण, जैसे tooltip या कोई गिनती, `accessory` में रखें। पूरे section के बारे में जानकारी, जैसे status badge, `supplemental` में रखें। Button या menu जैसे actions `accessory` में आते हैं, क्योंकि `supplemental` उन्हें स्वीकार नहीं करता।

```vue
<SSection heading="Products" padding="none">
  <STable>
    <!-- … -->
  </STable>
</SSection>
```

सभी सुझावों के लिए [`<s-section>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/section#best-practices) (अंग्रेज़ी में) देखें।
