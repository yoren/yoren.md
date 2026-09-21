import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const project = import.meta.dirname;
async function buildFixture(t, markdown) {
  const directory = await mkdtemp(join(tmpdir(), 'yoren-build-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await cp(join(project, 'src'), join(directory, 'src'), { recursive: true });
  await writeFile(join(directory, 'README.md'), markdown);
  await writeFile(join(directory, 'PRIVATE-NOTES.md'), 'not public');
  await mkdir(join(directory, 'dist'));
  await writeFile(join(directory, 'dist', 'stale-private-file.txt'), 'not public');
  execFileSync(process.execPath, [join(project, 'build.mjs')], { cwd: directory });
  return { directory, html: await readFile(join(directory, 'dist/index.html'), 'utf8') };
}

test('publishes only the document and allowed assets, with all current rule anchors', async (t) => {
  const markdown = await readFile(join(project, 'README.md'), 'utf8');
  const { directory, html } = await buildFixture(t, markdown);
  assert.equal(await readFile(join(directory, 'dist/yoren.md'), 'utf8'), markdown);
  assert.deepEqual((await readdir(join(directory, 'dist'))).sort(), [
    'favicon.svg', 'fonts', 'index.html', 'navigation.js', 'style.css', 'yoren.md',
  ]);
  assert.deepEqual((await readdir(join(directory, 'dist/fonts'))).sort(), [
    'LICENSE.txt', 'source-serif-4-latin-wght-normal.woff2',
  ]);
  const ids = [...html.matchAll(/<h[23] id="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(ids, [
    'working-with-a-team', 'make-done-checkable', 'be-thorough-within-a-boundary',
    'ask-before-taking-a-detour', 'make-uncertainty-visible',
    'revisit-the-plan-when-the-work-changes', 'keep-people-in-the-loop',
    'engineering-and-tooling', 'keep-responsibilities-and-dependencies-clear',
    'make-important-rules-executable', 'test-behavior-where-it-can-be-proved',
    'let-difficult-tests-question-the-design', 'verify-what-i-actually-ship',
    'leave-useful-instructions-for-the-next-change', 'choose-tools-for-the-checks-they-enable',
    'maintaining-these-instructions',
  ]);
  const navs = [...html.matchAll(/<nav aria-label="Rules">([\s\S]*?)<\/nav>/g)];
  assert.equal(navs.length, 2);
  for (const [, nav] of navs) {
    assert.deepEqual([...nav.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]), ids);
  }
  assert.ok(html.includes('<h1 id="yorenmd">yoren<span class="file-extension">.md</span></h1>'));
  assert.ok(html.includes('<span class="intro-purpose">Instructions for myself.</span> <span class="intro-note">Written from experience, revised with practice.</span>'));
  assert.ok(html.includes('These instructions should help me act, not become another standard to punish myself with.'));
});

test('derives metadata and navigation from changed Markdown, preserving punctuation and unique fragments', async (t) => {
  const markdown = '# Other title\n\nA "quoted" description & more.\n\n## Fish & chips\n\n### Use **care**\n\nFirst. Another sentence.\n\n### Use **care**\n\nSecond.\n\n## Next\n\nLast.\n';
  const { html } = await buildFixture(t, markdown);
  assert.ok(html.includes('<title>Other title</title>'));
  assert.ok(html.includes('content="A &quot;quoted&quot; description &amp; more."'));
  assert.ok(html.includes('<p>First. Another sentence.</p>'));
  assert.ok(!html.includes('class="intro-purpose"'));
  assert.ok(html.includes('<a href="#fish--chips">Fish &amp; chips</a><ul>'));
  assert.ok(html.includes('<a href="#use-care">Use care</a>'));
  assert.ok(html.includes('<a href="#use-care-1">Use care</a>'));
  assert.ok(html.includes('<h3 id="use-care-1">Use <strong>care</strong>'));
  assert.ok(!html.includes('{{DOCUMENT}}'));
  assert.ok(!html.includes('Instructions for myself'));
});
