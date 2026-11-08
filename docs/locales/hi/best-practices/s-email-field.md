- **स्पष्ट `label` इस्तेमाल करें।** "Customer email" या "Order notification email" जैसे नाम सिर्फ़ "Email" या "Email address" से ज़्यादा साफ़ हैं।
- **`details` में संदर्भ जोड़ें।** बताएँ कि address क्यों चाहिए या उसका इस्तेमाल कैसे होगा, जैसे "Required for digital receipts"।
- **`placeholder` में format दिखाएँ।** "you@example.com" जैसा उदाहरण address दिखाता है कि क्या टाइप करना है; सिर्फ़ label को न दोहराएँ।
- **`error` संदेशों को काम का बनाएँ।** Merchants को बताएँ कि address कैसे ठीक करें, जैसे "Enter a valid email address"।

```vue
<SEmailField
  label="Order notification email"
  details="We'll send order updates to this address."
  placeholder="you@example.com"
/>
```

सभी सुझावों के लिए [`<s-email-field>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/forms/email-field#best-practices) (अंग्रेज़ी में) देखें।
