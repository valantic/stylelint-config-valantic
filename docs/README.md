# stylelint-config-valantic docs

`stylelint-config-valantic` is a shared [Stylelint](https://stylelint.io/) configuration for CSS/SCSS (and the
`<style>` blocks inside `.vue` files). It is not an application or a component library — it is a set of `.js` files
that export Stylelint config objects, published to the npm registry so every consuming project lints the same way
instead of hand-rolling its own rules.

Unlike a `github:`-installed package, this one is a normal npm dependency with no build step: whatever is committed
to `index.js`, `fix.js` and `property-groups/` is exactly what consumers get after a release. See the [Quickstart in
the main README](../README.md#quickstart) for installation and setup steps.

**Version coupling:** the config is built against a specific Stylelint major version (see `peerDependencies` in
[`package.json`](../package.json)). Stylelint is not backwards compatible across majors, so a mismatch between a
consumer's installed Stylelint and this config's target version causes "Undefined rule" errors — see the [Know
issues section in the main README](../README.md#know-issues).

This repo publishes two separate configs, plus the raw data one of them is built from:

- [Base config (`index.js`)](./base-config.md) — the main, always-on rule set: BEM class naming, SCSS/Vue parsing,
  vendor-prefix restrictions, and the coarse `order/order` structural ordering.
- [Fix config (`fix.js`)](./fix-config.md) — an optional, additional config for auto-fixing fine-grained CSS
  property order (e.g. `color` before `margin-top`). Meant to be layered on top of a project's own config, typically
  in a `--fix` / pre-commit step, not used standalone.
- [Property order groups (`property-groups/`)](./property-order.md) — the seven ordered arrays of property names
  that `fix.js` concatenates into its `order/properties-order` rule.
