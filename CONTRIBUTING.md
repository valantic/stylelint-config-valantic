# Contributing to this repository

## Getting started

* Clone this repository
* Run `npm install`

## Developing

* Make your changes
* Enhance the tests to fail for added rules
* Check the [release notes](https://stylelint.io/CHANGELOG) to see, if there are relevant new features for us to use

## Releasing

Releases are made directly from `master`. Tags are always `vX.Y.Z`.

1. Make sure all changes are merged into `master` and described under `## unreleased` in
   [CHANGELOG.md](CHANGELOG.md).
2. On an up-to-date `master`, run one of these (see [SemVer](https://semver.org/)):
   - `npm run release` — patch
   - `npm run release:minor` — minor
   - `npm run release:major` — major

   `scripts/release.mjs` aborts without changing anything if the working tree is not clean, `master` is behind
   `origin/master`, or `## unreleased` is empty. Otherwise it bumps the version in `package.json` and
   `package-lock.json`, renames `## unreleased` to `## vX.Y.Z` (adding a fresh `## unreleased` above it), updates
   the version pin in `README.md` if there is one, commits `Release vX.Y.Z`, creates the annotated tag `vX.Y.Z` and
   pushes both.
3. Publish the package to npm: `npm publish` (log in with `npm login` first if needed). This stays a manual step
   because it needs your npm authentication.
4. The `Release` workflow (`.github/workflows/release.yml`) creates the GitHub release for the pushed tag, using that
   version's `CHANGELOG.md` section as release notes. Check it on
   [GitHub releases](https://github.com/valantic/stylelint-config-valantic/releases).

`scripts/release.mjs` is shared by all valantic shared-frontend repos — keep the copies identical.

This repo still uses `master` as its default branch; it is planned to move to `main` like the other repos.
