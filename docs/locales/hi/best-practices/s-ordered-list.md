- **इसका उपयोग तब करें जब क्रम का कोई अर्थ हो।** क्रमांकित lists क्रम, प्राथमिकता या रैंकिंग दर्शाती हैं, इसलिए वे चरण-दर-चरण निर्देशों या रैंक की गई सिफ़ारिशों के लिए उपयुक्त हैं। अगर क्रम मायने नहीं रखता, तो इसके बजाय `SUnorderedList` का उपयोग करें।
- **Items को एक ही ढंग से लिखें।** हर item को समान व्याकरण और संरचना दें ताकि list आसानी से पढ़ी जा सके। हर item पर शैली बदलने से पाठकों को अधिक मेहनत करनी पड़ती है।
- **हर item को छोटा रखें।** Lists इसलिए काम करती हैं क्योंकि उन्हें जल्दी से scan किया जा सकता है। अगर items लंबे या जटिल हो जाएँ, तो उन्हें अलग sections में बाँटने पर विचार करें।
- **बहुत गहराई तक nest न करें।** Nesting का एक स्तर संबंधित बिंदुओं को व्यवस्थित कर सकता है, लेकिन दो स्तरों से आगे जाने पर उसे समझना कठिन हो जाता है और यह संकेत मिलता है कि content को किसी अलग संरचना की ज़रूरत है।

```vue
<SOrderedList>
  <SListItem>Choose a shipping carrier</SListItem>
  <SListItem>Print the shipping label</SListItem>
  <SListItem>Mark the order as fulfilled</SListItem>
</SOrderedList>
```

सभी सुझावों के लिए [`<s-ordered-list>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/ordered-list#best-practices) (अंग्रेज़ी में) देखें।
