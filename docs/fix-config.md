# Fix config (`fix.js`)

The [base config](./base-config.md) enforces a coarse structural order inside a rule block (`order/order`), but it
does not enforce the order of individual CSS declarations within the "declarations" section — whether `color`
should come before or after `margin-top`. That fine-grained, more opinionated concern is split into its own,
optional config: `fix.js`.

## What it contains

```js
const reset = require('./property-groups/0_reset');
const positioning = require('./property-groups/1_positioning-layout');
const boxModel = require('./property-groups/2_boxModel');
const visual = require('./property-groups/3_visual');
const typography = require('./property-groups/4_typography');
const animation = require('./property-groups/5_animation');
const misc = require('./property-groups/6_misc');

const outsideInOrder = [
  ...reset,
  ...positioning,
  ...boxModel,
  ...visual,
  ...typography,
  ...animation,
  ...misc,
];

module.exports = {
  plugins: 'stylelint-order',
  rules: {
    'order/properties-order': outsideInOrder,
    'order/properties-alphabetical-order': null,
  },
};
```

It does exactly two things:

1. Sets `order/properties-order` to one flat array built by concatenating the seven
   [`property-groups/`](./property-order.md) files, in file order.
2. Explicitly disables `order/properties-alphabetical-order`, so an alphabetical-order rule picked up from elsewhere
   (`stylelint-config-standard` itself has no opinion on property order) cannot conflict with this outside-in order.

`fix.js` has no `extends: 'stylelint-config-valantic'` of its own. Used standalone it provides only property
ordering — none of the BEM, vendor-prefix or other rules from the base config. It is meant to be layered on top of a
project's own config.

## When to use it

Property ordering is genuinely useful to auto-fix but annoying as a blocking lint error while actively writing CSS.
Add `fix.js` when a project wants that ordering normalized automatically and silently — typically as part of a
`lint-staged` / git-hook step — rather than reported as an error. Projects that don't want declaration order
enforced day-to-day can just use the base config on its own.

## Layering it into a consumer's setup

The recommended pattern (see [the main README's `--fix` config section](../README.md#create---fix-config)) is a
separate fix-specific Stylelint config file that extends both `fix.js` and the project's normal config:

```js
// .stylelintrc.fix.js
module.exports = {
  extends: [
    'stylelint-config-valantic/fix',
    './.stylelintrc.js',
  ],
};
```

wired into `lint-staged`:

```json
{
  "lint-staged": {
    "*.{css,vue,scss}": [
      "stylelint --config .stylelintrc.fix.js --fix"
    ]
  }
}
```

**Caveat:** passing `--config` explicitly on the CLI disables Stylelint's automatic merging of nested configs (the
kind normally picked up from a `.stylelintrc.js` in a subfolder). Once a project adopts a fix-config workflow,
folder-specific rule exceptions should go through the base config's `overrides` array instead of nested
`.stylelintrc.js` files, since those would silently stop being picked up during `--fix` runs.
