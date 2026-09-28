# Changelog

## unreleased

- [docs] Added `docs/` (with an index at `docs/README.md`) describing the base config (`index.js`), the fix config
  (`fix.js`), and the `property-groups/` property-order categories, moved from the internal workspace knowledge
  base into the repo itself.
- [ci] Aligned `.github/workflows/test.yml` with the other shared-frontend repos: job `test`, step "Run tests"
  (the old label claimed checks that don't run here), Node version read from `.nvmrc`, token limited to
  `contents: read`.
- [ci] Added the shared `Security Scan` workflow (`.github/workflows/security.yml`, Trivy): scans the dependencies
  daily and on pull requests, opens/updates a `security` issue on CRITICAL/HIGH findings, closes it when clean, and
  uploads the results to the GitHub Security tab.
- [chore] Fixed the `license` field in `package.json`: it said `ISC`, while `LICENSE` and the README have always
  been MIT. Harmonized the copyright line in `LICENSE` to `2017-present, valantic CEC Schweiz AG`.
- [docs] Restructured `AGENTS.md` to the shared outline and added the shared `## Working rules` section (git rules, no
  release/publish or dependency changes without approval, engineering priorities, `npm test` before finishing).
- [docs] Completed `CONTRIBUTING.md` with the shared outline (Getting started / Developing / Changelog / Releasing).
- [docs] Added a `## Contributing` section to `README.md` linking `CONTRIBUTING.md` (contribution and release steps).
- [build] Added `npm run release[:minor|:major]` (releases were fully manual before), running the shared
  `scripts/release.mjs`. It releases from an up-to-date `master` only, aborts on uncommitted changes or an empty
  `## unreleased` section, renames that section to `## vX.Y.Z`, updates the README version pin, and commits, tags
  (`vX.Y.Z`, annotated) and pushes.
- [ci] Added the `Release` workflow (`.github/workflows/release.yml`): pushing a `vX.Y.Z` tag creates the GitHub
  release, using that version's `CHANGELOG.md` section as release notes. It fails if the section is empty.
- [docs] Rewrote the release steps in `CONTRIBUTING.md` for the new release script: releases are made directly from
  `master` (no release branch, no `develop` merge-back), `npm publish` stays a manual step and the GitHub release is
  created by the workflow.
- [docs] Renamed `CHANGES.md` to `CHANGELOG.md` and adopted the shared shared-frontend changelog convention
  (`unreleased` / `vX.Y.Z` headings, `[feat]`/`[fix]`/… prefixes, `### Breaking Changes` with migration notes),
  documented in `AGENTS.md` and `CONTRIBUTING.md`. Released version headings were normalized to `## vX.Y.Z`; their
  entries are unchanged.
- [ci] Added `.github/workflows/test.yml` (previously missing), a "CI Test" workflow running on
  `actions/checkout@v7` / `actions/setup-node@v7` with Node 25.
- [docs] Added `.github/PULL_REQUEST_TEMPLATE.md` (previously missing), matching the streamlined, checklist-free
  template used across other valantic shared-frontend repos.
- [build] Added a `files` allow-list to `package.json` (and removed the now-redundant `.npmignore`) so the published
  package only ships `index.js`, `fix.js`, `property-groups/`, `package.json`, `LICENSE` and `README.md` — dev/test
  files (`tests/`, docs) are no longer installed by consumers.

## v10.1.0
- (Change) Update stylelint to version 17.4.0.
- (Change) Remove 'declaration-property-value-no-unknown' rule.

## v10.0.0
- (Breaking) Requires stylelint version 17. (Check Migration guide https://github.com/stylelint/stylelint/blob/17.1.1/docs/migration-guide/to-17.md)

## v9.1.0
- (Change) Introduces new rule for 'color-function-alias-notation' set to 'with-alpha'.
- (Change) Updates dependencies.

## v9.0.0
- (Breaking) Requires stylelint version 16. (Check Migration guide https://github.com/stylelint/stylelint/blob/16.0.0/docs/migration-guide/to-16.md)

## v8.0.1
- (Bugfix) Fixes typo for repository in package.json.

## v8.0.0
- (Breaking) Requires stylelint version 15. (Check Migration guide if you need to update stylelint: https://github.com/stylelint/stylelint/blob/main/docs/migration-guide/to-15.md)

## v7.1.5
- (Change) Switches 'dollar-variables' and 'custom-properties' on 'order/order' to allow usage of scss variables in custom properties.

## v7.1.4
- (Change) Extends documentation with information on how to handle folder specific configurations.

## v7.1.3
- (Change) Moves `background` properties after 'specific', `border` and `fill` properties.

## v7.1.2
- (Change) Moves `color` to `typography` section for property order.

## v7.1.1
- (Change) Weakens class regex to allow `.typo--` classes.

## v7.1.0
- (Feature) Adds support for --fix and unified property order.

## v7.0.0
- (Change) Loosening 'max-line-length' to allow a length of 130 characters.
- (Change) Loosening 'declaration-block-no-redundant-longhand-properties' to allow grid-template with redundant longhand properties.
- (Breaking) Requires stylelint-scss installed separately.

## v6.5.1

- (Bugfix) Uses stylelint-config-standard instead of stylelint-config-standard-scss to better match our conventions.

## v6.5.0
- (Update) Updates dependencies.

## v6.4.0
- (Feature) Adds new linting rules from stylelint 13.13.0.

## v6.3.0
 - (Feature) Adds support for @property at rule.

## v6.2.1
 - (Feature) Enables support for custom element selectors.
 - (Change) Disables no-descending-specificity rule.
