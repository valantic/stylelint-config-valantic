'use strict';

module.exports = {
  extends: [
    'stylelint-config-standard',
    // Needed to be able to parse vue files, see https://github.com/ota-meshi/stylelint-config-html#book-usage
    'stylelint-config-html/vue'
  ],
  overrides: [
    {
      // Needed to be able to parse scss files, as we don't want to use the stylelint-config-standard-scss
      // see https://stylelint.io/migration-guide/to-14/
      files: '**/*.scss',
      customSyntax: "postcss-scss",
    },
  ],
  plugins: [
    'stylelint-scss',
    'stylelint-order',
  ],
  rules: {
    'at-rule-empty-line-before': [
      'always',
      {
        ignoreAtRules: 'else',
        except: ['blockless-after-blockless', 'first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'at-rule-no-unknown': null, // Handled by stylelint-scss at-rule-no-unknown,
    'color-hex-length': 'long',
    'color-named': 'never',
    'declaration-block-no-redundant-longhand-properties': [
      true,
      {
        ignoreShorthands: ['grid-template']
      }
    ],
    'declaration-no-important': true,
    'function-no-unknown': null, // Accept SCSS functions.
    'length-zero-no-unit': [
      true,
      {
        ignore: ["custom-properties"], // Allow 0px for variables and calc().
      },
    ],
    'max-nesting-depth': 4,
    'no-descending-specificity': null,
    'no-irregular-whitespace': true,
    'selector-attribute-quotes': 'always',
    'selector-class-pattern': [
      /^((row)|(col-.*)|(spacing(-.*|$))|(typo--.*)|(align(--.*|$))|(container)|(container-fluid)|(focus)|((\.?[a-z][a-z]*-)([a-z][a-z]+(-([a-z]+|[0-9]+))*)(__[a-z][a-z]+(-([a-z0-9]+))*)?(--([a-z][a-z]+|h[1-6]|i)(-[a-z0-9]+)*)?(:{1,2}[a-z][a-z]+(-[a-z0-9]+)*(\(["a-z0-9]+\))?)?))+$/m,
      {
        resolveNestedSelectors: true,
      },
    ],
    'selector-max-id': 0,
    'selector-not-notation': null, // IE11 does not support selector list in :not().
    'selector-type-no-unknown': [
      true,
      {
        ignore: ["custom-elements"],
      },
    ],
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['property']
      }
    ],
    'scss/double-slash-comment-whitespace-inside': 'always',
    'order/order': [
      'dollar-variables',
      'custom-properties',
      {
        type: 'at-rule',
        name: 'extend',
      },
      {
        type: 'at-rule',
        name: 'include',
        hasBlock: false,
      },
      'declarations',
      {
        type: 'at-rule',
        name: 'media',
        hasBlock: true,
      },
      {
        type: 'at-rule',
        name: 'include',
        hasBlock: true,
      },
      'rules',
    ],
    'value-keyword-case': null,

    'color-function-notation': 'legacy',
    'value-no-vendor-prefix': [
      true,
      {
        ignoreValues: ['box']
      }
    ],
    'property-no-vendor-prefix': [
      true,
      {
        ignoreProperties: ['appearance', 'text-decoration-skip']
      }
    ],
    'selector-no-vendor-prefix': [
      true,
      {
        ignoreSelectors: ['::-webkit-input-placeholder', ':-moz-placeholder', 'box']
      }
    ],
    'custom-property-pattern': null,
  },
};

/**
 * BEM pattern
 *
 * fixedValue = .row | .col-.* | .spacing$ | .spacing-.* | .align$ | .align--.*
 * bemName = Namespace Block (Element)? (MODIFIER)? (Pseudo)? | Fixed-Value
 * Pattern = fixedValue | bemName
 * Namespace = .[cel]-
 * Block = [a-z]char+(-charOrNum+)*
 * Element = __Block (BEM Name)?
 * Modifier = --Block
 * Pseudo = :Block(\([":a-z0-9]+\))?
 * char = [a-z0-9]
 * charOrNum = ([a-z]+|[0-9]+)
 *
 * ^((row)|(col.*)|((\.?[cel]-)([a-z][a-z]+(-([a-z]+|[0-9]+))*)(__[a-z][a-z]+(-([a-z]+|[0-9]+))*)?(--[a-z][a-z]+(-([a-z]+|[0-9]+))*)?(:{1,2}[a-z][a-z]+(-[a-z0-9]+)*(\(["a-z0-9]+\))?)?))+$
 *
 *
 * valid
 c-block
 c-block:hover
 c-block-foo
 c-block-foo:first-child
 c-block--foo
 c-block--foo:focus
 c-block__element
 c-block__element:nth-child(5)
 c-block__element--modifier
 c-block__element--modifier-foo
 c-block__element--modifier-foo-baa
 c-block.c-block
 c-block__element.c-block
 c-block__element.c-block__element
 c-block__element--modifier.c-block
 c-block__element--modifier.c-block__element
 c-block__element--modifier.c-block__element--modifier
 c-block-name-foo-baa
 c-block__element-name-foo
 c-block-name-foo-baa__element-name-foo
 c-main-content__content.c-main-content__content--main-navigation-open
 c-advertisement-1
 c-advertisement__element-1
 c-advertisement__element--modifier-1
 c-advertisement-1__element
 c-advertisement__element-1--modifier
 c-advertisement-1__element-1--modifier-1
 c-advertisement-1121__element-111--modifier-689
 cc-foo
 row
 col-6
 align--left
 align
 c-heading--h1
 c-heading--h6
 c-icon--i-icon

 * invalid
 alignment
 foo
 c-block---foo
 c-block--element--foo
 c-block__element__element
 c-block__element__element.c-block
 c-block__element.c-block__element__element
 c-block__element--modifier--modifier.c-block
 c-block__element--modifier.c-block__element--modifier--modifier
 c-advertisement1
 c-advertisement__element1
 c-advertisement__element--modifier1
 c-heading--h9

 *
 **/
