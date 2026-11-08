- **Modals को उन फ़ैसलों के लिए रखें जिनमें ध्यान चाहिए।** Modal तब खोलें जब merchants को कोई खास चुनाव करना हो या किसी अहम बात को स्वीकार करना हो। अगर काम या tool सीधे पेज पर रह सकता है, तो उसे वहीं रखें।
- **इनका इस्तेमाल कम करें।** हर modal merchant के काम में रुकावट डालता है, इसलिए इसे default pattern के बजाय अहम पलों के लिए आखिरी उपाय मानें।
- **मुख्य action को उभारें।** Modal के `primary-action` slot में एक साफ़ और प्रमुख call to action दें।
- **Actions को स्पष्ट क्रियाओं से label करें।** "Delete", "Save" या "Continue" जैसे buttons merchants को बताते हैं कि क्या होगा; "Yes", "OK" या "Submit" जैसे सामान्य labels से बचें।
- **Destructive actions के नतीजे साफ़ बताएँ।** जब action कुछ delete या discard करता है, तो modal के body में बताएँ कि merchants क्या खो देंगे।
- **Modals को nest न करें।** पहले से खुले modal के अंदर से दूसरा modal खोलने से बचें।

```vue
<SModal id="delete-product" heading="Delete product?">
  <SParagraph>This permanently deletes the product and its variants. You can't undo this.</SParagraph>
  <SButton slot="primary-action" tone="critical">Delete product</SButton>
  <SButton slot="secondary-actions">Cancel</SButton>
</SModal>
```

सभी सुझावों के लिए [`<s-modal>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/modal#best-practices) (अंग्रेज़ी में) देखें।
