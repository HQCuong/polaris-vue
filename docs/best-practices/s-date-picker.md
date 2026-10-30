- **Start with a sensible date.** Pre-fill `value` so merchants can make their selection faster.
- **Offer shortcuts for common picks.** Presets such as "Today", "Last 7 days" or "This month" save merchants from clicking through the calendar.
- **Use `type="range"` for start and end dates.** Range selection suits reports, analytics and other filters based on a time period.
- **Block dates that don't apply.** Use `allow` and `disallow` so merchants can't pick dates that are invalid for your use case.
- **Leave room around the picker.** Give it enough space that it doesn't get in the way of on-screen keyboards or other interactive elements.
- **Plan for dates far away.** Paging month by month gets tedious beyond a few years, so for dates outside roughly a 5–10 year window, offer presets or let merchants enter the year directly.

```vue
<SDatePicker type="range" />
```

See [Shopify's best practices for `<s-date-picker>`](https://shopify.dev/docs/api/app-home/latest/web-components/forms/date-picker#best-practices) for the full guidance.
