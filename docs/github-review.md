# GitHub design review — 17 October 2026

The finished design is published to the public **review branch**, not the default-branch profile homepage.

- Repository: https://github.com/AshutoshChoubey/AshutoshChoubey
- Rendered review: https://github.com/AshutoshChoubey/AshutoshChoubey/tree/profile/premium-redesign
- Pull request: https://github.com/AshutoshChoubey/AshutoshChoubey/pull/1
- Target: `main`; review branch: `profile/premium-redesign`.

The user's request to make the design on GitHub authorized repository creation and branch/PR publication. The master instruction's separate approval before merging still applies. Account-level identity fields, pins and other repository metadata have not been changed as part of this design publication. The new profile repository has its own descriptive summary.

## Design fixes and actual hosted checks

- Clipped each primary SVG composition to its rounded frame, including the hero's dark lower band.
- Reduced repeated identity/headline content below the hero while preserving ordinary accessible name and title text.
- Combined the supplied circular logo and a vector black/saffron WorldGyan wordmark into a compact linked lockup. The original PNG is unchanged and remains outside the vector compositions.
- Used supported paragraph wrappers to preserve section spacing in GitHub's actual rendered README.
- Narrowed the wordmark to fit beside the 64px logo inside GitHub's 320px content width.
- Preserved explicit AI architecture and agentic systems exploration wording.

On the rendered GitHub branch, Chrome checked **320, 375, 768, 1024 and 1440px**, each in light and dark mode using temporary local media emulation. All eight displayed images loaded; there was no horizontal page overflow. Mobile picture sources were selected at 320/375px and desktop sources at the larger widths. The logo and wordmark remained on one line at every width. GitHub retained the six picture sections and paragraph spacing.

Actual reduced-motion checks at 320 and 1440px selected and loaded all six appropriate static SVG sources. A directly opened GitHub-hosted expertise SVG showed five CSS animations running once for 4000ms; this verifies the hosted source's decorative animation behavior, alongside the embedded image rendering checks. Temporary viewport and media overrides were restored after testing.

Machine-readable local evidence is in `reports/github-browser.json` and `reports/github-reduced-motion.json`. Captures are `previews/github-{dark|light}-{width}.jpg`, plus `github-review-desktop.jpg` and `github-review-mobile.jpg`. These reports/captures are local review artifacts and included in the export, not copied third-party source.

The GitHub `Validate profile` workflow passed on the implementation and hosted layout fixes. A successful run for commit `71c3218f439b3092eae9a7e4d1542866102aafef` is https://github.com/AshutoshChoubey/AshutoshChoubey/actions/runs/38962133025 . Subsequent documentation commits should retain passing required checks before merging.

## Execution and remaining work

The local Git credential helper could not authenticate a push noninteractively. The connected GitHub API published the branch with ordinary commits and non-force ref updates instead. Chrome created the public repository through the official interface. No browser cookies, passwords or credentials were extracted, and no extension permissions were broadened. The local-only development history is preserved on `archive/local-design-history`; the working review branch follows the actual GitHub history.

Pending: obtain explicit merge approval, merge PR #1, inspect https://github.com/AshutoshChoubey itself at desktop/mobile sizes, verify final links/assets and capture the finished public profile. A repository branch preview does not prove that the design is active on the profile homepage. Account-level changes remain subject to their own approval in `account-proposal.md`.
