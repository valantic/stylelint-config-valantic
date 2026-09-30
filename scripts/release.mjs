/**
 * Releases a new version: node scripts/release.mjs <patch|minor|major>
 *
 * Shared by all valantic shared-frontend repos (keep the copies identical). Runs every step explicitly instead of
 * relying on npm lifecycle hooks, because `.npmrc` sets `ignore-scripts=true`, which makes `npm version` skip them.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RELEASE_TYPES = ['patch', 'minor', 'major'];
const RELEASE_BRANCHES = ['main'];
const UNRELEASED_HEADING = /^## unreleased$/m;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const changelogPath = path.resolve(root, 'CHANGELOG.md');
const readmePath = path.resolve(root, 'README.md');

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

const releaseType = process.argv[2];

if (!RELEASE_TYPES.includes(releaseType)) {
  abort(`expected one of ${RELEASE_TYPES.join(', ')} as argument, got "${releaseType ?? ''}".`);
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
