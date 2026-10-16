import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const names = ['hero', 'expertise', 'technology', 'ai-systems', 'research', 'connect'];
const expected = names.flatMap(name => [`assets/${name}.svg`, `assets/${name}-mobile.svg`, `assets/static/${name}.svg`, `assets/static/${name}-mobile.svg`]);
expected.push('assets/worldgyan-wordmark.svg');
const problems = [];
const rendered=[];
for(const file of [...expected]){
  try{
    const content=await readFile(path.join(root,file));
    const hash=createHash('sha256').update(content).digest('hex').slice(0,12);
    const target=`assets/rendered/${file.includes('/static/')?'static/':''}${hash}/${path.basename(file)}`;
    rendered.push(target);expected.push(target);
    if(!content.equals(await readFile(path.join(root,target))))problems.push(`Rendered copy differs: ${target}`);
  }catch(error){problems.push(`Content-versioned asset: ${error.message}`);}
}
try{
  const manifest=JSON.parse(await readFile(path.join(root,'assets/rendered/manifest.json'),'utf8'));
  if(JSON.stringify(manifest.files)!==JSON.stringify(rendered.sort()))problems.push('Rendered asset manifest differs from source hashes');
}catch(error){problems.push(`Rendered manifest: ${error.message}`);}
const discovered = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(target);
    else if (entry.name.endsWith('.svg')) discovered.push(path.relative(root, target));
  }
}
try { await walk(path.join(root, 'assets')); } catch (error) { problems.push(`assets: ${error.message}`); }
for (const file of expected) if (!discovered.includes(file)) problems.push(`Missing ${file}`);
for (const file of discovered) if (!expected.includes(file)) problems.push(`Unexpected SVG ${file}; add it to the explicit asset manifest if intended`);
const files = await Promise.all(discovered.map(async file => ({ file, text: await readFile(path.join(root, file), 'utf8') })));

