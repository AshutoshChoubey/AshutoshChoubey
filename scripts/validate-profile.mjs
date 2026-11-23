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
const names = ['hero', 'expertise', 'technology', 'ai-systems', 'research', 'connect', 'github-activity', 'github-languages'];
const config = JSON.parse(await readFile(path.join(root, 'profile.config.json'), 'utf8'));
const readme = await readFile(path.join(root, 'README.md'), 'utf8');
const required = (condition, message) => { if (!condition) problems.push(message); };
const attributes = text => Object.fromEntries([...text.matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/gs)].map(match => [match[1].toLowerCase(), match[3]]));
required(config.identity?.name === 'Ashutosh Kumar Choubey', 'Use the official full name');
required(readme.includes(`**${config.identity.name} · ${config.identity.headline}**`), 'README must expose the full name as ordinary Markdown');
required(readme.includes(config.identity?.specializations), 'Specializations must have an ordinary-text equivalent');
required(/frontend/i.test(config.identity?.specializations || ''), 'Frontend must be a primary specialization');
required(Number.isInteger(config.presentation?.mobileBreakpoint) && config.presentation.mobileBreakpoint >= 600 && config.presentation.mobileBreakpoint <= 1100, 'Choose a deliberate responsive breakpoint between 600 and 1100px');
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
for (const resource of config.resources || []) {
  required(resource.action?.trim() && readme.includes(`[${resource.action}](${resource.url})`), `Research resource needs a visible action link: ${resource.title}`);
}
const linkedBadges = [...readme.matchAll(/<a href="([^"]+)"><img\b([^>]+)><\/a>/gi)];
for (const [label, url] of Object.entries(official)) {
  required(config.links?.[label] === url, `Official ${label} URL changed`);
  required(linkedBadges.some(([, href, image])=>href===url && attributes(image).alt?.trim()), `Missing accessible ${label} badge link`);
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
required(pictures.length === names.length + 4, 'Unexpected number of profile pictures');
required(pictures.some(picture => picture[1].includes('hero-architect-mobile.svg')), 'The main hero needs its mobile layout');
required(pictures.some(picture => /prefers-reduced-motion: reduce[^>]+github-jet-static\.svg/.test(picture[1])), 'The flying jet needs a static fallback');
required(pictures.some(picture => /prefers-reduced-motion: reduce[^>]+contribution-snake-static\.svg/.test(picture[1])), 'The contribution snake needs a static fallback');
const consolePair = pictures.find(picture => picture[1].includes('/console-pair.svg'));
required(consolePair?.[1].includes('/console-pair-mobile.svg') && consolePair[1].includes('/console-pair-mobile-static.svg') && consolePair[1].includes('/console-pair-static.svg'), 'The console pair needs mobile and reduced-motion artwork');
required((readme.match(/<h2><img\b/g) || []).length === 8, 'Keep all eight main profile sections');
for (const name of names) {
  const picture = pictures.find(match => new RegExp(`/${name}\\.svg`).test(match[1]));
  required(Boolean(picture), `Missing picture for ${name}`);
  if (!picture) continue;
  const images = [...picture[1].matchAll(/<img\b([^>]+)>/gi)].map(match => attributes(match[1]));
  const sources = [...picture[1].matchAll(/<source\b([^>]+)>/gi)].map(match => attributes(match[1]));
  required(images.length === 1 && images[0].alt?.trim().length >= 16, `${name} needs one image with meaningful alternative text`);
  required(sources.some(source => new RegExp(`max-width:\\s*${config.presentation.mobileBreakpoint}px`).test(source.media || '') && source.srcset?.includes(`${name}-mobile.svg`)), `${name} needs its configured mobile source`);
  required(sources.some(source => /prefers-reduced-motion:\s*reduce/.test(source.media || '') && source.srcset?.includes('/static/')), `${name} needs a reduced-motion static source`);
}
const visibleReadme = readme.replace(/<details\b[^>]*>[\s\S]*?<\/details>/gi, '');
for (const name of ['github-jet', 'contribution-snake']) {
  required(visibleReadme.includes(`/themes/main/assets/${name}.svg`), `${name} must be visible in the activity section`);
}
required(!/\bIn the studio\b|\/info-card\.svg|\/profile-motion\//i.test(readme), 'The README contains retired studio or About content');
const refs = new Set([
  ...[...readme.matchAll(/\b(?:src|href)\s*=\s*(["'])(.*?)\1/gi)].map(match => match[2]),
  ...[...readme.matchAll(/\bsrcset\s*=\s*(["'])(.*?)\1/gi)].flatMap(match => match[2].split(',').map(candidate => candidate.trim().split(/\s+/)[0])),
  ...[...readme.matchAll(/\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)].map(match => match[1]),
]);
for (let reference of refs) {
  if (/^(?:https?:|mailto:|#)/i.test(reference)) continue;
  reference = decodeURIComponent(reference.replace(/&amp;/g, '&').split(/[?#]/)[0]);
  const target = path.resolve(root, reference);
  required(target.startsWith(`${root}${path.sep}`), `Local reference escapes project: ${reference}`);
  try {
    const asset = await stat(target);
    required(asset.isFile() && asset.size > 0, `Local reference must be a nonempty file: ${reference}`);
  }
  catch { problems.push(`Broken local reference: ${reference}`); }
}
required(!/(?:github-readme-stats|streak-stats|readme-typing-svg|komarev\.com)/i.test(readme), 'Avoid external activity and typing widgets');
if (problems.length) {
  console.error(problems.map(problem => `FAIL ${problem}`).join('\n'));
  process.exitCode = 1;
} else console.log(`PASS profile configuration, eight sections, ${pictures.length} picture elements, official links, project links and local references.`);
