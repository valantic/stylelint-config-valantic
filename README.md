# SCSS

> **Changes to the Frontend configs repo or project specific settings are only allowed in agreement with the frontend  or project team.**

To ensure a high an consistent code quality for SCSS/CSS we use stylelint.

[https://stylelint.io/](https://stylelint.io/)

## Version

Our config is currently optimized for Stylelint 8.1.1 To check for updates, see [https://github.com/stylelint/stylelint/releases](https://github.com/stylelint/stylelint/releases)

**Note that Stylelint is not backwards compatible and linting will fail if the configuration contains settings, which are not known to the current version!**

## Installing stylelint-movento package

```shell
$ npm install --save-dev git+https://git.movento.com/movento-public/stylelint-config-movento.git#2.0.1
```

### Create config

In the root of your project add a .stylelintrc file and add the following content to enable the movento config for your project.

```
{
  "extends": "stylelint-config-movento"
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
$ npm run stylelint <app|file.js>
```

### Ember.js

**NOTE: currently ember-cli-stylelint uses Stylelint 7.x.x. Unfortunately Stylelint is not backwards compatible and will throw errors on linting configurations, which are unknown to the version (which is the case for the movento config 2.0.1 and Stylelint < 8.0.0)**

```
$ ember install ember-cli-stylelint
```

**In case you get errors like "Undefined rule ..." you may have a version conflict between Stylelint and this configuration. Make sure you're using the above mentioned Stylelint version.**

For more information visit the ember-cli-stylelint repository: https://github.com/billybonks/ember-cli-stylelint
