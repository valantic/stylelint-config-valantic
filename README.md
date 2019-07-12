# valantic stylelint configuration

To ensure a high an consistent code quality for SCSS/CSS we use stylelint.

[https://stylelint.io/](https://stylelint.io/)

## Version

Our config is currently optimized for Stylelint 10.1.0 To check for updates, see [https://github.com/stylelint/stylelint/releases](https://github.com/stylelint/stylelint/releases)

**Note that Stylelint is not backwards compatible and linting will fail if the configuration contains settings, which are not known to the current version!**

## Installing stylelint-config-valantic package

```shell
npm install stylelint-config-valantic stylelint --save-dev
```

### Create config

In the root of your project add a .stylelintrc file and add the following content to enable the valantic config for your project.

```
{
  "extends": "stylelint-config-valantic",
  "rules": {
    // Project related rules
  }
}

```

## Use

Now your ready to enable Stylelint in your editor or use it on the command line!

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
