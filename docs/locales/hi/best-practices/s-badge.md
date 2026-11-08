- **संदर्भ के अनुसार साइज़ चुनें।** टेबल cells, list items या जहाँ भी कई badges एक साथ हों, वहाँ `size="base"` इस्तेमाल करें। `size="large"` को ऐसे अकेले badge के लिए रखें जिस पर ज़ोर देना ज़रूरी हो, जैसे पेज के ऊपर दिखाया गया मुख्य status।
- **Labels को एक या दो शब्दों तक सीमित रखें।** "Fulfilled" या "Out of stock" जैसे छोटे labels एक नज़र में पढ़ लिए जाते हैं। Status भूतकाल में लिखें, यानी "Refund" के बजाय "Refunded"।
- **Tone को status से मिलाएँ।** जिन errors या ज़रूरी समस्याओं पर कार्रवाई चाहिए उनके लिए `tone="critical"`, ध्यान माँगने वाली समस्याओं के लिए `tone="warning"`, सकारात्मक पुष्टि के लिए `tone="success"` और सामान्य statuses के लिए `tone="info"` इस्तेमाल करें। अपने पूरे app में एक ही status को हर जगह एक ही tone दें।
- **Badges को उसी के पास रखें जिसका वे वर्णन करते हैं।** List item में badge को title के पास रखें। टेबल में badges को उनका अपना column दें, ताकि merchants उसे जल्दी से स्कैन कर सकें।
- **Badges का इस्तेमाल सिर्फ़ system statuses के लिए करें।** Badges सिस्टम द्वारा तय किए गए स्थिर संकेत हैं, इसलिए merchants के बनाए tags या उनके द्वारा हटाए जा सकने वाले items के लिए इनका इस्तेमाल न करें।

```vue
<SBadge tone="success">Fulfilled</SBadge>
<SBadge tone="warning">Partially refunded</SBadge>
```

सभी सुझावों के लिए [`<s-badge>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/badge#best-practices) (अंग्रेज़ी में) देखें।
