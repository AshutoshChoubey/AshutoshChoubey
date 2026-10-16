# Design system

## Identity and composition

Ashutosh Kumar Choubey is the primary brand. Frontend architecture and system design lead the professional identity; AI and agentic systems have an explicit exploration context. WorldGyan appears as a secondary founder, research, and education identity.

The composition pairs a centered white signature hero with midnight technical panels. Generous space, large name typography, aligned architectural geometry, and thin cyan connections create the visual hierarchy. A restrained saffron globe belongs to the WorldGyan signature. It does not replace the professional name.

All primary artwork is original vector geometry and SVG text. Do not introduce photographs, fictional faces, silhouettes, embedded bitmaps, remote imagery, external fonts, large badge collections, visitor counters, contribution animations, or numerical claims without evidence. The Ug0510 reference informed scale and panel consistency; its assets and exact layouts were not reused. See [the reference review](technology-review.md).

## Color tokens

| Token | Value | Use |
| --- | --- | --- |
| Midnight navy | `#0B1225` | Technical panel backgrounds, primary text on white |
| Deep electric blue | `#1E40AF` | Architectural emphasis and restrained gradients |
| Electric cyan | `#00C9FF` | Connections, signal details, selected emphasis on dark |
| Saffron | `#F59E0B` | Secondary founder globe and small accents |
| White | `#FFFFFF` | Hero surface and primary text on dark |
| Cool gray | `#94A3B8` | Secondary text on dark and quiet technical details |

Cyan and saffron are accents; do not assume either works as ordinary text on white. Use navy for text on white, and white or verified gray for text on dark. Measure the final foreground/background pair rather than treating a palette as an accessibility guarantee. Gradients must not create a low-contrast region behind important text.

## Type and scale

Use locally available sans-serif fallbacks: `Arial, Helvetica, system-ui, sans-serif`. Use `ui-monospace, SFMono-Regular, Consolas, monospace` for short technical labels. No network font is required.

The hero name is the largest element. The verified professional headline follows, then the architecture specialization. Supporting copy stays short. Technical sections use a consistent label, title, and diagram hierarchy. Avoid long paragraphs inside SVGs; the README supplies plain text context and working links.

Desktop artwork has a 960-unit-wide viewBox; mobile artwork has a separately composed 420-unit-wide viewBox. Mobile is a genuine rearrangement with larger proportional labels, not a tiny scaled desktop diagram. Keep every essential string inside the viewBox with clear padding. Test both the longest name line and diagram labels at the smallest supported width.

## Asset system

| Section | Desktop source output | Purpose |
| --- | --- | --- |
| Signature | `assets/hero.svg` | Name, title, frontend architecture, system design |
| Expertise | `assets/expertise.svg` | Four compact engineering capabilities |
| Technology | `assets/technology.svg` | Dominant Angular/TypeScript/reactive stack; subordinate support layer |
| AI systems | `assets/ai-systems.svg` | An explicitly exploratory agent workflow |
| Research | `assets/research.svg` | Multidisciplinary research and technical education |
| Contact | `assets/connect.svg` | Founder signature and closing statement |

Each section has a mobile counterpart and a static counterpart. Static assets mirror the full meaning of the animated panels; motion must never reveal the only copy of a claim, name, or connection. The generator is the authoritative source for the exact filenames.

The README uses `<picture>` with a mobile source at `max-width: 600px` and a fallback `<img>`. GitHub explicitly documents the picture/source/img pattern; its color-scheme example supports the approach, while width-based selection still needs hosted verification. Include meaningful alt text on every image and ordinary clickable Markdown links for all five official destinations. [GitHub formatting support](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/quickstart-for-writing-on-github).

## Motion

Decorative motion runs once and finishes within four seconds, including delays. Use a restrained line trace, soft entrance, or short gradient movement. Essential text remains readable from the static baseline. Avoid blinking, indefinite rotation, looping particles, and animated statistics.

Under `prefers-reduced-motion: reduce`, remove animations and show the complete final composition. The static assets contain no motion. Finite motion is particularly useful in GitHub's image context, where arbitrary interactive pause controls cannot be assumed. This design choice is informed by [W3C Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).

## Verification standard

Regenerate and run the validation commands in [maintenance](maintenance.md). Inspect 320, 375, 768, 1024, and 1440-pixel browser widths in light and dark surrounding themes, plus reduced-motion and the static README. Verify unclipped text, correct mobile selection, contact accessibility, geometry, contrast, and meaningful image alternatives.

Local previews establish the local layout only. After the user approves publication, inspect the actual public GitHub profile, hosted image URLs, responsive selection, and motion behavior. Record incomplete or inaccessible checks without calling them passed. Do not claim complete WCAG conformance from this visual review.

### Supplied WorldGyan branding

The later user-provided brand direction takes precedence over the initial saffron-only founder text. Set World to black and Gyan to saffron on white panels, including the founder signature. Preserve the supplied circular PNG logo unchanged as a separate linked Markdown/HTML image; never disguise it as original vector art or embed it into the SVG panels. AI architecture is explicitly labeled exploration.

## Advanced visual revision

The later title-case hero and original isometric/orchestration compositions are maintained in `scripts/design-v2.mjs`, using shared vector primitives and configuration. Surfaces use restrained blueprint grids, graduated cards and small inner highlights. Finite reveal, assembly, orbit, light-field and signal animations finish within four seconds. The responsive media breakpoint is configurable and currently 900px, reflecting GitHub profile column widths. The compact brand wordmark is 160px beside the unchanged 64px supplied logo. See `advanced-design-review.md` for evidence and the approval state.
