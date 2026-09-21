import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { marked } from 'marked';
import { gfmHeadingId, getHeadingList } from 'marked-gfm-heading-id';

// README.md is trusted, reviewed repository content, not user-submitted HTML.
const markdown = await readFile('README.md', 'utf8');
const template = await readFile('src/template.html', 'utf8');
marked.use(gfmHeadingId());
let document = marked.parse(markdown);
const headings = getHeadingList();
const plain = (html) => html.replace(/<[^>]*>/g, '');
const title = headings.find(({ level }) => level === 1);
if (!title) throw new Error('README.md must contain a document title (h1).');

const root = { level: 0, children: [] };
const stack = [root];
for (const heading of headings.filter(({ level }) => level > 1)) {
  while (stack.at(-1).level >= heading.level) stack.pop();
  const node = { ...heading, children: [] };
  stack.at(-1).children.push(node);
  stack.push(node);
}
function contents(nodes) {
  return `<ul>${nodes.map(({ id, text, children }) =>
    `<li><a href="#${id}">${plain(text)}</a>${children.length ? contents(children) : ''}</li>`
  ).join('')}</ul>`;
}

document = document.replace(/<h([2-6]) id="([^"]+)">([\s\S]*?)<\/h\1>/g, (_, level, id, text) =>
  `<h${level} id="${id}">${text}<a class="permalink" href="#${id}" aria-label="Link to this section"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="m10 13 4-4m-6 7-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 1 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></a></h${level}>`
);
const description = plain(document.match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? '').replaceAll('"', '&quot;');
// Presentation only: keep the Markdown and metadata unchanged.
document = document.replace(/(<h1\b[^>]*>[^<]+)(\.md)(<\/h1>)/, '$1<span class="file-extension">$2</span>$3');
document = document.replace(/<p>[\s\S]*?<\/p>/, (paragraph) =>
  paragraph.replace(/^<p>([^<]+?\.) ([^<]+)<\/p>$/, '<p class="introduction"><span class="intro-purpose">$1</span> <span class="intro-note">$2</span></p>')
);
const replacements = {
  TITLE: plain(title.text),
  DESCRIPTION: description,
  CONTENTS: contents(root.children),
  DOCUMENT: document,
};
const html = template.replace(/\{\{(TITLE|DESCRIPTION|CONTENTS|DOCUMENT)\}\}/g, (_, key) => replacements[key]);

// Publish an explicit allowlist. Never copy the repository or working artifacts.
await rm('dist', { recursive: true, force: true });
await mkdir('dist/fonts', { recursive: true });
await writeFile('dist/index.html', html);
await writeFile('dist/yoren.md', markdown);
for (const file of ['style.css', 'navigation.js', 'favicon.svg']) {
  await copyFile(`src/${file}`, `dist/${file}`);
}
const font = new URL('./node_modules/@fontsource-variable/source-serif-4/', import.meta.url);
await copyFile(new URL('files/source-serif-4-latin-wght-normal.woff2', font), 'dist/fonts/source-serif-4-latin-wght-normal.woff2');
await copyFile(new URL('LICENSE', font), 'dist/fonts/LICENSE.txt');
console.log(`Built dist/: ${headings.length - 1} section links; Markdown preserved byte-for-byte.`);
