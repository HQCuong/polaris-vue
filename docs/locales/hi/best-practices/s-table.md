- **Tables का उपयोग उस data के लिए करें जिसकी merchants तुलना करते हैं।** Tables उन कई records के लिए उपयुक्त हैं जिनके attributes समान हैं और जिन्हें साथ-साथ scan करना होता है। बिना तुलना वाली साधारण list के लिए कोई सरल component चुनें।
- **Mobile के list layout की योजना बनाएँ।** Mobile पर table एक list में बदल जाती है, इसलिए जाँचें कि आपके headers और values grid के बजाय एक के नीचे एक label और value के जोड़ों के रूप में भी ठीक से पढ़े जा सकें।
- **Columns की संख्या कम रखें।** बहुत सारे columns table को scan करना कठिन बनाते हैं और horizontal scrolling करवाते हैं। केवल वही columns दिखाएँ जिनकी merchants को अपने काम के लिए ज़रूरत है, और बाकी को माँगने पर दिखाने पर विचार करें।
- **स्पष्ट column headers लिखें।** हर `STableHeader` को छोटा और वर्णनात्मक रखें ताकि merchants ठीक-ठीक जानें कि column में कौन-सा data है।
- **बड़े datasets की योजना बनाएँ।** बड़ी tables performance और usability को नुकसान पहुँचाती हैं। लगभग 50 से 100 से अधिक rows होने पर `paginate` चालू करें, या filters या search जोड़ने पर विचार करें ताकि merchants सही records तक जल्दी पहुँच सकें।

```vue
<STable paginate hasNextPage>
  <STableHeaderRow>
    <STableHeader>Product</STableHeader>
    <STableHeader format="numeric">Inventory</STableHeader>
  </STableHeaderRow>
  <STableBody>
    <STableRow>
      <STableCell>Snowboard</STableCell>
      <STableCell>24</STableCell>
    </STableRow>
  </STableBody>
</STable>
```

सभी सुझावों के लिए [`<s-table>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/table#best-practices) (अंग्रेज़ी में) देखें।