// Parse XML with Python's standard library; no npm parser or network resource loading.
const xmlChecks = String.raw`
import sys,json,re,math,xml.etree.ElementTree as ET
issues=[]
def issue(file,message): issues.append(file+': '+message)
def local(tag): return tag.rsplit('}',1)[-1]
def seconds(value):
    match=re.fullmatch(r'([0-9]*\.?[0-9]+)(ms|s)',value.strip())
    return float(match.group(1))/(1000 if match.group(2)=='ms' else 1) if match else None
for item in json.load(sys.stdin):
    file=item['file']; text=item['text']; static='/static/' in file
    if len(text.encode('utf-8'))>100000: issue(file,'asset exceeds 100 KB budget')
    if re.search(r'<!DOCTYPE|<!ENTITY|<\?xml-stylesheet',text,re.I):
        issue(file,'DOCTYPE, entities and external stylesheets are prohibited'); continue
    try: svg=ET.fromstring(text)
    except ET.ParseError as error: issue(file,'invalid XML: '+str(error)); continue
    if svg.tag!='{http://www.w3.org/2000/svg}svg': issue(file,'root must be an SVG in the standard namespace')
    try:
        box=[float(v) for v in re.split(r'[ ,]+',svg.get('viewBox','').strip())]
        assert len(box)==4 and all(math.isfinite(v) for v in box) and box[2]>0 and box[3]>0
    except (ValueError,AssertionError): issue(file,'requires a finite four-number viewBox with positive size'); box=None
    nodes=list(svg.iter()); ids={}; styles=[]
    for node in nodes:
        tag=local(node.tag)
        if tag.lower() in ['script','foreignobject','image','iframe','object','embed','audio','video']:
            issue(file,'prohibited element '+tag)
        if node.get('id'):
            if node.get('id') in ids: issue(file,'duplicate id '+node.get('id'))
            ids[node.get('id')]=node
        if tag=='style': styles.append(node.text or '')
        for key,value in node.attrib.items():
            key=local(key)
            if key.lower().startswith('on'): issue(file,'event handler '+key+' is prohibited')
            if key=='href' and not value.startswith('#'): issue(file,'external href is prohibited')
            if re.search(r'(?:javascript:|data:|https?://|file://)',value,re.I): issue(file,'external/data resource in attribute '+key)
            if re.search(r'url\(\s*[\"\']?(?!#)',value,re.I): issue(file,'nonlocal url() in '+key)
        if box and tag in ['text','tspan']:
            for attr,start,size in [('x',box[0],box[2]),('y',box[1],box[3])]:
                value=node.get(attr)
                if value and re.fullmatch(r'-?[0-9.]+',value):
                    try:
                        coordinate=float(value)
                        if not start<=coordinate<=start+size: issue(file,'text '+attr+' lies outside viewBox')
                    except ValueError: issue(file,'invalid text coordinate')
        if tag in ['animate','animateTransform','animateMotion','set']:
            if static: issue(file,'static fallback contains SMIL animation')
            duration=seconds(node.get('dur',''))
            if duration is None or not 0<duration<=4: issue(file,'SMIL duration must be finite and at most 4 seconds')
            if node.get('repeatCount','1')!='1': issue(file,'SMIL must run once')
    if svg.get('role')!='img': issue(file,'requires role="img"')
    labelled=svg.get('aria-labelledby','').split()
    if len(labelled)<2: issue(file,'aria-labelledby must reference title and description')
    for tag in ['title','desc']:
        alternatives=[n for n in nodes if local(n.tag)==tag and ''.join(n.itertext()).strip()]
        if not alternatives: issue(file,'requires nonempty '+tag)
        elif not any(n.get('id') in labelled for n in alternatives): issue(file,tag+' must be included in aria-labelledby')
    for label in labelled:
        if label not in ids: issue(file,'aria-labelledby references missing id '+label)
    css='\n'.join(styles)
    if re.search(r'@import|@font-face|https?://|data:|javascript:',css,re.I): issue(file,'external fonts/imports/resources are prohibited')
    if re.search(r'url\(\s*[\"\']?(?!#)',css,re.I): issue(file,'CSS url() must use a local fragment')
    for reference in re.findall(r'(?:url\(\s*[\"\']?#)([^)\"\'\s]+)',text):
        if reference not in ids: issue(file,'url() references missing id '+reference)
    for node in nodes:
        for key,value in node.attrib.items():
            if local(key)=='href' and value.startswith('#') and value[1:] not in ids: issue(file,'href references missing id '+value)
    declarations=re.findall(r'(?<![-\w])animation\s*:\s*([^;}]+)',css)
    active=[d for d in declarations if not re.fullmatch(r'none(?:\s*!important)?',d.strip())]
    if static and active: issue(file,'static fallback has active CSS animation')
    if re.search(r'animation-(?:duration|delay|iteration-count)\s*:',css): issue(file,'use a single inspectable animation shorthand')
    for declaration in active:
        if ',' in declaration: issue(file,'multiple animations per declaration are not supported by validation')
        tokens=declaration.strip().split()
        durations=[seconds(token) for token in tokens if seconds(token) is not None]
        if not durations or not 0<durations[0]<=4 or sum(durations)>4: issue(file,'animation including delay must finish within 4 seconds')
        if 'infinite' in tokens or any(re.fullmatch(r'\d+(?:\.\d+)?',token) and float(token)!=1 for token in tokens): issue(file,'CSS animation must run once')
    if active and (not re.search(r'prefers-reduced-motion\s*:\s*reduce',css) or not re.search(r'animation\s*:\s*none',css)):
        issue(file,'animated SVG must disable motion under prefers-reduced-motion: reduce')
    if re.search(r'<text\b[^>]*(?:opacity=[\"\']0[\"\']|visibility=[\"\']hidden)',text,re.I): issue(file,'essential text must be visible without animation')
print(json.dumps(issues))
`;
const parsed = spawnSync(process.env.PYTHON || 'python3', ['-c', xmlChecks], { input: JSON.stringify(files), encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
if (parsed.status !== 0) problems.push(`XML validator failed: ${parsed.stderr || parsed.error?.message || 'unknown error'}`);
else {
  try { problems.push(...JSON.parse(parsed.stdout)); }
  catch { problems.push(`Invalid XML validator result: ${parsed.stdout.slice(0, 300)}`); }
}
if (problems.length) {
  console.error(problems.map(problem => `FAIL ${problem}`).join('\n'));
  process.exitCode = 1;
} else console.log(`PASS ${files.length} SVGs: XML, local resources, text alternatives, basic bounds, finite motion and static fallbacks.`);
