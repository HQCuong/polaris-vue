- **Use it to filter in place.** It suits narrowing down the content of a specific section or list. Global navigation or complex, multi-step searches call for a more robust search pattern.
- **Say what's being searched.** Write a specific `label` and `placeholder` that tell merchants which content the search covers and which attributes they can search by.
- **Respond as merchants type.** Where you can, update the results or filtered content while merchants type, so they can refine their query and trust that the search is working.
- **Plan for cleared and empty searches.** When the field is cleared, bring back the full list. When nothing matches, show a message that suggests another action or a broader search.
- **Wait for enough input.** Avoid running searches that would return too many or meaningless results; starting after two or three characters gives you enough to return useful matches.

```vue
<SSearchField label="Search products" placeholder="Search by title, SKU or vendor" />
```

See [Shopify's best practices for `<s-search-field>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/search-field#best-practices) for the full guidance.
