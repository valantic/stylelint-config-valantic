/**
 * Releases a new version: node scripts/release.mjs [patch|minor|major]
 * Without an argument the release type is asked interactively.
 *
 * Shared by all valantic shared-frontend repos (keep the copies identical). Runs every step explicitly instead of
 * relying on npm lifecycle hooks, because `.npmrc` sets `ignore-scripts=true`, which makes `npm version` skip them.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const RELEASE_TYPES = ['patch', 'minor', 'major'];
const RELEASE_BRANCHES = ['main'];
const UNRELEASED_HEADING = /^## unreleased$/m;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const changelogPath = path.resolve(root, 'CHANGELOG.md');
const readmePath = path.resolve(root, 'README.md');
const packagePath = path.resolve(root, 'package.json');

/**
 * Runs a command in the repository root without a shell and returns its trimmed output.
 *
 * @param {string} command - The executable to run.
 * @param {string[]} args - The arguments passed to the executable.
 *
 * @returns {string}
 */
function run(command, args) {
  return execFileSync(command, args, { cwd: root, encoding: 'utf8' }).trim();
}

/**
 * Stops the release with an error message, before anything was changed.
 *
 * @param {string} message - The reason for stopping.
 */
function abort(message) {
  throw new Error(`Release aborted: ${message}`);
}

/**
 * Returns the entries of the unreleased section in the given changelog.
 *
 * @param {string} changelog - The content of CHANGELOG.md.
 *
 * @returns {string}
 */
function getUnreleasedEntries(changelog) {
  const match = UNRELEASED_HEADING.exec(changelog);

  if (!match) {
    return '';
  }

  const sectionStart = match.index + match[0].length;
  const nextSection = changelog.slice(sectionStart).search(/^## /m);

  return changelog.slice(sectionStart, nextSection === -1 ? undefined : sectionStart + nextSection).trim();
}

/**
 * Returns the version that results from a release of the given type.
 *
 * @param {string} version - The current version (`major.minor.patch`).
 * @param {string} type - One of RELEASE_TYPES.
 *
 * @returns {string}
 */
function getNextVersion(version, type) {
  const [major, minor, patch] = version.split('.').map(Number);

  if (type === 'major') {
    return `${major + 1}.0.0`;
  }

  return type === 'minor' ? `${major}.${minor + 1}.0` : `${major}.${minor}.${patch + 1}`;
}

/**
 * Asks which release type to make. There is deliberately no default, so a release is never made by accident.
 *
 * @returns {Promise<string>}
 */
async function askReleaseType() {
  if (!process.stdin.isTTY) {
    abort(`no release type given. Pass one of ${RELEASE_TYPES.join(', ')} as argument.`);
  }

  const { version } = JSON.parse(readFileSync(packagePath, 'utf8'));
  const readline = createInterface({ input: process.stdin, output: process.stdout });

  process.stdout.write(`Current version: ${version}\n`);
  RELEASE_TYPES.forEach((type, index) => {
    process.stdout.write(`  ${index + 1}) ${type.padEnd(5)} -> ${getNextVersion(version, type)}\n`);
  });

  const answer = await readline.question('Which release? [1-3 or name] ');

  readline.close();

  const normalizedAnswer = answer.trim().toLowerCase();

  return (
    RELEASE_TYPES.find((type, index) => normalizedAnswer === type || normalizedAnswer === String(index + 1)) ??
    abort(`unknown release type "${answer}".`)
  );
}

const releaseType = process.argv[2] ?? (await askReleaseType());

if (!RELEASE_TYPES.includes(releaseType)) {
  abort(`expected one of ${RELEASE_TYPES.join(', ')} as argument, got "${releaseType}".`);
}

// 1. Checks - nothing has been changed until all of them pass.
const branch = run('git', ['branch', '--show-current']);

if (!RELEASE_BRANCHES.includes(branch)) {
  abort(`releases are only made from ${RELEASE_BRANCHES.join(' or ')}, current branch is "${branch}".`);
}

if (run('git', ['status', '--porcelain'])) {
  abort('the working tree has uncommitted changes.');
}

run('git', ['fetch', 'origin', branch]);

if (run('git', ['rev-list', '--count', `HEAD..origin/${branch}`]) !== '0') {
  abort(`"${branch}" is behind "origin/${branch}". Update it first.`);
}

const changelog = readFileSync(changelogPath, 'utf8');

if (!getUnreleasedEntries(changelog)) {
  abort('CHANGELOG.md has no entries under "## unreleased".');
}

// 2. Version bump (package.json + package-lock.json). Git steps are done below.
const version = run('npm', ['version', releaseType, '--no-git-tag-version']).replace(/^v/, '');
const tag = `v${version}`;

// 3. Release files.
writeFileSync(changelogPath, changelog.replace(UNRELEASED_HEADING, `## unreleased\n\n## ${tag}`));

const filesToCommit = ['package.json', 'package-lock.json', 'CHANGELOG.md'];

if (existsSync(readmePath)) {
  const readme = readFileSync(readmePath, 'utf8');
  const updatedReadme = readme.replaceAll(/(github:valantic\/[\w.-]+#)v?\d+\.\d+\.\d+/g, `$1${tag}`);

  if (updatedReadme !== readme) {
    writeFileSync(readmePath, updatedReadme);
    filesToCommit.push('README.md');
  }
}

// 4. Commit, annotated tag (required for --follow-tags) and push.
run('git', ['add', ...filesToCommit]);
run('git', ['commit', '-m', `Release ${tag}`]);
run('git', ['tag', '-a', tag, '-m', `Release ${tag}`]);
run('git', ['push', '--follow-tags', 'origin', branch]);

process.stdout.write(`Released ${tag}. The GitHub release is created by the "Release" workflow.\n`);
