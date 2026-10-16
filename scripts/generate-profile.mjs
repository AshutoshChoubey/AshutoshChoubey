import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const c = JSON.parse(await readFile(path.join(root, 'profile.config.json'), 'utf8'));
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
  hero: `${c.identity.specializations}. ${c.identity.positioning} AI engineering and agentic systems are exploration interests.`,
  expertise: c.capabilities.map(v=>`${v.title}: ${v.detail}`).join('. '),
  technology: `${c.technology.web}. Supporting: ${c.technology.supporting.join(', ')}. ${c.technology.quality}.`,
  'ai-systems': `Conceptual research architecture, not a production deployment. ${c.exploring.join('. ')}. Exploring the next generation of intelligent software.`,
  research: 'Published research in frontend system design and AI architecture, with practical Angular testing tutorials. Clickable resources are provided in the README.',
  connect: 'Engineer. Architect. Explore. Build. GitHub, LinkedIn, professional portfolio, WorldGyan and YouTube links are provided in the README.'
};
function svg(name,w,h,body,{light=false,staticAsset=false}={}) {
  const style = `text{font-family:Arial,Helvetica,sans-serif} .trace{stroke-dasharray:1100;stroke-dashoffset:0;animation:trace 4s ease-out 1} .orbit{transform-box:fill-box;transform-origin:center;animation:orbit 4s ease-in-out 1} @keyframes trace{from{stroke-dashoffset:1100}to{stroke-dashoffset:0}} @keyframes orbit{from{transform:rotate(-14deg)}to{transform:rotate(0)}} @media(prefers-reduced-motion:reduce){.trace,.orbit{animation:none!important}}`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc">\n<title id="title">${esc(titles[name])}</title>\n<desc id="desc">${esc(descriptions[name])}</desc>\n<defs><clipPath id="frame-clip"><rect width="${w}" height="${h}" rx="18"/></clipPath><linearGradient id="surface" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0B1225"/><stop offset="1" stop-color="#122742"/></linearGradient><linearGradient id="signal"><stop stop-color="#1E40AF"/><stop offset=".52" stop-color="#00C9FF"/><stop offset="1" stop-color="#73DEFF"/></linearGradient><radialGradient id="ambient"><stop stop-color="#1E40AF" stop-opacity=".28"/><stop offset="1" stop-color="#1E40AF" stop-opacity="0"/></radialGradient><linearGradient id="ink"><stop stop-color="#0B1225"/><stop offset="1" stop-color="#1E40AF"/></linearGradient></defs>\n${staticAsset ? '<style>text{font-family:Arial,Helvetica,sans-serif}</style>' : `<style>${style}</style>`}\n${rect(0,0,w,h,light?'#FFFFFF':'url(#surface)',18)}\n<g clip-path="url(#frame-clip)">${body}</g>\n${border(w,h)}\n</svg>\n`;
}
function sectionHeader(n,title,w,mobile,light=false) {
  const x=mobile?28:42;
  return label(x,35,n+' / '+title,light?'#526179':'#A8B7CC') + line(x,52,w-x,52,light?'#DEE5EE':'#283950') + dot(w-x,34,'#F59E0B',3);
}
function hero(m) {
  const w=m?420:960,h=m?500:490,center=w/2;
  let b = `<circle cx="${m?380:915}" cy="${m?95:170}" r="${m?115:220}" fill="none" stroke="#1E40AF" stroke-opacity=".07"/><circle cx="${m?380:915}" cy="${m?95:170}" r="${m?80:175}" fill="none" stroke="#1E40AF" stroke-opacity=".09"/><path d="M${m?16:35} ${m?72:114}h${m?45:115}m-${m?25:65} -20v40" fill="none" stroke="#DCE6F2"/>`;
  b += label(center,40,'ENGINEERING / WITH INTENT','#526179','text-anchor="middle"');
  b += globe(center,m?86:83,17);
  b += text(center,m?165:194,c.identity.givenName,m?52:101,'#0B1225','font-weight="800" letter-spacing="-2.5" text-anchor="middle"');
  b += text(center,m?215:281,c.identity.familyName,m?38:80,'url(#ink)','font-weight="800" letter-spacing="-1.8" text-anchor="middle"');
  b += text(center,m?258:325,c.identity.headline,m?17:21,'#334155','font-weight="600" letter-spacing="2.6" text-anchor="middle"');
  b += line(center-33,m?281:350,center+33,m?281:350,'#F59E0B','stroke-width="2"');
  const deck=m?310:377;
  b += rect(1,deck,w-2,h-deck-1,'#0B1225',0);
  b += trace(`M${m?28:42} ${deck}H${w-(m?28:42)}`);
  if(m) {
    b += text(center,352,'FRONTEND ARCHITECTURE',18,'#FFFFFF','font-weight="600" text-anchor="middle"');
    b += text(center,380,'SYSTEM DESIGN',18,'#FFFFFF','font-weight="600" text-anchor="middle"');
    b += label(center,420,'EXPLORING','#A8B7CC','text-anchor="middle"');
    b += text(center,449,'AI ENGINEERING · AGENTIC SYSTEMS',15,'#73DEFF','text-anchor="middle"');
  } else {
    b += text(center,420,c.identity.specializations,22,'#FFFFFF','font-weight="600" letter-spacing="1.1" text-anchor="middle"');
    b += label(center,458,'EXPLORING / AI ENGINEERING · AGENTIC SYSTEMS','#73DEFF','text-anchor="middle"');
  }
  return {w,h,b,light:true};
}
function expertise(m) {
  const w=m?420:960,h=m?514:354;
  let b=sectionHeader('01','ENGINEERING EXPERTISE',w,m);
  if(m) {
    b+=line(48,108,48,455,'#345170');
    c.capabilities.forEach((cap,i)=>{
      const y=89+i*100;
      b+=rect(69,y,323,78,'#122039',12,'stroke="#2A405D"');
      b+=dot(48,y+38,i===0?'#F59E0B':'#00C9FF',5);
      b+=line(53,y+38,69,y+38,'#00C9FF');
      b+=text(87,y+30,cap.title,cap.title.length>22?19:21,'#FFFFFF','font-weight="600"');
      b+=text(87,y+56,cap.detail,15,'#B4C2D5');
    });
    b+=trace('M48 108V427');
  } else {
    b+=`<ellipse cx="480" cy="208" rx="178" ry="135" fill="url(#ambient)"/>`;
    b+=`<g class="orbit" fill="none" stroke="#345170"><circle cx="480" cy="207" r="70"/><ellipse cx="480" cy="207" rx="102" ry="39" transform="rotate(-32 480 207)"/></g>`;
    const cards=[[42,93],[603,93],[42,223],[603,223]];
    cards.forEach(([x,y],i)=>{
      const cap=c.capabilities[i];
      b+=rect(x,y,315,90,'#122039',12,'stroke="#2A405D"');
      b+=label(x+18,y+25,`0${i+1}`,i===0?'#F59E0B':'#73DEFF');
      b+=text(x+18,y+51,cap.title,22,'#FFFFFF','font-weight="600"');
      b+=text(x+18,y+73,cap.detail,16,'#B4C2D5');
      const start=i%2===0?x+315:x;
      const end=i%2===0?410:550;
      b+=trace(`M${start} ${y+45}H${end}V207`);
    });
    b+=rect(413,180,134,54,'#0B1225',10,'stroke="#4E88BF"');
    b+=text(480,213,'FRONTEND',18,'#FFFFFF','font-weight="600" letter-spacing="1" text-anchor="middle"');
    b+=dot(480,137,'#F59E0B');
    b+=dot(480,277);
  }
  return {w,h,b};
}
function technology(m) {
  const w=m?420:960,h=m?492:298;
  let b=sectionHeader('02','CORE TECHNOLOGY',w,m);
  if(m) {
    b+=rect(28,78,364,74,'#163052',12,'stroke="#3D6690"');
    b+=text(46,113,c.technology.primary[0],31,'#FFFFFF','font-weight="700"');
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
    b+=rect(42,80,204,112,'#163052',12,'stroke="#3D6690"');
    b+=text(62,126,c.technology.primary[0],34,'#FFFFFF','font-weight="700"');
    b+=text(62,158,'Frontend architecture',16,'#A5DFFF');
    c.technology.primary.slice(1).forEach((s,i)=>{
      const x=278+i*161;
      b+=text(x,119,s,25,i>1?'#73DEFF':'#FFFFFF','font-weight="600"');
      b+=line(x,134,x+133,134,'#345170');
    });
    b+=text(278,170,c.technology.web,18,'#B4C2D5');
    b+=trace('M42 210H918');
    b+=label(42,244,'SUPPORTING');
    b+=text(208,244,c.technology.supporting.join('   ·   '),17,'#CFD9E7');
    b+=text(208,274,c.technology.quality,16,'#B4C2D5');
  }
  return {w,h,b};
}
function ai(m) {
  const w=m?420:960,h=m?552:394;
  let b=sectionHeader('03','EXPLORING & RESEARCHING',w,m);
  if(m) {
    b+=text(28,97,'AI architecture.',26,'#FFFFFF','font-weight="600"');
    b+=text(28,127,'Thoughtful autonomy.',26,'#73DEFF','font-weight="600"');
    b+=label(28,158,'CONCEPTUAL AGENT ARCHITECTURE');
    const nodes=[['AI-powered applications','Human goals & context'],['LLMs + tool use','Typed boundaries · MCP'],['Agent orchestration','Coordinate · evaluate · review']];
    nodes.forEach(([a,d],i)=>{
      const y=187+i*97;
      b+=rect(28,y,364,73,'#122039',12,'stroke="#345170"');
      b+=dot(50,y+27,i===2?'#F59E0B':'#00C9FF');
      b+=text(66,y+32,a,21,'#FFFFFF','font-weight="600"');
      b+=text(48,y+57,d,15,'#B4C2D5');
      if(i<2)b+=trace(`M210 ${y+73}V${y+97}`);
    });
    b+=text(28,498,'Next-generation engineering',19,'#FFFFFF');
    b+=text(28,526,'Research direction · learning in progress',15,'#B4C2D5');
  } else {
    b+=text(42,102,'AI architecture. Intelligent applications.',29,'#FFFFFF','font-weight="600"');
    b+=label(42,132,'CONCEPTUAL ARCHITECTURE / LEARNING IN PROGRESS');
    const nodes=[['AI-powered','applications','Human goals & context'],['LLMs +','tool use','Typed boundaries · MCP'],['Agent','orchestration','Evaluate · human review']];
    nodes.forEach(([a,a2,d],i)=>{
      const x=42+i*302;
      b+=rect(x,164,272,114,'#122039',12,'stroke="#345170"');
      b+=dot(x+22,187,i===2?'#F59E0B':'#00C9FF');
      b+=text(x+20,218,a+' '+a2,21,'#FFFFFF','font-weight="600"');
      b+=text(x+20,253,d,16,'#B4C2D5');
      if(i<2)b+=trace(`M${x+272} 221H${x+302}`);
    });
    b+=`<path d="M782 278V308H178V278" fill="none" stroke="#4E88BF" stroke-dasharray="4 5"/>`;
    b+=rect(360,296,240,24,'#102039',4);
    b+=label(480,312,'HUMAN REVIEW & FEEDBACK','#A8B7CC','text-anchor="middle"');
    b+=text(42,357,'Exploring the next generation of intelligent software.',20,'#CFD9E7');
    b+=label(918,357,'RESEARCH DIRECTION','#73DEFF','text-anchor="end"');
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
const compositions={hero,expertise,technology,'ai-systems':ai,research,connect};
const outputs=new Map();
for(const [name,draw] of Object.entries(compositions)) for(const mobile of [false,true]) {
  const {w,h,b,light}=draw(mobile);
  const filename=`${name}${mobile?'-mobile':''}.svg`;
  outputs.set(`assets/${filename}`,svg(name,w,h,b,{light}));
  outputs.set(`assets/static/${filename}`,svg(name,w,h,b,{light,staticAsset:true}));
}
outputs.set('assets/worldgyan-wordmark.svg',`<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="360" height="112" viewBox="0 0 360 112" role="img" aria-labelledby="title desc"><title id="title">WorldGyan</title><desc id="desc">World in black, Gyan in saffron. Next-Gen AI and Engineering.</desc><rect width="360" height="112" rx="12" fill="#FFFFFF"/><text x="180" y="63" font-family="Arial,Helvetica,sans-serif" font-size="54" font-weight="700" text-anchor="middle"><tspan fill="${esc(c.worldgyan.wordmark.world)}">World</tspan><tspan fill="${esc(c.worldgyan.wordmark.gyan)}">Gyan</tspan></text><text x="180" y="92" font-family="Arial,Helvetica,sans-serif" font-size="17" fill="#334155" text-anchor="middle">Next-Gen AI &amp; Engineering</text></svg>\n`);
const assetUrl=file=>`./${file}?v=${createHash('sha256').update(outputs.get(file)).digest('hex').slice(0,12)}`;
const picture = name => `<p>\n<picture>\n  <source media="(prefers-reduced-motion: reduce) and (max-width: 600px)" srcset="${assetUrl(`assets/static/${name}-mobile.svg`)}">\n  <source media="(prefers-reduced-motion: reduce)" srcset="${assetUrl(`assets/static/${name}.svg`)}">\n  <source media="(max-width: 600px)" srcset="${assetUrl(`assets/${name}-mobile.svg`)}">\n  <img src="${assetUrl(`assets/${name}.svg`)}" width="100%" alt="${esc(titles[name]+'. '+descriptions[name])}">\n</picture>\n</p>`;
const readme=`<!-- Generated from profile.config.json. Edit the source, then run npm run generate. -->
${picture('hero')}

**${c.identity.name} · ${c.identity.headline.replaceAll(/\b\w+/g,s=>s.charAt(0)+s.slice(1).toLowerCase())}**

${c.identity.positioning}

${picture('expertise')}

${picture('technology')}

**Established expertise:** ${c.classifications.established}

**Currently building:** ${c.classifications.building}

${picture('ai-systems')}

**Exploring and researching:** ${c.classifications.exploring}

### Selected engineering projects

Public learning projects and code references, selected after reviewing their implementations.

${c.projects.map(p=>`- [**${p.name}**](${p.url}) — ${p.description}`).join('\n')}

<p align="center"><a href="${c.links.worldgyan}"><img src="./${c.worldgyan.logo}" width="64" height="64" alt="WorldGyan official circular logo"></a> <a href="${c.links.worldgyan}"><img src="${assetUrl('assets/worldgyan-wordmark.svg')}" width="200" height="62" alt="WorldGyan — Next-Gen AI and Engineering"></a></p>

${picture('research')}

${c.resources.map(p=>`- [${p.title}](${p.url}) — ${p.description}`).join('\n')}

${picture('connect')}

[GitHub](${c.links.github}) · [LinkedIn](${c.links.linkedin}) · [Professional Portfolio](${c.links.portfolio}) · [WorldGyan](${c.links.worldgyan}) · [YouTube](${c.links.youtube})
`;
outputs.set('README.md',readme);
let stale=[];
for(const [file,value] of outputs) {
  const dest=path.join(root,file);
  if(check) {if(await readFile(dest,'utf8').catch(()=>null)!==value)stale.push(file);}
  else {await mkdir(path.dirname(dest),{recursive:true});await writeFile(dest,value);}
}
if(stale.length){console.error('Generated files differ: '+stale.join(', '));process.exitCode=1;}
else console.log(`${check?'Verified':'Generated'} ${outputs.size} deterministic files.`);
