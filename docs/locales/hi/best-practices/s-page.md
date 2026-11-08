- **हर page को एक title दें।** `heading` में ऐसा title सेट करें जो उस page का वर्णन करे जिस पर merchant है।
- **किसी flow के भीतर breadcrumbs जोड़ें।** जब page किसी बड़े flow का एक चरण हो, तो वापस जाने के links को `breadcrumb-actions` slot में रखें।
- **Header actions को पूरे page के लिए रखें।** Header में actions केवल तभी रखें जब वे पूरे page पर लागू हों, न कि उसके किसी एक हिस्से पर।
- **Actions की संख्या सीमित रखें।** एक page पर अधिकतम एक primary action और तीन secondary actions का उपयोग करें।
- **Page के निचले हिस्से को actions से मुक्त रखें।** Page के अंत में कोई भी action न रखें।

```vue
<SPage heading="Edit product">
  <template #breadcrumb-actions>
    <SLink href="/products">Products</SLink>
  </template>
  <template #primary-action>
    <SButton variant="primary">Save</SButton>
  </template>
  <template #secondary-actions>
    <SButton>Duplicate</SButton>
    <SButton>Archive</SButton>
  </template>
  <!-- … -->
</SPage>
```

सभी सुझावों के लिए [`<s-page>` के लिए Shopify की best practices](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page#best-practices) (अंग्रेज़ी में) देखें।
