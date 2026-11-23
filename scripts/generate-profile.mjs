import {readFile, writeFile, mkdir, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {buildGitHubActivity} from './activity.mjs';
import {characterPortraitAlt, renderCharacterPortrait} from './character-portrait.mjs';
import {advancedCompositions} from './design-v2.mjs';
import {generateCyberTheme} from './generate-cyber-theme.mjs';
import {buildTechnologyFocus} from './language-chart.mjs';
import {renderTerminalCard, terminalAlt} from './profile-terminal.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const c = JSON.parse(await readFile(path.join(root, 'profile.config.json'), 'utf8'));
const { worldgyan } = c;
const check = process.argv.includes('--check');
const esc = v => String(v).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const text = (x,y,s,size=22,fill='#FFFFFF',extra='') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(s)}</text>`;
const label = (x,y,s,fill='#94A3B8',extra='') => text(x,y,s,12,fill,`font-family="ui-monospace, SFMono-Regular, Consolas, monospace" letter-spacing="1.8" ${extra}`);
const line = (x1,y1,x2,y2,color='#283950',extra='') => `<path d="M${x1} ${y1}H${x2}V${y2}" fill="none" stroke="${color}" ${extra}/>`;
const rect = (x,y,w,h,fill='#101D35',r=14,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
const dot = (x,y,color='#00C9FF',r=4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
const globe = (x,y,r,color='#F59E0B') => `<g transform="translate(${x} ${y})" fill="none" stroke="${color}" stroke-width="1.2"><circle r="${r}"/><ellipse rx="${r*.4}" ry="${r}"/><ellipse rx="${r}" ry="${r*.38}"/><path d="M-${r} 0H${r}"/></g>`;
const trace = d => `<path class="trace" d="${d}" fill="none" stroke="url(#signal)" stroke-width="2" stroke-linecap="round"/>`;
const border = (w,h) => rect(.5,.5,w-1,h-1,'none',18,'stroke="#283950" stroke-opacity=".7"');
const titles = {
  hero: `${c.identity.name} — ${c.identity.headline}`,
  expertise: 'Engineering expertise: frontend architecture, enterprise engineering, system design, performance and scalability',
  technology: `Core technologies: ${c.technology.primary.join(', ')}`,
  'ai-systems': 'Exploring and researching AI architecture, AI-powered applications, LLMs and agent orchestration',
  research: 'WorldGyan: technical research and education across software engineering and intelligent systems',
  connect: `${c.identity.name} — ${c.worldgyan.role}`
};
const descriptions = {
  hero: `${c.identity.specializations}. AI engineering and agentic systems are exploration interests.`,
  expertise: c.capabilities.map(v=>`${v.title}: ${v.detail}`).join('. ')+'. Exploring AI Architecture, Agentic AI, AI Orchestration, LLM Integration, MCP, evaluations and human review.',
  technology: `${c.technology.web}. Supporting: ${c.technology.supporting.join(', ')}. ${c.technology.quality}.`,
  'ai-systems': `Conceptual research architecture, not a production deployment. ${c.exploring.join('. ')}. Exploring the next generation of intelligent software.`,
  research: 'Published research in frontend system design and AI architecture, with practical Angular testing tutorials. Clickable resources are provided in the README.',
  connect: 'Engineer. Architect. Explore. Build. GitHub, LinkedIn, professional portfolio, WorldGyan and YouTube links are provided in the README.'
};
function svg(name,w,h,body,{light=false,staticAsset=false}={}) {
  const style = `text{font-family:Arial,Helvetica,sans-serif}.trace{stroke-dasharray:1100;stroke-dashoffset:0;animation:trace 3.2s ease-out 1}.orbit{transform-box:fill-box;transform-origin:center;animation:orbit 4s ease-in-out 1}.assemble{animation:assemble 2.4s ease-out 1}.layer-1{animation:assemble 2.5s ease-out .3s 1}.layer-2{animation:assemble 2.7s ease-out .6s 1}.role-enter{animation:role-enter 2.2s ease-out .3s 1}.card-enter{animation:card-enter 2s ease-out 1}.step-1{animation:card-enter 2s ease-out .25s 1}.step-2{animation:card-enter 2s ease-out .5s 1}.step-3{animation:card-enter 2s ease-out .75s 1}.ai-glow{animation:ai-glow 4s ease-in-out 1}.architecture-drift{animation:architecture-drift 4s ease-in-out 1}.system-orbit{transform-box:fill-box;transform-origin:center;animation:system-orbit 4s ease-in-out 1}.halo-orbit{transform-origin:0 0;animation:halo-orbit 4s ease-in-out 1}.beacon{animation:beacon 3.8s ease-out 1}.rise{animation:rise 1.1s ease-out .15s 1}.aurora{transform-box:fill-box;transform-origin:center;animation:aurora 3.4s ease-out 1}.signal{stroke-dasharray:12 540;animation:signal 3.8s ease-out 1}@keyframes role-enter{from{transform:translateY(12px);opacity:.6}to{transform:translateY(0);opacity:1}}@keyframes card-enter{from{transform:translateY(18px);opacity:.35}to{transform:translateY(0);opacity:1}}@keyframes ai-glow{0%{fill:#73DEFF}25%{fill:#FFFFFF}50%{fill:#F8BF5C}75%{fill:#FFFFFF}100%{fill:#73DEFF}}@keyframes architecture-drift{0%{transform:translateY(18px);opacity:.4}45%{transform:translateY(-8px);opacity:1}75%{transform:translateY(4px)}100%{transform:translateY(0);opacity:1}}@keyframes system-orbit{from{transform:rotate(-85deg)}to{transform:rotate(0)}}@keyframes halo-orbit{from{transform:rotate(-150deg)}to{transform:rotate(0)}}@keyframes beacon{0%{r:4;opacity:.3}35%{r:15;opacity:.8}70%{r:5;opacity:.4}100%{r:10;opacity:1}}@keyframes assemble{from{transform:translateY(32px);opacity:.25}to{transform:translateY(0);opacity:1}}@keyframes trace{from{stroke-dashoffset:1100}to{stroke-dashoffset:0}}@keyframes orbit{from{transform:rotate(-14deg)}to{transform:rotate(0)}}@keyframes rise{from{transform:translateY(8px);opacity:.78}to{transform:translateY(0);opacity:1}}@keyframes aurora{from{transform:scale(.97);opacity:.55}to{transform:scale(1);opacity:1}}@keyframes signal{from{stroke-dashoffset:552}to{stroke-dashoffset:0}}@media(prefers-reduced-motion:reduce){.trace,.orbit,.rise,.aurora,.signal,.assemble,.role-enter,.card-enter,.halo-orbit,.system-orbit,.beacon,.ai-glow,.architecture-drift{animation:none!important}}`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc">\n<title id="title">${esc(titles[name])}</title>\n<desc id="desc">${esc(descriptions[name])}</desc>\n<defs><clipPath id="frame-clip"><rect width="${w}" height="${h}" rx="18"/></clipPath><linearGradient id="surface" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0B1225"/><stop offset="1" stop-color="#122742"/></linearGradient><linearGradient id="signal"><stop stop-color="#1E40AF"/><stop offset=".52" stop-color="#00C9FF"/><stop offset="1" stop-color="#73DEFF"/></linearGradient><radialGradient id="ambient"><stop stop-color="#1E40AF" stop-opacity=".28"/><stop offset="1" stop-color="#1E40AF" stop-opacity="0"/></radialGradient><linearGradient id="ink"><stop stop-color="#0B1225"/><stop offset="1" stop-color="#1E40AF"/></linearGradient><linearGradient id="card" x2=".7" y2="1"><stop stop-color="#1A304C"/><stop offset="1" stop-color="#101E34"/></linearGradient><linearGradient id="orchestrator" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#194578"/><stop offset=".55" stop-color="#173957"/><stop offset="1" stop-color="#14243D"/></linearGradient><radialGradient id="cyan-halo"><stop stop-color="#00C9FF" stop-opacity=".19"/><stop offset="1" stop-color="#00C9FF" stop-opacity="0"/></radialGradient><radialGradient id="paper-light"><stop stop-color="#DCEBFA" stop-opacity=".65"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient><pattern id="blueprint" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="#345170" stroke-width=".5"/></pattern></defs>\n${staticAsset ? '<style>text{font-family:Arial,Helvetica,sans-serif}</style>' : `<style>${style}</style>`}\n${rect(0,0,w,h,light?'#FFFFFF':'url(#surface)',18)}\n<g clip-path="url(#frame-clip)">${body}</g>\n${border(w,h)}\n</svg>\n`;
}
function sectionHeader(n,title,w,mobile,light=false) {
  const x=mobile?28:42;
  return label(x,35,n+' / '+title,light?'#526179':'#A8B7CC') + line(x,52,w-x,52,light?'#DEE5EE':'#283950') + dot(w-x,34,'#F59E0B',3);
}
function technology(m) {
  const w=m?420:960,h=m?492:298;
  let b=sectionHeader('01','CORE TECHNOLOGY',w,m);
  if(m) {
    b+=rect(28,78,364,74,'#163052',12,'stroke="#3D6690"');
    b+=text(46,113,c.technology.primary[0],28,'#FFFFFF','font-weight="700"');
    b+=text(46,137,'Frontend architecture',16,'#A5DFFF');
    b+=text(28,193,c.technology.primary.slice(1,3).join('  /  '),24,'#FFFFFF','font-weight="600"');
    b+=text(28,234,c.technology.primary.slice(3).join('  /  '),23,'#73DEFF','font-weight="600"');
    b+=text(28,274,'HTML5 · CSS3 / SCSS',17,'#CFD9E7');
    b+=line(28,298,392,298);
    b+=label(28,327,'SUPPORTING ENGINEERING');
    c.technology.supporting.forEach((s,i)=>{
      b+=dot(32,351+i*29,'#4E88BF',3);
      b+=text(46,357+i*29,s,17,'#CFD9E7');
    });
    b+=line(28,434,392,434);
    b+=text(28,466,c.technology.quality,14,'#B4C2D5');
  } else {
    b+=rect(42,80,226,112,'#163052',12,'stroke="#3D6690"');
    b+=text(56,126,c.technology.primary[0],28,'#FFFFFF','font-weight="700"');
    b+=text(56,158,'Frontend architecture',16,'#A5DFFF');
    c.technology.primary.slice(1).forEach((s,i)=>{
      const x=298+i*156;
      b+=text(x,119,s,25,i>1?'#73DEFF':'#FFFFFF','font-weight="600"');
      b+=line(x,134,x+133,134,'#345170');
    });
    b+=text(298,170,c.technology.web,18,'#B4C2D5');
    b+=trace('M42 210H918');
    b+=label(42,244,'SUPPORTING');
    b+=text(208,244,c.technology.supporting.join('   ·   '),17,'#CFD9E7');
    b+=text(208,274,c.technology.quality,16,'#B4C2D5');
  }
  return {w,h,b};
}
function research(m) {
  const w=m?420:960,h=m?255:222;
  let b=sectionHeader('04','RESEARCH & KNOWLEDGE',w,m,true);
  b+=text(m?28:42,m?98:103,'Engineering, shared.',m?29:35,'#0B1225','font-weight="700"');
  b+=text(m?28:42,m?129:139,'Frontend systems, AI architecture & practical tutorials.',m?14:18,'#526179');
  if(m) {
    b+=line(28,154,392,154,'#DEE5EE');
    b+=text(28,187,'Frontend systems · AI architecture',18,'#1E40AF','font-weight="600"');
    b+=text(28,218,'Software engineering · practical tutorials',16,'#526179');
  } else {
    b+=text(42,184,'Frontend systems  /  AI architecture  /  Practical tutorials',21,'#1E40AF','font-weight="600"');
    b+=`<path d="M815 95h60v60h-60zM835 75h60v60" fill="none" stroke="#F59E0B" stroke-width="1.3"/>`;
  }
  return {w,h,b,light:true};
}
function connect(m) {
  const w=m?420:960,h=m?288:236,mid=w/2;
  let b=line(mid-22,42,mid+22,42,'#F59E0B','stroke-width="2"');
  b+=text(mid,m?103:103,c.identity.name,m?25:34,'#0B1225','font-weight="600" text-anchor="middle"');
  b+=`<text x="${mid}" y="${m?137:141}" font-size="${m?18:19}" text-anchor="middle"><tspan fill="#526179">Founder, </tspan><tspan fill="${esc(c.worldgyan.wordmark.world)}" font-weight="700">World</tspan><tspan fill="${esc(c.worldgyan.wordmark.gyan)}" font-weight="700">Gyan</tspan></text>`;
  b+=line(mid-31,m?164:164,mid+31,m?164:164,'#345170');
  if(m){
    b+=text(mid,210,'ENGINEER. ARCHITECT.',23,'#0B1225','font-weight="700" letter-spacing="1.2" text-anchor="middle"');
    b+=text(mid,244,'EXPLORE. BUILD.',23,'#1E40AF','font-weight="700" letter-spacing="1.2" text-anchor="middle"');
  } else b+=text(mid,205,'ENGINEER. ARCHITECT. EXPLORE. BUILD.',25,'#0B1225','font-weight="700" letter-spacing="2.3" text-anchor="middle"');
  return {w,h,b,light:true};
}
const logoUri='data:image/png;base64,'+(await readFile(path.join(root,'assets/worldgyan-logo-hero.base64.txt'),'utf8')).trim();
const compositions={technology,research,connect,...advancedCompositions(c,{text,label,line,rect,dot,trace,sectionHeader,logoUri})};
const outputs=await generateCyberTheme(root,c);
for(const [name,draw] of Object.entries(compositions)) for(const mobile of [false,true]) {
  const {w,h,b,light}=draw(mobile);
  const filename=`${name}${mobile?'-mobile':''}.svg`;
  outputs.set(`assets/${filename}`,svg(name,w,h,b,{light}));
  outputs.set(`assets/static/${filename}`,svg(name,w,h,b,{light,staticAsset:true}));
}
for(const mobile of [false,true]) {
  const suffix=mobile?'-mobile':'';
  outputs.set(`assets/terminal-card${suffix}.svg`,renderTerminalCard(c,{mobile}));
  outputs.set(`assets/static/terminal-card${suffix}.svg`,renderTerminalCard(c,{mobile,staticAsset:true}));
  outputs.set(`assets/character-portrait${suffix}.svg`,renderCharacterPortrait({mobile}));
  outputs.set(`assets/static/character-portrait${suffix}.svg`,renderCharacterPortrait({mobile,staticAsset:true}));
}

const activity=await buildGitHubActivity();
const focus=buildTechnologyFocus(c.technologyFocus);
for(const [name,chart] of [['github-activity',activity],['github-languages',focus]]) {
  outputs.set(`assets/${name}.svg`,chart.desktop);
  outputs.set(`assets/${name}-mobile.svg`,chart.mobile);
  outputs.set(`assets/static/${name}.svg`,chart.desktopStatic);
  outputs.set(`assets/static/${name}-mobile.svg`,chart.mobileStatic);
}

outputs.set('assets/worldgyan-wordmark.svg',`<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="360" height="144" viewBox="0 0 360 144" role="img" aria-labelledby="title desc"><title id="title">WorldGyan</title><desc id="desc">World in black, Gyan in saffron. ${esc(worldgyan.tagline)}.</desc><rect width="360" height="144" rx="12" fill="#FFFFFF"/><text x="180" y="79" font-family="Arial,Helvetica,sans-serif" font-size="54" font-weight="700" text-anchor="middle"><tspan fill="${esc(worldgyan.wordmark.world)}">World</tspan><tspan fill="${esc(worldgyan.wordmark.gyan)}">Gyan</tspan></text><text x="180" y="108" font-family="Arial,Helvetica,sans-serif" font-size="16" fill="#334155" text-anchor="middle">${esc(worldgyan.tagline)}</text></svg>\n`);
// GitHub's raw redirect can drop query strings. Version the path, not just the URL query.
const assetUrl=file=>{
  const content=outputs.get(file);
  const hash=createHash('sha256').update(content).digest('hex').slice(0,12);
  const rendered=`assets/rendered/${file.includes('/static/')?'static/':''}${hash}/${path.basename(file)}`;
  outputs.set(rendered,content);
  return `./${rendered}`;
};
function consolePair(mobile,staticAsset) {
  const directory=staticAsset?'assets/static':'assets';
  const suffix=mobile?'-mobile':'';
  const gap=24;
  const panelWidth=mobile?672:588;
  const panelHeight=panelWidth*432/672;
  const width=mobile?panelWidth:2*panelWidth+gap;
  const height=mobile?2*panelHeight+gap:panelHeight;
  const panels=['terminal-card','character-portrait'].map((name,index)=>{
    const file=`${directory}/${name}${suffix}.svg`;
    const source=outputs.get(file);
    // Keep the standalone asset URLs available to earlier profile renders.
    assetUrl(file);
    const x=mobile?0:index*(panelWidth+gap);
    const y=mobile?index*(panelHeight+gap):0;
    return source.slice(source.indexOf('<svg '))
      .replace('<svg ',`<svg x="${x}" y="${y}" `)
      .replace(/width="\d+" height="\d+" role="img"/,`width="${panelWidth}" height="${panelHeight}" aria-hidden="true"`)
      .replace(' aria-labelledby="title desc"','')
      .replace(/id="([^"]+)"/g,`id="${name}-$1"`)
      .replace(/url\(#([^)]+)\)/g,`url(#${name}-$1)`);
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">engineering.ts and portrait.sh</title>
  <desc id="desc">${esc(terminalAlt(c))} ${esc(characterPortraitAlt)}</desc>
${panels.join('\n')}
</svg>
`;
}
for (const mobile of [false,true]) for (const staticAsset of [false,true]) {
  const suffix=`${mobile?'-mobile':''}${staticAsset?'-static':''}`;
  outputs.set(`themes/main/assets/console-pair${suffix}.svg`,consolePair(mobile,staticAsset));
}
const mobileMedia=`(max-width: ${c.presentation.mobileBreakpoint}px)`;
const reducedMotion='(prefers-reduced-motion: reduce)';
const pictureSource=(media,srcset)=>`  <source media="${media}" srcset="${srcset}">`;
function picture(name,alt=`${titles[name]}. ${descriptions[name]}`) {
  const markup=[
    '<picture>',
    pictureSource(`${reducedMotion} and ${mobileMedia}`,assetUrl(`assets/static/${name}-mobile.svg`)),
    pictureSource(reducedMotion,assetUrl(`assets/static/${name}.svg`)),
    pictureSource(mobileMedia,assetUrl(`assets/${name}-mobile.svg`)),
    `  <img src="${assetUrl(`assets/${name}.svg`)}" width="100%" alt="${esc(alt)}">`,
    '</picture>',
  ].join('\n');
  return `<p>\n${markup}\n</p>`;
}

const mainAssets='./themes/main/assets';
const mainImage=(file,alt,extra='')=>`<img src="${mainAssets}/${file}.svg" width="100%" alt="${esc(alt)}"${extra}>`;
const mainPanel=(file,alt)=>`<p>${mainImage(file,alt)}</p>`;
const section=(number,title)=>`<h2>${mainImage(`title-part${number}`,title)}</h2>`;
const projects=c.projects.map(project=>`${mainImage(project.artwork, `${project.name} illustration`, ' loading="lazy"')}

[**${project.name}**](${project.url}) — ${project.description}`).join('\n\n');

const editions=c.editions.map(edition=>`[${edition.name}](./themes/${edition.theme}/README.md)`).join(' · ');
const researchLinks=c.resources.map(resource=>
  `- **${resource.title}** · [${resource.action}](${resource.url})`
).join('\n');
const contacts=[
  ['portfolio',c.links.portfolio,'Portfolio website'],
  ['platform',c.links.worldgyan,'WorldGyan platform'],
  ['linkedin',c.links.linkedin,'LinkedIn profile'],
  ['github',c.links.github,'GitHub profile'],
  ['youtube',c.links.youtube,'WorldGyan YouTube channel']
];
function contactBadges({includeEmail=false}={}) {
  const links=includeEmail ? [...contacts,['email','mailto:contact@worldgyan.com','Email contact@worldgyan.com']] : contacts;
  return `<p align="center">\n${links.map(([badge,url,alt])=>
    `  <a href="${esc(url)}"><img src="./themes/main/badges/${badge}.svg" alt="${esc(alt)}"></a>`
  ).join('\n')}\n</p>`;
}

const readme=`<!-- Generated from profile.config.json. Edit the source, then run npm run generate. -->
<p>
<picture>
  <source media="(max-width: 600px)" srcset="${mainAssets}/hero-architect-mobile.svg">
  <source media="${reducedMotion}" srcset="${mainAssets}/hero-architect-static.svg">
  ${mainImage('hero-architect-podcast',`${c.identity.name} · ${c.identity.headline}. Seated in a podcast studio.`)}
</picture>
</p>

${contactBadges()}

${section('01','01 · Engineering Console')}

${mainPanel('terminal-system','Engineering Console: shell profile, frontend systems, project references and AI research.')}

<p>
<picture>
  <source media="${reducedMotion} and ${mobileMedia}" srcset="${mainAssets}/console-pair-mobile-static.svg">
  <source media="${reducedMotion}" srcset="${mainAssets}/console-pair-static.svg">
  <source media="${mobileMedia}" srcset="${mainAssets}/console-pair-mobile.svg">
  ${mainImage('console-pair',`${terminalAlt(c)} ${characterPortraitAlt}`)}
</picture>
</p>

${section('02','02 · Engineering Systems & Architecture')}

${mainPanel('architecture-leadership','Frontend architecture and design systems, with a focus on Angular state, HTTP request flows and AI research.')}

${mainPanel('engineering-systems','WorldGyan engineering systems: frontend architecture, enterprise integration, system design and performance.')}

${section('03','03 · Core Technology')}

${mainImage('technology-core','Technology diagram covering Angular, TypeScript, RxJS, NgRx and supporting tools.')}

${c.classifications.established}

${section('04','04 · AI Systems Lab & Exploration')}

${mainImage('ai-orchestration','Research diagram of a Plan–Act–Reflect workflow, including tool integration and feedback.')}

${c.classifications.exploring}

${section('05','05 · Selected Engineering Labs & Projects')}

${projects}

${section('06','06 · Engineering Activity & Insights')}

${picture('github-activity',activity.summary.description)}

[View contribution activity on GitHub](${c.links.github}#contribution-activity).

${picture('github-languages',focus.summary.description)}

<picture>
  <source media="${reducedMotion}" srcset="${mainAssets}/github-jet-static.svg">
  ${mainImage('github-jet','Flying jet above Ashutosh Choubey’s GitHub contribution calendar.',' loading="lazy"')}
</picture>

<picture>
  <source media="${reducedMotion}" srcset="${mainAssets}/contribution-snake-static.svg">
  ${mainImage('contribution-snake','Contribution snake for AshutoshChoubey.',' loading="lazy"')}
</picture>

${section('07','07 · Research, Writing & Knowledge Sharing')}

${mainPanel('research-systems',c.resources.map(resource=>`${resource.title} — ${resource.description}`).join('. '))}

<p align="center"><br><a href="${c.links.worldgyan}"><img src="./${worldgyan.logo}" width="64" height="64" alt=""> <img src="${assetUrl('assets/worldgyan-wordmark.svg')}" width="160" height="64" alt="WorldGyan"></a></p>

${researchLinks}

${section('08','08 · Connect')}

${contactBadges({includeEmail:true})}

${mainImage('footer-signature-v2',`${c.identity.name} · ${worldgyan.role}`)}

${editions}

<details>
<summary><b>Design Documentation &amp; Accessibility</b></summary>

${picture('hero')}

**${c.identity.name} · ${c.identity.headline}**<br>
${c.identity.specializations}

${picture('expertise')}

${picture('technology')}

${picture('ai-systems')}

${picture('research')}

${picture('connect')}

</details>
`;
outputs.set('README.md',readme);
const renderedFiles=[...outputs.keys()].filter(file=>file.startsWith('assets/rendered/')).sort();
const manifest='assets/rendered/manifest.json';
outputs.set(manifest,JSON.stringify({version:1,files:renderedFiles},null,2)+'\n');
if(!check){
  const old=JSON.parse(await readFile(path.join(root,manifest),'utf8').catch(()=>'{}'));
  for(const file of old.files||[]){
    if(!/^assets\/rendered\/(?:static\/)?[a-f0-9]{12}\/[a-z-]+\.svg$/.test(file))throw Error('Unsafe generated manifest path');
    if(!outputs.has(file))await rm(path.join(root,file),{force:true});
  }
}
let stale=[];
for(const [file,value] of outputs) {
  const dest=path.join(root,file);
  if(check) {if(await readFile(dest,'utf8').catch(()=>null)!==value)stale.push(file);}
  else {await mkdir(path.dirname(dest),{recursive:true});await writeFile(dest,value);}
}
if(stale.length){console.error('Generated files differ: '+stale.join(', '));process.exitCode=1;}
else console.log(`${check?'Verified':'Generated'} ${outputs.size} deterministic files.`);
