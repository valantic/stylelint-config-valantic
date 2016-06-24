# SCSS

**Changes to the Frontend configs repro or project specific settings are only allowed in agreement with the frontend  or project team.**

To ensure a high an consistent code quality for SCSS we use scss-lint.

[https://github.com/brigade/scss-lint](https://github.com/brigade/scss-lint)

## Installing scss-lint

scss-lint is installed with Ruby and can be used by modern IDEs or Node.js to check your files.

**HINT: a new security feature since Mac OS X El Capitan may prevents the installation of ruby gems.**

In this case, use homebrew to install a second instance of Ruby (Don't uninstall system Ruby!).

```shell
# Check if homebrew is installed
$ brew --version

# Install homebrew if needed
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# Install ruby
$ brew update
$ brew install ruby
```

After restarting your console you should be able to install the scss-lint gem.

**HINT: While the linter itself is called scss-lint, the gem name is 'scss_lint' with an underscore!**

```shell
$ gem install scss_lint
```

## Disable specific linters with inline comments

In some rare cases it can be useful to disable a linter (e.g. if you need a special hack). You can do this by using a special comment which you should define inside a single block

```sass
p {
    // Every exception needs an explanation (DisableLinterReason)
    // scss-lint:disable BorderZero
    border: none; // No lint reported
}
```

## Settings

### Compass Linters (false)

Disabled. Enable if needed.

### BangFormat (true)

!Bang expressions always need a leading whitespace.

```sass
p {
    border: 0!important; // Error: no whitespace before !bang
}
```

### BemDepth (true)

No BEM grand childes.

```sass
.component__element__sub-element { // Error: no sub element level for BEM selectors 
    // ...
}  
```

### BorderZero (true)

Use ```border: 0;``` instead of ```border: none;```.

```sass
.component--no-border {
    border: none; // Error: use '0' instead of 'none'
}  
```

### ChainedClasses (false)

Disabled. We allow to combine classes. But use rarely.

### ColorKeyword (true)

Don't use keywords for colors.

```sass
.foo {
    color: black; // Error: use #000 instead
}  
```

### ColorVariable (true)

Use colors only as variables.

```sass
.foo {
    color: #000; // Error: color should be a variable (e.g. $color-primary)
}  
```

### Comment

Use silent comments to document your code. For the rare case of comments, that should show up in the output file (e.g. a copyright header), use ```/*! a loud comment **/```.

```sass
/** My comment **/  // Error: only use silent comments (//) or important comments (/*!)
.foo {
    // ...
}  
```

### DebugStatement (true)

Remove all ```@debug``` statements before checking code into repository.

### DeclarationOrder (true)

The order of declaration is ```@extend```, ```@include```, ```@content```.

```sass
.fatal-error {
    p {
        ...
    }

    color: #f00;              // Error: should appear after @includes, but before nested content
    @extend %error;           // Error: should appear at start of scope
    @include message-box();   // Error: should appear after @extends but before @content
}
```

### DisableLinterReason (false)

You always need to give a reason (comment on preceding line), when you disable a linter. 

```sass
p {
    // scss-lint:disable BorderZero       // Error: no reason given, why the linter is disabled
    border: none;
}
```

### DuplicateProperty (true)

Duplicated properties are not allowed.

```sass
h1 {
    color: #000;
    font-size: 1.5rem;
    color: #fff;          // Error: duplicated property
}
```

### ElsePlacement (true)

Place ```@else``` statements on the same line as the preceding curly brace.

```sass
@if {
    ...
}
@else { // Error: else should be on the same line as '}'
    ...
}
```

### EmptyLineBetweenBlocks (true, same_line)

Separate rule, function, and mixin declarations with empty lines.

```sass
p {
    margin: 0;
    em {          // Error: no empty line before new block
        ...
    }
}
a {             // Error: no empty line before new block
    ...
}
```

### EmptyRule (true)

No empty blocks.

```sass
h1 { // Error: empty rule
}
```

### ExtendDirective (false)

Disabled. The use of ```@extend``` is allowed, but only in combination with placeholder variables (e.g. %clearfix, see also ```PlaceholderInExtend```).

### FinalNewline (true)

Always add an empty new line at the end of each file.

### HexLength (true, short)

Use the short notation for HEX values.

```sass
h1 {
    color: #ff22ee; // Error: use shorthand #f2e
}
```

### HexNotation (true, lowercase)

User lowercase for HEX values.

```sass
$color-primary: #F2E; // Error: use lowercase #f2e
```

### HexValidation (true)

Checks for invalid Hex values.

```sass
$color-secondary: #ab; // Error: no valid hex value
```

### IdSelector (true)

Don't use id selectors.

```sass
#foo { // Error: don't use id selectors
    // ...
}
```

### ImportantRule (true)

Don't use ```!important```. If you really need to do so, give an explanation and disable the linter rule for the current block: ```// scss-lint:disable ImportantRule```

```sass
.foo { 
    color: $color-primary !important; // Error: don't use !important
}
```

### ImportPath (true)

The basenames of @imported SCSS partials should not begin with an underscore and should not include the filename extension.

```sass
@import "component/_style.scss"; // Error: don't write low dash (_) and suffix (.scss)
```

### Indentation (true, space, 2)

We use 2 spacings for indentation.

```sass
.foo { 
    color: $color-primary; // Error: use 2 spaces
}
```

### LeadingZero (false)

Disabled. Use a leading zero for numeric values with a decimal point.

```sass
.foo { 
    margin: .5em; // Error: write 0.5em instead
}
```

### MergeableSelector (true)

Don't define the same selector multiple times.

```sass
h1 {
    margin: 10px;
}

.baz {
    color: red;
}

h1 {
    text-transform: uppercase; // Error: merge with first h1
}
```

### NameFormat (true, hyphenated_lowercase)

Functions, mixins, variables, and placeholders should be declared with all lowercase letters and hyphens instead of underscores.

```sass
$myVar: 10px;       // Error: no camelcase. Should be $my-var

@mixin my_mixin() {  // Error: no snake_case. Should be my-mixin() 
  ...
}
```

### NestingDepth (true, 3)

Avoid nesting selectors too deeply (max. 3).

```sass
.componten {
    &__element {
        &--modifier {
            .something-else {   // Error: only 3 levels allowed
                // ...
            }
        }
    }
}
```

### PlaceholderInExtend (true)

Use ```@extend``` only with placeholder variables.

```sass
.foo {
    @extend .btn;   // Error: don't extend classes. Should be %btn.
}
```

### PrivateNamingConvention (true)

Private functions, mixins and variables are only to be used in the same document as they're defined in. The private naming convention is al leading underscore (e.g. $_color-primary)

```sass
.foo {
    color: $_color-red;   // Error: $_color-red was defined in an other file. Create global variable.
}
```

### PropertyCount (false)

Disabled. The number of properties within a block is ignored.

### PropertySortOrder (false)

Disabled. The order or properties inside a block is ignored.

### PropertySpelling (true)

Checks for misspelled properties.

### PropertyUnits (true)

Defines the allowed units for a certain property.

```font-size: rem, em```
```width: %, em, rem```

### PseudoElement (true)

Pseudo-elements, like ```::before```, and ```::first-letter```, should be declared with two colons. Pseudo-classes, like ```:hover``` and ```:first-child```, should be declared with one colon.

```sass
.foo:before { // Error: use two colons
    // ...
}
```

### QualifyingElement (true)

Avoid qualifying elements in selectors (also known as "tag-qualifying"). Exception: element with attribute selector.

```sass
li.foo { // Error: Don't qualify elements
    // ...
}
```

### SelectorDepth (true)

No selectors longer than 3 elements.

```sass
.foo .baa .foo-baa .to-much { // Error: only a depth of 3 selectors is allowed
    // ...
}
```

### SelectorFormat (true, hyphenated_BEM)

Use valid BEM selectors.

```sass
.component__element__element { // Error: not a valid BEM selector
    // ...
}
```

### Shorthand (true)

Use shorthand notation.

```sass
.foo {
    margin: 0 10px 0 10px; // Error: use shorthand notation
}
```

### SingleLinePerProperty (true, false)

Only one property per line.

```sass
.foo {
    margin: 10px; padding: 10px; // Error: only one property per line
}
```

### SingleLinePerSelector (true)

Only one selector per line.

```sass
.foo, .baa { // Error: only one selector per line
    // ...
}
```

### SpaceAfterComma (true)

Commas in lists should be followed by a space.

```sass
.foo {
    color: rgba(0,0,0,0.1);  // Error: space after comma is missing
}
```

### SpaceAfterPropertyColon (true, one_space)

Properties should be formatted with a single space separating the colon from the property's value.

```sass
.foo {
    margin:10px; // Error: space after property colon is missing
}
```

### SpaceAfterPropertyName (true)

No space between property name and the colon.

```sass
.foo {
    margin : 10px; // Error: no space before colon
}
```

### SpaceAfterVariableColon (true, one_space)

Variables should be formatted with a single space separating the colon from the variable's value.

```sass
$spacing-10:10px; // Error: space after property colon is missing
```


### SpaceAfterVariableName (true)

No space between value name and the colon.

```sass
$spacing-10 : 10px; // Error: no space before colon
```

### SpaceAroundOperator (true, one_space)

Operators need a single space on each side.

```sass
.foo {
    margin: 10px+20px; // Error: missing space before/after '+'
}
```

### SpaceBeforeBrace (true, space)

Opening braces should be preceded by a single space.

```sass
.foo{   // Error: missing space before brace
    // ...
}
```

### SpaceBetweenParens (true, 0)

Don't use additional spacing inside parens.

```sass
@include box-shadow( 0 2px 2px rgba( 0, 0, 0, 0.2 ) ); // Error: no space inside parens allowed
```

### StringQuotes (true, single_quotes)

Write strings with single quotes.

```sass
content: "hello"; // Error: use single quotes
```

### TrailingSemicolon (true)

Always use trailing semicolons.

```sass
content: 'hello' // Error: semicolon are mandatory
```

### TrailingWhitespace (false)

Disabled. Trailing whitespaces are allowed.

### TrailingZero (true)

Don't write trailing zeros for numeric values with a decimal point.

```sass
margin: 0.500em; // Error: no trialing zeros
```

### TransitionAll (false)

Disabled. ```transition: all ...``` can be used, but should be avoided.

### UnnecessaryMantissa (true)

Numeric values should not contain unnecessary fractional portions.

```sass
margin: 1.0em; // Error: no unnecessary mantissa
```

### UnnecessaryParentReference (true)

No unnecessary parent references.

```sass
.foo {
  & > .bar { // Error: reference to parent is not needed
    ...
  }
}
```

### UrlFormat (true)

Don't use absolute URLs. If you have to do so, give a reason (comment) and disable the linter for the current block: ```// scss-lint:disable UrlFormat``` 

```sass
background: url('https://example.com/assets/image.png'); // Error: no absolute paths are allowed
```

### UrlQuotes (true)

Use quotes for URLs.

```sass
background: url(/assets/image.png); // Error: quotes are mandatory
```

### VariableForProperty (true)

The following properties may only be used with variable values: ```color, font, font-family, box-shadow, border-radius```

```sass
font-family: Gotham, "Helvetica Neue", Helvetica, Arial, sans-serif; // Error: use variable for font
```

### VendorPrefix (true)

Don't use verndor prefixes. A pre- or post processor should be used. If you have to do so, give a reason (comment) and disable the linter for the current block: ```// scss-lint:disable VendorPrefix``` 

### ZeroUnit (true)

Use the value 0 always without unit.

```sass
margin: 0px; // Error: no unit allowed for value 0
```
