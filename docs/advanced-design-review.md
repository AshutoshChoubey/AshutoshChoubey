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

- Generation and SVG/README validation pass: 52 deterministic files: README, 25 source SVGs, 25 identical content-versioned render copies, and their manifest. The original PNG logo is separate.
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

### GitHub raw-image cache correction

Hosted inspection showed that GitHub raw redirects can serve an earlier cached SVG despite a changed query string. README image sources now use content-versioned directory paths under `assets/rendered/`, keeping the required editable base asset filenames intact. Render copies are byte-for-byte identical to their originals; validation verifies hashes, XML and manifest entries. The generator prunes only obsolete files listed in its own manifest and rejects unsafe paths. This makes new dimensions and artwork request a new path without relying on redirect query preservation.

## Additional motion and signature refinement — 17 October 2026

The full verified name now appears on one line in both desktop and mobile compositions. A white signature panel contains a separate navy role box, with the role also on one line. Gyan changes from light amber to deeper saffron `#C65A0A`; World stays black and the supplied circular logo stays unchanged.

Motion now includes a 150-degree monogram ring rotation, staggered 32px architectural layer assembly, four staggered capability-card entrances, a separate role entrance, AI-node pulses and additional workflow/feedback signals. These are decorative finite sequences, not perpetual loops: all finish within four seconds, with static equivalents and reduced-motion support.

Chrome local checks passed all five widths in both themes, all eight images loaded, and all twelve composition text-bound checks passed. The browser animation inspector confirmed one iteration and duration plus delay at most 4000ms. Evidence is in `reports/motion-responsive.json` and `reports/motion-geometry.json`; the link check remains 12/12 reachable. PR #2 was found already merged during publication. This refinement is therefore reviewed separately in PR #3: https://github.com/AshutoshChoubey/AshutoshChoubey/pull/3 . Actual GitHub branch inspection confirmed all eight updated assets load with content-versioned paths and no horizontal overflow. The merged PR #2 is historical; PR #3 is the current approval gate.

## WorldGyan identity and engineering-motion refinement

The user requested the supplied WorldGyan logo in place of AC and the exact role Senior UI Engineer. The original PNG now heads the README as a linked image; AC and its empty space are removed from the vector hero. This keeps the supplied artwork intact and compatible with GitHub without external raster references inside SVG. The unspecified replacement for Interfaces / Systems / Intelligence is Frontend / Architecture / AI.

Engineering Systems now has a second rotating orbital track and satellite, stronger 85-degree main orbit movement, signal pulses on frontend and AI connectors, pulsing AI nodes, and staggered whole-card entrances including their labels. Mobile gains the same whole-card choreography and connector signals. All sequences run once within four seconds and have static/reduced-motion equivalents.

Chrome passed all five widths in both themes, nine images loaded, and all twelve composition text-bound checks passed. Engineering sections expose 28 desktop and 18 mobile animation tracks, each with one iteration and duration plus delay at most 4000ms. Generation, SVG/config validation and 12/12 link reachability checks pass. Evidence: reports/brand-checks.json. The previous motion PR #3 was already merged by the user; these subsequent changes require their own review.

## User-selected architecture headline

The user explicitly selected: Software Architect | Frontend & Full-Stack Product Architecture | System Design | Agentic AI. This replaces Senior UI Engineer throughout generated identity text and alternatives. The hero gives Software Architect the primary line, with the remaining specializations below inside an expanded role panel; the full name remains on one line. This is user-selected public positioning, not newly verified employment history. Existing source audit dates and exploration classifications remain intact.
