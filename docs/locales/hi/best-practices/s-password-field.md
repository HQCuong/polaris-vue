- **Password managers के साथ काम करें।** `new-password` या `current-password` जैसी उपयुक्त `autocomplete` value सेट करें, ताकि password managers merchants को मज़बूत passwords बनाने और सहेजने में मदद कर सकें।
- **नियम पहले ही बता दें।** Merchants के टाइप करना शुरू करने से पहले हर password आवश्यकता की सूची दें, बजाय इसके कि उन्हें केवल गलत entry के बाद दिखाया जाए। इससे झुंझलाहट और अधूरे छोड़े गए forms से बचा जा सकता है।
- **Password बनाते समय merchants का मार्गदर्शन करें।** बिना context के केवल नियम लागू करने के बजाय password की मज़बूती पर तुरंत feedback दें और समझाएँ कि उसे और मज़बूत कैसे बनाया जा सकता है।
- **Merchants को paste करने दें।** Password managers और ऐसे ही tools paste करने पर निर्भर करते हैं, और इसे रोकने से merchants ऐसे कमज़ोर passwords की ओर जाते हैं जिन्हें वे याद से टाइप कर सकें।
- **Client-side checks को केवल feedback मानें।** Password की जाँच हमेशा अपने server पर करें, क्योंकि browser की सीमाओं को आसानी से bypass किया जा सकता है। Client-side validation जल्दी प्रतिक्रिया देने के लिए है, सुरक्षा देने के लिए नहीं।

```vue
<SPasswordField label="New password" autocomplete="new-password" details="Use at least 12 characters." />
```

सभी सुझावों के लिए [`<s-password-field>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/forms/password-field#best-practices) (अंग्रेज़ी में) देखें।
