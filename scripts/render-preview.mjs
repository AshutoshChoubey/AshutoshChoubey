import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const previews = path.join(root, 'previews');
const readme = await readFile(path.join(root, 'README.md'), 'utf8');
const inline = value => value
  .replace(/\[([^\]]+)\]\(((?:https:|mailto:|\.\/)[^\s)]+)\)/g, '<a href="$2">$1</a>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

const content = readme.trim().split(/\n\s*\n/).map(block => {
  if (block.startsWith('<')) return block;
  const heading = block.match(/^(#{1,3}) (.+)$/);
  if (heading) {
    const tag = `h${heading[1].length}`;
    return `<${tag}>${inline(heading[2])}</${tag}>`;
  }
  if (block.startsWith('- ')) {
    const items = block.split('\n').map(item => `<li>${inline(item.slice(2))}</li>`);
    return `<ul>${items.join('')}</ul>`;
  }
  return `<p>${inline(block)}</p>`;
}).join('\n');

const styles = `
* { box-sizing: border-box; }
body { margin: 0; background: var(--page); color: var(--fg); font: 16px/1.6 system-ui, sans-serif; }
body.light { --page: #fff; --fg: #1f2328; --muted: #59636e; --edge: #d1d9e0; --link: #0969da; }
body.dark { --page: #0d1117; --fg: #f0f6fc; --muted: #9198a1; --edge: #3d444d; --link: #4493f8; }
header { max-width: 896px; margin: auto; padding: 20px 24px 14px; display: flex; justify-content: space-between; color: var(--muted); }
main { max-width: 896px; margin: 0 auto 32px; padding: 24px; border: 1px solid var(--edge); border-radius: 8px; }
h1, h2 { line-height: 1.3; border-bottom: 1px solid var(--edge); padding-bottom: 8px; }
h1 { font-size: 27px; } h2 { font-size: 23px; }
img { display: block; max-width: 100%; width: 100%; height: auto; }
p[align="center"] img { display: inline-block; width: auto; }
p, li { overflow-wrap: anywhere; }
a { color: var(--link); text-decoration: none; }
a:hover { text-decoration: underline; }
a:focus-visible { outline: 2px solid var(--link); outline-offset: 3px; }
@media (min-width: 768px) { main { width: calc(75vw - 128px); } }
@media (max-width: 767px) { main { margin: 0 16px 32px; } }
`;

await mkdir(previews, { recursive: true });
for (const theme of ['dark', 'light']) {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>GitHub profile preview</title><style>${styles}</style></head>
<body class="${theme}"><header><span>Profile preview</span><span><a href="dark.html">Dark</a> · <a href="light.html">Light</a></span></header>
<main>${content}</main></body></html>`;
  await writeFile(path.join(previews, `${theme}.html`), html.replace(/(\b(?:src|srcset|href)=")\.\//g, '$1../'));
}

const variants = ['terminal-card', 'github-activity', 'github-languages'].flatMap(name => [name, `${name}-mobile`]);
const embedded = await Promise.all(variants.map(async name => {
  const svg = (await readFile(path.join(root, 'assets', `${name}.svg`), 'utf8'))
    .replace(/<\?xml[^>]*\?>/, '')
    .replace(/id="([^"]+)"/g, `id="${name}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${name}-$1)`)
    .replace('aria-labelledby="title desc"', `aria-labelledby="${name}-title ${name}-desc"`);
  return `<section data-asset="${name}">${svg}</section>`;
}));
await writeFile(path.join(previews, 'inspect.html'), `<!doctype html><meta charset="utf-8"><title>SVG geometry</title>${embedded.join('')}`);
console.log('Wrote previews/dark.html, light.html, and inspect.html.');
