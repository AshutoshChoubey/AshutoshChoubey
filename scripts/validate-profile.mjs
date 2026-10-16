import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const official = {
  github: 'https://github.com/AshutoshChoubey',
  linkedin: 'https://www.linkedin.com/in/ashutosh-kumar-choubey',
  portfolio: 'https://me.worldgyan.com/',
  worldgyan: 'https://worldgyan.com/',
  youtube: 'https://www.youtube.com/@WorldGyan',
};
const names = ['hero', 'expertise', 'technology', 'ai-systems', 'research', 'connect'];
const config = JSON.parse(await readFile(path.join(root, 'profile.config.json'), 'utf8'));
const readme = await readFile(path.join(root, 'README.md'), 'utf8');
const required = (condition, message) => { if (!condition) problems.push(message); };
const attributes = text => Object.fromEntries([...text.matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/gs)].map(match => [match[1].toLowerCase(), match[3]]));
required(config.identity?.name === 'Ashutosh Kumar Choubey', 'Use the official full name');
required(readme.includes('**Ashutosh Kumar Choubey · Senior Software Engineer**'), 'README must expose the full name as ordinary Markdown');
required(readme.includes(config.identity?.positioning), 'Positioning must have an ordinary-text equivalent');
required(/frontend/i.test(config.identity?.specializations || ''), 'Frontend must be a primary specialization');
required(config.capabilities?.length === 4, 'Keep four principal engineering capabilities');
required(config.technology?.primary?.includes('Angular') && config.technology?.primary?.includes('TypeScript'), 'Angular and TypeScript must remain primary technologies');
for (const category of ['established', 'building', 'exploring']) required(Boolean(config.classifications?.[category]?.trim()), `Missing experience classification: ${category}`);
required(config.projects?.length >= 3 && config.projects?.length <= 6, 'Feature three to six real public projects');
for (const project of config.projects || []) {
  required(/^https:\/\/github\.com\/AshutoshChoubey\/[^/?#]+$/.test(project.url || ''), `Invalid project URL: ${project.url}`);
  required(Boolean(project.description?.trim()), `Missing project description: ${project.name}`);
  required(readme.includes(`](${project.url})`), `Project needs a clickable Markdown link: ${project.name}`);
}
required(config.resources?.length > 0 && config.resources?.length <= 4, 'Use one to four verified research resources');
for (const [label, url] of Object.entries(official)) {
  required(config.links?.[label] === url, `Official ${label} URL changed`);
  required(readme.includes(`](${url})`), `Missing clickable Markdown ${label} link`);
}
required(/^\d{4}-\d{2}-\d{2}$/.test(config.review?.date || ''), 'Review date must be an actual ISO date');
if (config.review?.date) {
  const date = new Date(`${config.review.date}T00:00:00Z`);
  required(!Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === config.review.date, 'Review date is invalid');
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  required(config.review.date <= today, 'Review date cannot claim a future review');
}
required(Boolean(config.review?.basis?.trim()), 'Review date requires its research basis');
required(!/<(?:script|iframe|object|embed)\b|javascript:|data:image\//i.test(readme), 'README contains unsupported active/embedded content');
const pictures = [...readme.matchAll(/<picture\b[^>]*>([\s\S]*?)<\/picture>/gi)];
required(pictures.length === names.length, 'Expected six primary picture sections');
for (const name of names) {
  const picture = pictures.find(match => new RegExp(`assets/${name}\\.svg`).test(match[1]));
  required(Boolean(picture), `Missing picture for ${name}`);
  if (!picture) continue;
  const images = [...picture[1].matchAll(/<img\b([^>]+)>/gi)].map(match => attributes(match[1]));
  const sources = [...picture[1].matchAll(/<source\b([^>]+)>/gi)].map(match => attributes(match[1]));
  required(images.length === 1 && images[0].alt?.trim().length >= 16, `${name} needs one image with meaningful alternative text`);
  required(sources.some(source => /max-width:\s*600px/.test(source.media || '') && source.srcset?.includes(`${name}-mobile.svg`)), `${name} needs a 600px mobile source`);
  required(sources.some(source => /prefers-reduced-motion:\s*reduce/.test(source.media || '') && source.srcset?.includes('assets/static/')), `${name} needs a reduced-motion static source`);
}
const refs = new Set([
  ...[...readme.matchAll(/(?:src|href|srcset)\s*=\s*(["'])(.*?)\1/gi)].map(match => match[2]),
  ...[...readme.matchAll(/\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)].map(match => match[1]),
]);
for (let reference of refs) {
  if (/^(?:https?:|mailto:|#)/i.test(reference)) continue;
  reference = decodeURIComponent(reference.replace(/&amp;/g, '&').split(/[?#]/)[0]);
  const target = path.resolve(root, reference);
  required(target.startsWith(`${root}${path.sep}`), `Local reference escapes project: ${reference}`);
  try { required((await stat(target)).isFile(), `Local reference is not a file: ${reference}`); }
  catch { problems.push(`Broken local reference: ${reference}`); }
}
required(!/(?:github-readme-stats|streak-stats|readme-typing-svg|komarev\.com)/i.test(readme), 'Avoid external activity and typing widgets');
if (problems.length) {
  console.error(problems.map(problem => `FAIL ${problem}`).join('\n'));
  process.exitCode = 1;
} else console.log(`PASS profile configuration, ${pictures.length} responsive sections, official links, project links and local references.`);
