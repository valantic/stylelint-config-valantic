# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Codex, Cursor, Copilot, etc.) when working with code in
this repository.

## What this is

`stylelint-config-valantic` is valantic's shared Stylelint configuration for CSS/SCSS (and Vue-embedded style) linting.
Unlike other packages in this workspace, it is published to the **npm registry** (see `CONTRIBUTING.md`'s release
steps: `npm publish`), not consumed via a `github:` dependency. Consumers install it directly:
`npm install stylelint-config-valantic stylelint --save-dev`. There is no build step — `package.json`'s `main` points
straight at `index.js`, and there is no `exports` field. `package.json`'s `files` field is the allow-list
(`index.js`, `fix.js`, `property-groups/`), so dev/test files (`tests/`, docs) are excluded from the published
package.

A consumer applies it by extending it in their own `.stylelintrc.js`:

```js
module.exports = {
  extends: 'stylelint-config-valantic',
  rules: { /* project overrides */ },
};
```

and optionally layers the stricter `fix` config (see Architecture below) for auto-fix-on-commit setups.

## Commands

- `npm test` — runs Stylelint against the fixture files in `tests/*.{css,scss}` using this repo's own `index.js`
  config (`stylelint 'tests/*.{css,scss}' --custom-syntax postcss-scss --config index.js`). This is effectively a
  self-lint / regression check: it should pass cleanly against the fixtures in `tests/` and `tests/more/`. There is no
  separate per-file test invocation — run `npm test` as a whole, or point `stylelint` at a single fixture manually,
  e.g. `npx stylelint tests/test.css --custom-syntax postcss-scss --config index.js`.
- `npm run stylelint` — prints the installed Stylelint version (`stylelint -v`); not a lint run.

There is no lint/build/format script for the config's own source files (`index.js`, `fix.js`, `property-groups/*.js`)
beyond `npm test`.

## Architecture

- `index.js` is the main exported config (`main` in `package.json`). It extends `stylelint-config-standard` and
  `stylelint-config-html/vue` (for parsing `<style>` blocks in `.vue` files), adds an `overrides` entry so `**/*.scss`
  files are parsed with `postcss-scss`, registers the `stylelint-scss` and `stylelint-order` plugins, and then defines
  valantic's rule overrides (BEM-based `selector-class-pattern`, `order/order` for property groups like
  `dollar-variables`/`declarations`/`rules`, vendor-prefix restrictions, etc.).
- `fix.js` is a separate, optional config for `--fix` runs (e.g. in a git hook / lint-staged step). It only adds
  `order/properties-order` (built from `property-groups/`) and disables `order/properties-alphabetical-order`. It is
  meant to be combined with a project's own `.stylelintrc.js` (see the fix-config setup in `README.md`), not used
  standalone.
- `property-groups/` holds the outside-in CSS property ordering used by `fix.js`, split into numbered files that are
  concatenated in order: `0_reset.js`, `1_positioning-layout.js`, `2_boxModel.js`, `3_visual.js`, `4_typography.js`,
  `5_animation.js`, `6_misc.js`. Each file exports a flat array of property names/patterns for that group. Preserve
  this numeric ordering and grouping when adding new properties — the array order in `fix.js` output is derived
  directly from file load order.
- `tests/` contains real-world SCSS/CSS fixtures (a top-level `test.css`/`tests.scss` plus many component fixtures
  under `tests/more/`) that `npm test` lints against `index.js`. These act as regression fixtures: when changing a
  rule in `index.js`, check whether it now flags something in `tests/` and update the rule or the fixture accordingly.
  `tests/` is excluded from the published npm package (not in `package.json`'s `files` allow-list).
- Peer dependency: `stylelint` (`^17.1.1`, per `package.json`). The README notes the config targets a specific
  Stylelint major version and warns that linting fails with "Undefined rule" errors on version mismatches, since
  Stylelint is not backwards compatible across majors — keep `index.js`/`fix.js` rule names in sync with whatever
  Stylelint version is targeted in `package.json`'s `peerDependencies`.
- Release process (see `CONTRIBUTING.md`): changes are logged in `CHANGES.md` under `## Next`, then moved under a
  version heading at release time; version is bumped in `package.json`/`package-lock.json`; a git tag and GitHub
  release are created; then `npm publish`. Do not perform these steps unless explicitly asked.

## Documentation

This repo keeps its own feature docs in a `docs/` folder (with an index at `docs/README.md`) — this is separate from
the workspace-level `docs/` at the root of `valantic/` and must not be skipped in favor of it.

- Every exported config (`index.js`, `fix.js`) and each property-group category in `property-groups/` gets one
  Markdown file under `docs/` describing what it enforces/orders and how to layer it into a consumer's
  `.stylelintrc.js`.
- When adding, changing, or removing a config or a property-group category, update the matching doc in the same
  change — do not defer it to a follow-up task.
- `docs/README.md` is the index; add a one-line link to every new doc file there.
