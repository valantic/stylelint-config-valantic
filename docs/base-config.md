# Base config (`index.js`)

`index.js` is the package's `main` export and the config most consumers extend directly:

```js
module.exports = {
  extends: 'stylelint-config-valantic',
  rules: {
    // project-specific overrides
  },
};
```

See the [Quickstart in the main README](../README.md#quickstart) for the install step.

## What it builds on

- Extends `stylelint-config-standard` as the base rule set.
- Extends `stylelint-config-html/vue` so Stylelint can parse `<style>` blocks inside `.vue` Single File Components.
- Adds an `overrides` entry so any `**/*.scss` file is parsed with `postcss-scss` instead of the default CSS parser,
  since SCSS syntax (nesting, `$variables`, `@include`, etc.) is not valid plain CSS.
- Registers the `stylelint-scss` and `stylelint-order` plugins, which make SCSS-specific rules (e.g.
  `scss/at-rule-no-unknown`) and the `order/order` rule available.

## Notable rule overrides on top of `stylelint-config-standard`

- `color-hex-length: 'long'` — hex colors must use the long form.
- `color-named: 'never'` — named colors (`red`, `blue`, …) are disallowed.
- `declaration-no-important: true` — `!important` is disallowed.
- `max-nesting-depth: 4` — caps nested selector depth.
- `selector-max-id: 0` — ID selectors are disallowed.
- `selector-attribute-quotes: 'always'` — attribute selector values must be quoted.
- `value-no-vendor-prefix` / `property-no-vendor-prefix` / `selector-no-vendor-prefix` — vendor-prefixed values,
  properties and selectors are restricted, with narrow, explicit exceptions for known-necessary ones (e.g.
  `-webkit-appearance`, `::-webkit-input-placeholder`).
- `declaration-block-no-redundant-longhand-properties` — enabled, with `grid-template` excluded from the check.
- `length-zero-no-unit` — enabled, but custom properties are allowed a unit (e.g. `0px`) so they still work through
  `calc()`.
- `color-function-notation: 'legacy'` and `color-function-alias-notation: 'with-alpha'`.
- `at-rule-no-unknown` is turned off in favor of `scss/at-rule-no-unknown` (with `property` in `ignoreAtRules`, for
  the CSS `@property` at-rule).
- `declaration-property-value-no-unknown` and `custom-property-pattern` are disabled, `function-no-unknown` is
  disabled to accept SCSS functions, and `no-descending-specificity` and `selector-not-notation` are disabled
  (the latter because IE11 does not support selector lists inside `:not()`).

## `order/order`: coarse structural order

`order/order` enforces the order of a rule block's *contents*, not the order of individual CSS declarations:

1. SCSS `$variables`
2. custom properties
3. `@extend`
4. non-block `@include`s (`hasBlock: false`)
5. regular declarations
6. nested `@media` blocks and block `@include`s (`hasBlock: true`)
7. nested rules

This is a different, coarser concern than the property-by-property ordering (`color` before `font-size`, etc.),
which lives in the separate, optional [fix config](./fix-config.md).

## BEM enforcement via `selector-class-pattern`

The most opinionated single rule is `selector-class-pattern`, a regular expression that only allows class selectors
matching valantic's BEM dialect, plus a handful of fixed utility classes (`.row`, `.col-*`, `.spacing`,
`.spacing-*`, `.align`, `.align--*`, `.container`, `.container-fluid`, `.focus`, `.typo--*`).

The BEM shape it enforces:

```
<namespace>-<block>[-<n>][__<element>[-<n>]][--<modifier>[-<n>]][:<pseudo>]
```

For example:

```scss
.c-block { }
.c-block__element { }
.c-block__element--modifier { }
.c-advertisement-1__element-1--modifier-1 { }
```

are valid, while `.c-block__element__element` (nesting two elements) or `.c-heading--h9` (an out-of-range modifier
suffix on the reserved heading-level pattern) are rejected. The full pattern, with the capture groups and a longer
list of valid/invalid examples, is documented directly above the `rules` export in `index.js` — that comment is the
authoritative reference for whether a given class name passes or fails.

If Stylelint flags `selector-class-pattern`, first check whether the class name is simply not BEM-shaped yet, before
assuming the rule needs loosening. Narrow, local exceptions (e.g. a legacy folder) should go through the config's
`overrides` array for specific file globs rather than disabling the rule globally.

## Tests

`npm test` runs `tests/run.js`, which lints `tests/*.{css,scss}` with this config and compares the resulting
warnings against the committed `tests/snapshot.json`. The fixtures are deliberately full of violations, so the test
never expects a clean lint — it expects the *same* warnings as last time. When a rule change in `index.js`
intentionally changes what the fixtures flag, run `npm run test:update` and review the diff. `tests/` is excluded
from the published npm package (see `package.json`'s `files` allow-list).
