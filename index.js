'use strict';

module.exports = {
  extends: 'stylelint-config-standard',
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
    'block-closing-brace-newline-after': [
      'always', {
        ignoreAtRules: ['if', 'else'],
      },
    ],
    'color-hex-length': 'long',
    'color-named': 'never',
    'declaration-no-important': true,
    'length-zero-no-unit': [
      true,
      {
        ignore: ["custom-properties"], // Allow 0px for variables and calc().
      },
    ],
    'max-nesting-depth': 4,
    'no-descending-specificity': null,
    'no-eol-whitespace': [
      true,
      {
        ignore: ['empty-lines'],
      },
    ],
    'no-irregular-whitespace': true,
    'selector-attribute-quotes': 'always',
    'selector-class-pattern': [
      /^((row)|(col-.*)|(spacing(-.*|$))|(align(--.*|$))|(container)|(container-fluid)|(focus)|((\.?[a-z][a-z]*-)([a-z][a-z]+(-([a-z]+|[0-9]+))*)(__[a-z][a-z]+(-([a-z0-9]+))*)?(--([a-z][a-z]+|h[1-6]|i)(-[a-z0-9]+)*)?(:{1,2}[a-z][a-z]+(-[a-z0-9]+)*(\(["a-z0-9]+\))?)?))+$/m,
      {
        resolveNestedSelectors: true,
      },
    ],
    'selector-list-comma-newline-after': 'always',
    'selector-max-id': 0,
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
      'custom-properties',
      'dollar-variables',
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
