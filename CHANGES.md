### 8.0.1
- (Bugfix) Fixes typo for repository in package.json.

### 8.0.0
- (Breaking) Requires stylelint version 15. (Check Migration guide if you need to update stylelint: https://github.com/stylelint/stylelint/blob/main/docs/migration-guide/to-15.md)

### 7.1.5
- (Change) Switches 'dollar-variables' and 'custom-properties' on 'order/order' to allow usage of scss variables in custom properties.

### 7.1.4
- (Change) Extends documentation with information on how to handle folder specific configurations.

### 7.1.3
- (Change) Moves `background` properties after 'specific', `border` and `fill` properties.

### 7.1.2
- (Change) Moves `color` to `typography` section for property order.

### 7.1.1
- (Change) Weakens class regex to allow `.typo--` classes.

### 7.1.0
- (Feature) Adds support for --fix and unified property order.

### 7.0.0
- (Change) Loosening 'max-line-length' to allow a length of 130 characters.
- (Change) Loosening 'declaration-block-no-redundant-longhand-properties' to allow grid-template with redundant longhand properties.
- (Breaking) Requires stylelint-scss installed separately.

### 6.5.1

- (Bugfix) Uses stylelint-config-standard instead of stylelint-config-standard-scss to better match our conventions.

### 6.5.0
- (Update) Updates dependencies.

### 6.4.0
- (Feature) Adds new linting rules from stylelint 13.13.0.

### 6.3.0
 - (Feature) Adds support for @property at rule.

### 6.2.1
 - (Feature) Enables support for custom element selectors.
 - (Change) Disables no-descending-specificity rule.
