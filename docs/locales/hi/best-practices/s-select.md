- **इसका उपयोग विकल्पों के ज्ञात समूह के लिए करें।** Select तब काम करता है जब merchants किसी पूर्वनिर्धारित list में से चुनते हैं। जब merchants को कोई custom value दर्ज करनी हो या लंबी list में खोजना हो, तो ऐसा text field जो टाइप करते समय मेल खाते विकल्प सुझाए, या खोजने योग्य dropdown, बेहतर विकल्प है।
- **विकल्पों को सोच-समझकर क्रम दें।** संबंधित विकल्पों को समूह में रखें, सबसे आम विकल्पों को पहले रखें, या जब कोई स्वाभाविक क्रम न हो तो वर्णानुक्रम में लगाएँ, ताकि merchants अपना विकल्प जल्दी ढूँढ सकें।
- **ऐसे labels लिखें जिन्हें आसानी से scan किया जा सके।** हर विकल्प को पर्याप्त context दें ताकि merchants कई विकल्पों को खोलकर पढ़े बिना उनमें अंतर कर सकें।
- **शुरुआती स्थिति जान-बूझकर चुनें।** जब कोई स्पष्ट default हो तो एक विकल्प पहले से चुन लें, और जब merchants को सोच-समझकर चुनाव करना चाहिए तो `placeholder` का उपयोग करें। शुरुआती स्थिति को अस्पष्ट न छोड़ें।
- **Validation की समस्याएँ समझाएँ।** जब कोई चयन आवश्यक या अमान्य हो, तो `error` से merchants को विशेष रूप से बताएँ कि क्या करना है, क्योंकि अनुकूलित संदेश सामान्य संदेशों की तुलना में forms जल्दी पूरा करने में मदद करते हैं।

```vue
<SSelect label="Shipping speed" placeholder="Choose a shipping speed" required>
  <SOption value="standard">Standard (5–7 business days)</SOption>
  <SOption value="express">Express (2–3 business days)</SOption>
  <SOption value="overnight">Overnight (next business day)</SOption>
</SSelect>
```

सभी सुझावों के लिए [`<s-select>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/forms/select#best-practices) (अंग्रेज़ी में) देखें।
