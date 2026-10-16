import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const md=await readFile(path.join(root,'README.md'),'utf8');
const inline=s=>s.replace(/\[\*\*([^\]]+)\*\*\]\((https:[^\s)]+)\)/g,'<a href="$2"><strong>$1</strong></a>').replace(/\[([^\]]+)\]\((https:[^\s)]+)\)/g,'<a href="$2">$1</a>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
const blocks=md.split(/\n\s*\n/).map(s=>{
  if(s.startsWith('<!--')||s.startsWith('<picture>')||s.startsWith('<p align='))return s;
  if(s.startsWith('### '))return `<h3>${inline(s.slice(4))}</h3>`;
  if(s.startsWith('# '))return `<h1>${inline(s.slice(2))}</h1>`;
  if(s.startsWith('- '))return `<ul>${s.split('\n').map(i=>`<li>${inline(i.slice(2))}</li>`).join('')}</ul>`;
  return `<p>${inline(s)}</p>`;
}).join('\n');
const css=`*{box-sizing:border-box}body{margin:0;background:var(--page);color:var(--fg);font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}body.light{--page:#fff;--surface:#fff;--fg:#1f2328;--muted:#59636e;--edge:#d1d9e0;--link:#0969da}body.dark{--page:#0d1117;--surface:#0d1117;--fg:#f0f6fc;--muted:#9198a1;--edge:#3d444d;--link:#4493f8}header{max-width:1026px;margin:auto;padding:20px 32px 14px;display:flex;justify-content:space-between;font:11px/1.5 ui-monospace,monospace;letter-spacing:1px;color:var(--muted)}header a{font:12px/1.5 Arial,sans-serif;letter-spacing:0}main{max-width:1026px;margin:0 auto 32px;border:1px solid var(--edge);border-radius:8px;padding:32px;background:var(--surface)}picture{display:block;margin:24px 0 20px}picture:first-of-type{margin-top:0}img{display:block;max-width:100%;width:100%;height:auto;border:0}p[align="center"]{margin:26px 0 10px}p[align="center"] a{display:inline-block;vertical-align:middle}p[align="center"] img{display:inline-block;max-width:100%;height:auto;object-fit:contain}p[align="center"] img[src*="worldgyan-logo"]{width:64px;height:64px}p[align="center"] img[src*="worldgyan-wordmark"]{width:200px;height:auto}h1{font-size:25px;line-height:1.3;border-bottom:1px solid var(--edge);padding-bottom:9px;margin:24px 0 16px}h3{font-size:20px;margin:24px 0 16px}p{margin:0 0 16px}a{color:var(--link);text-decoration:none}a:hover{text-decoration:underline}ul{margin:0 0 20px;padding-left:24px}li{margin-bottom:13px}a:focus-visible{outline:2px solid var(--link);outline-offset:3px}@media(max-width:600px){header{padding:16px;font-size:9px}main{padding:16px;border-left:0;border-right:0;border-radius:0;margin:0;font-size:14px}h1{font-size:23px}h3{font-size:18px}picture{margin:24px 0 18px}li{margin-bottom:16px;overflow-wrap:anywhere}p{overflow-wrap:anywhere}}`;
await mkdir(path.join(root,'previews'),{recursive:true});
for(const theme of ['dark','light']){
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ashutosh — local GitHub README preview (${theme})</title><style>${css}</style></head><body class="${theme}"><header><span>PROFILE README / LOCAL REVIEW</span><span><a href="dark.html">Dark</a> · <a href="light.html">Light</a></span></header><main class="markdown-body">${blocks}</main></body></html>`;
 // Assets are relative to README at repo root, so adjust only local preview references.
 await writeFile(path.join(root,`previews/${theme}.html`),html.replaceAll('./assets/','../assets/'));
}
const names=['hero','expertise','technology','ai-systems','research','connect'];
const embedded=await Promise.all(names.flatMap(n=>[n,n+'-mobile']).map(async n=>`<section data-asset="${n}">${(await readFile(path.join(root,`assets/${n}.svg`),'utf8')).replace(/<\?xml[^>]*\?>/,'')}</section>`));
const inspect=`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>SVG geometry inspection</title></head><body>${embedded.join('')}</body></html>`;
await writeFile(path.join(root,'previews/inspect.html'),inspect);
console.log('Prepared previews/dark.html, light.html and inspect.html from the actual README.');
console.log('Serve repository root: python3 -m http.server 8765 --bind 127.0.0.1');
console.log('Open http://127.0.0.1:8765/previews/dark.html in a browser; capture screenshots using browser tools.');
console.log('These are local previews. Hosted GitHub verification requires approved publication.');
