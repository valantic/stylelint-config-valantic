#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const stylelint = require('stylelint');

const ROOT = path.join(__dirname, '..');
const SNAPSHOT_PATH = path.join(__dirname, 'snapshot.json');
const shouldUpdate = process.argv.includes('--update');

async function getActual() {
  const { results } = await stylelint.lint({
    files: 'tests/*.{css,scss}',
    customSyntax: 'postcss-scss',
    configFile: path.join(ROOT, 'index.js'),
  });

  return results
    .map((result) => ({
      source: path.relative(ROOT, result.source),
      warnings: result.warnings
        .map(({ line, column, rule, severity, text }) => ({ line, column, rule, severity, text }))
        .sort((a, b) => a.line - b.line || a.column - b.column || a.rule.localeCompare(b.rule)),
    }))
    .sort((a, b) => a.source.localeCompare(b.source));
}

async function run() {
  const actual = await getActual();

  if (shouldUpdate) {
    fs.writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(actual, null, 2)}\n`);
    console.log(`Updated ${path.relative(ROOT, SNAPSHOT_PATH)}`);
    return;
  }

  if (!fs.existsSync(SNAPSHOT_PATH)) {
    console.error('tests/snapshot.json missing. Run "npm run test:update" to create it.');
    process.exitCode = 1;
    return;
  }

  const expected = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
  const actualJson = JSON.stringify(actual, null, 2);
  const expectedJson = JSON.stringify(expected, null, 2);

  if (actualJson === expectedJson) {
    const warningCount = actual.reduce((sum, file) => sum + file.warnings.length, 0);

    console.log(`Stylelint findings match tests/snapshot.json (${warningCount} warnings across ${actual.length} files).`);
    return;
  }

  console.error('Stylelint findings differ from tests/snapshot.json.');
  console.error('If this change is expected (e.g. a rule was added/changed on purpose), run "npm run test:update" and review the diff.');
  console.error('\n--- expected ---');
  console.error(expectedJson);
  console.error('\n--- actual ---');
  console.error(actualJson);
  process.exitCode = 1;
}

run();
