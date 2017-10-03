# SCSS

> **Changes to the Frontend configs repo or project specific settings are only allowed in agreement with the frontend  or project team.**

To ensure a high an consistent code quality for SCSS/CSS we use stylelint.

[https://stylelint.io/](https://stylelint.io/)

## Installing stylelint-movento package

```shell
$ npm install --save-dev git+https://git.movento.com/movento-public/stylelint-config-movento.git#1.0.0
```

## Use

Now your ready to enable Stylelint in your editor or use it on the command line!

### PhpStorm

Go to `PhpStorm > Preferences` and search for Stylelint or navigate to `Languages & Frameworks > Stylesheets > Stylelint` and enable it.

### Console

You can also lint your code from the console. To do this, add a script to your `package.json`.

```
"scripts": {
  "stylelint": "stylelint --config .stylelintrc"
}
```

Now you can execute the linter with the following command.

```
$ npm run stylelint <app|file.js>
```

### Ember.js

```
$ ember install ember-cli-stylelint
```

For more information visit the ember-cli-stylelint repository: https://github.com/billybonks/ember-cli-stylelint
