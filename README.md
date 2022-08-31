# valantic stylelint configuration

To ensure a high an consistent code quality for SCSS/CSS we use stylelint.

[https://stylelint.io/](https://stylelint.io/)

## Version

Our config is currently optimized for Stylelint 13.0.0 To check for updates, see [https://github.com/stylelint/stylelint/releases](https://github.com/stylelint/stylelint/releases)

**Note that Stylelint is not backwards compatible and linting will fail if the configuration contains settings, which are not known to the current version!**

## Installing stylelint-config-valantic package

```shell
npm install stylelint-config-valantic stylelint --save-dev
```

### Create config

In the root of your project add a `.stylelintrc.js` file and add the following content to enable the valantic config for your project.

```js
module.exports = {
  "extends": "stylelint-config-valantic",
  "rules": {
    // Project related rules
  }
}

```

### Create --fix config

It is recommended to have a separate `--fix` config, that uses some additional rules (e.g. for property order) to hide non-blocking issues from the user but auto apply them on git hooks.

1. Create an additional `.stylelint.fix.js` file

```js
module.exports = {
  extends: [
    'stylelint-config-valantic/fix',
    './.stylelintrc.js'
  ],
};
```

2. Add a `package.json` script, if you want to test manually.

```json
{
  "stylelint": "stylelint --cache 'src/**/*.?(vue|scss)'",
  "stylelint:fix": "npm run stylelint -- --cache=false --config .stylelintrc.fix.js --fix"
}
```

3. Assign the `--fix` config for `lint-staged`.

```json
{
  "lint-staged": {
    "*.{css,vue,scss}": [
      "stylelint --config .stylelintrc.fix.js --fix"
    ]
  }
}
```

## Use

Now you're ready to enable Stylelint in your editor or use it on the command line!

### PhpStorm

Go to `PhpStorm > Preferences` and search for Stylelint or navigate to `Languages & Frameworks > Stylesheets > Stylelint` and enable it.

### Console

You can also lint your code from the console. To do this, add a script to your `package.json`.

```
"scripts": {
  "stylelint": "stylelint 'app/**/*.scss' --config .stylelintrc; exit 0"
}
```

Now you can execute the linter with the following command.

```
$ npm run stylelint
```

## Know issues

### Undefined rule

In case you get errors like "Undefined rule ..." you may have a version conflict between Stylelint and this configuration. Make sure you're using the above mentioned Stylelint version.
