# Profile maintenance

Edit professional copy, project links, and the technology focus weights in `profile.config.json`. Check [the evidence notes](research-audit.md) before changing a claim. Update `review.date` after reviewing the public sources.

Run the checks from the repository root.

```sh
npm run generate
npm run validate
npm run validate:links
npm run preview
```

`npm run generate` writes the README, SVGs, and their versioned copies. Desktop and mobile versions share the same content. The charts include static artwork for readers who prefer reduced motion.

Run `npm run refresh:activity` to fetch the public GitHub contribution calendar and rebuild the weekly chart. The chart shows the latest 12 completed weeks in the saved snapshot. GitHub can include anonymized private contributions in that calendar.

The monthly review workflow opens a checklist for recording changes in source evidence. Review the proposed change and run the checks before publishing. See the [cleanup audit](visual-qa.md) for this revision's provenance and validation.
