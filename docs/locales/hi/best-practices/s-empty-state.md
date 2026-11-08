- **पहले कारण बताएँ, फिर समाधान।** सिर्फ़ "No products" वाला heading merchants को अंदाज़ा लगाने पर छोड़ देता है। `heading` में बताएँ कि वहाँ कुछ क्यों नहीं है, और action को अगला कदम बताने दें।
- **एक primary action से शुरुआत करें।** उस एक कदम के लिए `primary-action` slot इस्तेमाल करें जो merchants को empty state से बाहर ले जाए, और बाकी विकल्प `secondary-actions` में रखें।
- **Filter किए गए नतीजों के लिए अलग शब्द चुनें।** ऐसा resource जिसमें कुछ भी नहीं है और ऐसा filter जिससे कुछ भी मेल नहीं खाया, ये दो अलग स्थितियाँ हैं। Filter किए गए नतीजों के लिए merchants को बताएँ कि filter कैसे बदलें।
- **Graphic को अतिरिक्त मानें।** असली काम heading और action करते हैं, इसलिए घने layouts में `graphic` slot खाली छोड़ दें, और जब इसका इस्तेमाल करें तो इसे एक icon या image तक सीमित रखें।

```vue
<SEmptyState heading="You haven't added any products yet">
  <template #primary-action>
    <SButton variant="primary">Add product</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Import products</SButton>
  </template>
</SEmptyState>
```

सभी सुझावों के लिए [`<s-empty-state>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state#best-practices) (अंग्रेज़ी में) देखें।
