# Maintaining the profile

## Authoritative sources

- `profile.config.json` owns personal content, classifications, projects, resources, official links, and `review.date`.
- `scripts/generate-profile.mjs` owns the original compositions and generated README structure.
- `docs/research-audit.md`, `docs/professional-audit.md`, and `docs/technology-review.md` record evidence and uncertainty.
- `docs/design-system.md` defines the visual rules; generated SVGs and READMEs should not be edited by hand.

Keep the public README concise. Technology research can evolve without rewriting the professional headline or implying new experience.

## Make an evidence-backed update

1. Review the relevant public portfolio, source implementation, published research, or official documentation. Record the source URL, inspection date, observed facts, and limits in the research documents.
2. Edit `profile.config.json`. Preserve the distinction between Established Expertise, Currently Building, and Exploring and Researching. Only add a featured project after reading its implementation. Never include private names, code, credentials, or proprietary details.
3. Change `review.date` only after an actual human or agent has completed source research. A scheduled reminder, asset regeneration, link ping, dependency check, or calendar month change is not a content review.
4. Regenerate, validate, and render from the project root:

   ```sh
   node scripts/generate-profile.mjs
   npm run validate
   npm run validate:links
   npm run preview
   ```

5. Inspect the desktop, mobile, reduced-motion, and static output. Review the generated diff to ensure it includes only intended content. Check the five official links and relevant project/resource destinations.
6. Prepare a feature branch and pull request. Request the user's publishing approval before external publication and explicit merge approval before changing the default branch. Preserve existing repository history; never force-push.
7. After an approved merge, verify the actual public profile in a browser and record the hosted results. An approved feature branch or pull request alone does not make the profile live.

`npm run generate` is an equivalent regeneration shortcut. The preview script's runtime requirements and any unavailable browser checks must be reported honestly; a failed render cannot be replaced with a fabricated screenshot.

## Dates and changing technology

`review.date` is an ISO calendar date for completed source review. The initial date reflects the research performed for this implementation; it is not a permanent “current date.” Future review dates must be set deliberately.

Keep versions and release snapshots in the dated technology review, not in the main headline. Before changing application code, check compatibility between the target Angular, TypeScript, Node.js, and RxJS versions. Do not add fashionable frameworks automatically. Evidence of a working public AI application can justify stronger “Currently Building” wording; research interest alone cannot.

## Optional monthly review proposal

`.github/workflows/review-reminder.yml` prepares a review checklist PR once per calendar month. It also supports manual dispatch from GitHub Actions. The schedule is **the first day of each month at 09:30 Asia/Kolkata (04:00 UTC)**; GitHub schedules may be delayed and are not exact reminders. [GitHub scheduled events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows).

The workflow creates a `profile-review/YYYY-MM` branch and a dated file under `docs/reviews/`. Its date means **review requested**, never **review completed**. It opens one PR for that month and reuses an existing monthly PR. It does not change the README, assets, config, professional claims, research conclusions, or `review.date`; it never merges a PR. Existing checklist edits are preserved. A closed monthly PR remains closed rather than being recreated.

The workflow uses Python's standard library and GitHub's own REST API; it has no third-party Action dependency. Its token requires `contents: write` for the checklist branch and `pull-requests: write` for the proposal. It does not need a personal access token. Repository/organization settings must permit Actions to create PRs, and the workflow must be on the default branch for scheduled runs. These settings remain a publishing-time check. [GITHUB_TOKEN permissions](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token), [Git references](https://docs.github.com/en/rest/git/refs), [Git trees](https://docs.github.com/en/rest/git/trees), [Pull requests](https://docs.github.com/en/rest/pulls/pulls).

A reviewer performs the research, records evidence, makes any justified content/config changes, regenerates the visuals, runs checks, and requests approval through the normal process. Merge the checklist as a completed record only after recording actual results; close it without merging when no record is wanted. Disable the workflow in GitHub Actions to stop monthly proposals. This repository workflow does not create a Codex recurring automation.

## Review checklist

- Current professional title and biography agree with public evidence.
- Established, building, and exploration classifications remain accurate.
- Featured repositories still exist publicly and retain useful implementations.
- Research links describe genuinely published work and correctly distinguish planned subjects.
- Official professional links resolve or have an honest access limitation recorded.
- Technology/security sources have been reviewed where a change is proposed.
- No secrets, private data, fabricated metrics, or unsupported production claims were introduced.
- Generated desktop/mobile/static assets pass validation and visual inspection.
- Publishing, repository creation, merge, and account-setting decisions receive the required user approval.

## Recovering from a problem

Fix generated output by changing config or generator source, then regenerate. If a public change needs reversal, prepare a normal revert commit on a feature branch and follow the approval process. Do not rewrite public history. If a monthly workflow fails due to permissions, record the failed run and perform the same review manually; do not add a broader credential to bypass account policy.

For the advanced design revision, edit the hero, engineering and intelligent-systems compositions in `scripts/design-v2.mjs`. Shared definitions and unchanged core/research/signature compositions remain in `scripts/generate-profile.mjs`. Name case, headline, AI engineering direction and responsive breakpoint are configured in `profile.config.json`. Do not restore an old hardcoded headline or 600px assumption in validation.
