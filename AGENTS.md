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

- `npm test` — runs `tests/run.js`, which lints `tests/*.{css,scss}` (not `tests/more/**`, which is not wired into
  any script) with this repo's own `index.js` config and compares the resulting warnings against the committed
  snapshot `tests/snapshot.json`. `tests/test.css`/`tests/tests.scss` are fixtures deliberately full of violations
  (each annotated `// This line should give error about X`), so the test never expects a clean lint — it expects the
  *same* warnings as last time. It passes when warnings match the snapshot and fails (non-zero exit, diff printed) when
  they differ, i.e. when a rule change in `index.js` starts/stops flagging something in the fixtures.
- `npm run test:update` — re-lints the fixtures and overwrites `tests/snapshot.json` with the current warnings. Run
  this and review the diff whenever a rule change in `index.js` intentionally changes what the fixtures flag.
- `npm run stylelint` — prints the installed Stylelint version (`stylelint -v`); not a lint run.
- `npm run release[:minor|:major]` — runs `scripts/release.mjs` (shared, identical in every shared-frontend repo):
  checks for a clean, up-to-date release branch (`main`) and a non-empty `## unreleased`, bumps the version, renames
  `## unreleased` to `## vX.Y.Z`, updates the README version pin, commits, creates the annotated `vX.Y.Z` tag and
  pushes. The `Release` workflow (`.github/workflows/release.yml`) then creates the GitHub release from that
  changelog section. Publishing to npm (`npm publish`) is a separate, manual step afterwards. See `CONTRIBUTING.md`. **Never run a release script or `npm publish` unless explicitly
  asked.**

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
- `tests/` contains the fixtures (`test.css`/`tests.scss`) and the snapshot test runner (`run.js`,
  `snapshot.json`) described under Commands above, plus many real-world component fixtures under `tests/more/` that
  are not currently linted by any script. When changing a rule in `index.js`, run `npm test` to see whether it now
  flags something differently in `tests/*.{css,scss}` and either fix the rule or run `npm run test:update` to accept
  the new expected output. `tests/` is excluded from the published npm package (not in `package.json`'s `files`
  allow-list).
- Peer dependency: `stylelint` (`^17.1.1`, per `package.json`). The README notes the config targets a specific
  Stylelint major version and warns that linting fails with "Undefined rule" errors on version mismatches, since
  Stylelint is not backwards compatible across majors — keep `index.js`/`fix.js` rule names in sync with whatever
  Stylelint version is targeted in `package.json`'s `peerDependencies`.
- Release process: see the `npm run release` entry under Commands above and `CONTRIBUTING.md`.

## Working rules

These rules are identical in every valantic shared-frontend repo.

- Git: never commit unless explicitly asked. Never push unless explicitly asked in that request. Never pull or
  create/switch branches (`git pull`, `git checkout`, `git switch`, `git branch`, …). Branch names are
  `feature/<name>` or `bugfix/<name>`.
- Never run a release script or `npm publish` unless explicitly asked.
- Never install, update or remove npm packages without approval. Never edit generated or vendored files
  (`node_modules/`, `dist/`, lock files by hand).
- Priorities: correctness, simplicity, consistency with the existing code, maintainability, minimal changes. Prefer the
  smallest correct change.
- Understand the existing code and search for existing implementations before adding new ones; reuse over new
  abstractions. Do not refactor unrelated code, change public APIs, or change behavior outside the task's scope.
- Before finishing, run `npm test` and fix failures caused by the change. Every change gets a changelog entry and,
  where a feature changes, a doc update (see Changelog and Documentation below).
- If a requirement is unclear, ask. If only an implementation detail is unclear, follow the existing patterns in this
  repo.

## Changelog (required for every task)

`CHANGELOG.md` follows the convention shared by all valantic shared-frontend repos.

- Every change that alters behavior, fixes a bug, or adds/removes something consumers can see gets one entry under
  `## unreleased` in the same change — do not defer it to a follow-up task.
- Format: `- [type] Description.` — one entry per logical change, kept as a flat list (no "Added"/"Fixed" category
  subheadings), so each entry stays self-contained and merge conflicts can be resolved line by line.
- Allowed prefixes ([Conventional Commits](https://www.conventionalcommits.org/) types): `[feat]`, `[fix]`,
  `[refactor]`, `[perf]`, `[docs]`, `[test]`, `[build]`, `[ci]`, `[chore]`, `[revert]`. Older prefixes in released
  sections (`[ENHANCEMENT]`, `(Change)`, …) are history — do not reuse them and do not rewrite old entries.
- Write the description so it is understandable without the diff: name the affected module and the effect for
  consumers.
- Breaking changes are grouped under a `### Breaking Changes` subheading placed directly under `## unreleased`, above
  the regular entries. They keep their prefix and must end with a **Migration:** sentence stating what consumers
  have to do.
- A change is breaking if it raises the major version of the `stylelint` peer, drops a supported Node.js/Stylelint
  version, or removes/renames an exported config file (`index.js`, `fix.js`). A new or stricter rule (or a changed
  property order in `property-groups/`) that only makes consumers fix their code is not breaking: log it as `[feat]`
  naming the rule, and release it as at least a minor version.
- Headings: title `# Changelog`, unreleased section `## unreleased` (exact, lowercase — release tooling matches it
  literally), released sections `## vX.Y.Z`. Only the unreleased section is edited; released sections stay as they
  are.

## Documentation

This repo keeps its own feature docs in a `docs/` folder (with an index at `docs/README.md`) — this is separate from
the workspace-level `docs/` at the root of `valantic/` and must not be skipped in favor of it.

- Every exported config (`index.js`, `fix.js`) and each property-group category in `property-groups/` gets one
  Markdown file under `docs/` describing what it enforces/orders and how to layer it into a consumer's
  `.stylelintrc.js`.
- When adding, changing, or removing a config or a property-group category, update the matching doc in the same
  change — do not defer it to a follow-up task.
- `docs/README.md` is the index; add a one-line link to every new doc file there.
