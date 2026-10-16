# Advanced profile design review

Design revision requested on 17 October 2026. The previous profile was merged through PR #1 and appears on the public overview page. This subsequent revision has its own review branch; it is not automatically substituted for the approved main-branch design.

## Requested identity and content

Use **Ashutosh Kumar Choubey**, with an initial capital for each name, and the user-requested descriptive headline **Senior Frontend UI Engineer**. The existing public GitHub biography describes Senior UI engineering; this revision does not invent a new employer, employment history or architect job title. The user selected the new headline after reviewing the published profile. The original research date remains unchanged because a visual revision is not a new professional-source audit.

Frontend Architecture, Enterprise Engineering, System Design and Performance & Scalability remain the four established capability areas. A separate, explicitly **Exploring** layer introduces AI Architecture, Agentic AI and AI Orchestration, with LLM Integration, MCP, evaluations and human review. The dedicated intelligent-systems diagram shows intent/context, orchestration, model integration, tools/knowledge and evaluation as a conceptual workflow. It is not presented as a deployed professional system.

Angular, TypeScript, JavaScript, RxJS and NgRx keep the established core hierarchy. The supplied WorldGyan circular logo is unchanged; World remains black and Gyan saffron.

## Three visual passes

1. **Composition:** title-case name, larger editorial typography, a personal AC monogram, an original layered architecture motif, established/exploring capability separation, and a richer orchestration diagram. Reviewed desktop and 320px Chrome captures.
2. **Depth and motion:** added graduated card surfaces, fine inner highlights, soft light fields, layered vector planes and moving signal paths. Name reveal and layer assembly are finite and leave all content visible at rest. No scripts, external fonts, portraits or bitmap content were placed inside SVGs.
3. **Production quality:** simulated the actual GitHub profile column instead of assuming the repository README width. Changed the configurable mobile composition breakpoint to 900px so the 768px profile sidebar cannot shrink desktop diagrams excessively. Narrowed the linked brand wordmark to fit the actual 320px profile column. Matched ordinary text sizing and checked all five widths in both surroundings. The geometry inspector now prefixes SVG identifiers to prevent cross-panel clip/gradient collisions in its inline QA document.

## Local checks

- Generation and SVG/README validation pass: 26 deterministic files, comprising README and 25 SVGs. The original PNG logo is separate.
- Actual browser text bounds have no overflow in any of the twelve primary desktop/mobile compositions.
- Actual Chrome profile-column previews at 320, 375, 768, 1024 and 1440px pass in both light and dark surroundings: all eight images load, no horizontal overflow, branding stays aligned, and the intended responsive composition is selected.
- All motion is decorative, runs once and finishes within four seconds. Reduced-motion sources and final animation behavior are checked before delivery.
- Link reachability is recorded in the current local report. Blocked automated requests are reported honestly rather than called successful content verification.

Evidence: `reports/v2-responsive.json`, `reports/v2-svg-geometry.json`, current link report, and `previews/v2-{dark|light}-{width}.jpg`. Composition sources are separated into `scripts/design-v2.mjs`; personal content stays in `profile.config.json`.

Before merging this revision: inspect the actual rendered GitHub review branch, verify its latest CI and obtain the required final approval. After merge: recheck the actual profile overview and capture final screenshots. Account-level fields and pins retain their separate approval requirement.

## GitHub review-stage evidence

Rendered review branch: https://github.com/AshutoshChoubey/AshutoshChoubey/tree/profile/advanced-visual-design . Review PR: https://github.com/AshutoshChoubey/AshutoshChoubey/pull/2 . GitHub validation passed on the initial advanced design in https://github.com/AshutoshChoubey/AshutoshChoubey/actions/runs/38975011675 .

The actual branch was checked at all five widths in light and dark mode: all eight images loaded, no horizontal overflow, and the 900px responsive sources selected as intended. All six reduced-motion static variants loaded on both 320px and 1440px. Direct hosted SVG inspection confirmed finite orbit/light/trace animations and three assembling vector planes, with one iteration and a maximum duration of 4000ms. A final brand refinement gives the unchanged logo and vector wordmark equal 64px display heights, preserving a compact single-row lockup.

The final current-head check and captures are local delivery artifacts in `reports/v2-github-responsive.json`, `reports/v2-github-reduced.json`, `reports/v2-motion.json` and `previews/v2-github-*`. PR #2 remains the explicit approval gate for this subsequent revision. No account profile fields or pins were modified.
