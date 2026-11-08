- **Menus का इस्तेमाल secondary actions के लिए करें।** "Save" जैसे primary actions को पेज पर ही दिखने दें। Menus उन actions के लिए ठीक हैं जिन्हें merchants कम इस्तेमाल करते हैं या destructive actions के लिए, जैसे "Archive" या "Export data", जिन्हें स्थायी जगह की ज़रूरत नहीं होती।
- **Labels को क्रिया और संज्ञा के रूप में लिखें।** "Edit details" या "Export as CSV" जैसे labels ठीक-ठीक बताते हैं कि क्या होगा; "Options", "More" या "Settings" जैसे अस्पष्ट labels से बचें।
- **लंबे menus को sections में बाँटें।** जब किसी menu में चार या ज़्यादा items हों, तो संबंधित actions को `heading` वाले `SSection` में समूहित करें, जैसे रोज़ाना के actions के लिए "Manage" और destructive actions के लिए "Danger zone"।
- **ऐसे icons जोड़ें जो label का साथ दें।** Editing के लिए `edit`, deleting के लिए `delete` या exporting के लिए `download` जैसे icons merchants को action पहचानने में मदद करते हैं, लेकिन उन्हें text को मज़बूत करना चाहिए, कभी उसकी जगह नहीं लेनी चाहिए।
- **सिर्फ़ उसी को disable करें जो फ़िलहाल उपलब्ध नहीं है।** जब कोई action मौजूदा संदर्भ में लागू न हो, जैसे पहले से refund हो चुके order को refund करना, तो उस item पर `disabled` सेट करें। अगर कोई action कभी लागू नहीं होता, तो उसे menu से हटा दें।

```vue
<SButton commandFor="product-actions">Product actions</SButton>
<SMenu id="product-actions" accessibilityLabel="Product actions">
  <SSection heading="Manage">
    <SButton icon="edit">Edit product</SButton>
    <SButton icon="duplicate">Duplicate product</SButton>
  </SSection>
  <SSection heading="Danger zone">
    <SButton icon="archive">Archive product</SButton>
    <SButton icon="delete" tone="critical">Delete product</SButton>
  </SSection>
</SMenu>
```

सभी सुझावों के लिए [`<s-menu>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/actions/menu#best-practices) (अंग्रेज़ी में) देखें।
