import { readFile } from 'node:fs/promises';

export const languageLogin = 'AshutoshChoubey';
export const languageSnapshot = new URL('../data/github-languages.json', import.meta.url);
export const languageSource = `https://api.github.com/users/${languageLogin}/repos?type=owner`;

const palette = {
  dark: '#10070C', panel: '#190B12', inset: '#150910', border: '#542039',
  heading: '#F8F0F3', detail: '#E5B5C7', accent: '#FFC8DE', selected: '#381727',
  slices: ['#E9A6C2', '#9F648F', '#D25785', '#BD92C1', '#E17767', '#8369A5', '#6E475C'],
};
const dateFormat = new Intl.DateTimeFormat('en', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata',
});
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function validateLanguageSnapshot(snapshot) {
  if (snapshot.login !== languageLogin || snapshot.source !== languageSource ||
      !Number.isFinite(Date.parse(snapshot.fetchedAt))) {
    throw new Error('Expected a public GitHub language snapshot for AshutoshChoubey.');
  }
  if (!Number.isSafeInteger(snapshot.repositoryCount) || snapshot.repositoryCount < 1 ||
      !Array.isArray(snapshot.languages) || snapshot.languages.length < 1) {
    throw new Error('Expected at least one active, owned public repository.');
  }
  const seen = new Set();
  let total = 0;
  for (const { name, count } of snapshot.languages) {
    if ((name !== null && (typeof name !== 'string' || !name.trim() || name.trim() !== name)) ||
        seen.has(name) || !Number.isSafeInteger(count) || count < 1) {
      throw new Error('Invalid or duplicate primary-language count.');
    }
    seen.add(name);
    total += count;
  }
  if (total !== snapshot.repositoryCount || (seen.size === 1 && seen.has(null))) {
    throw new Error('Expected classified language counts and a complete repository total.');
  }
}

function summarize(snapshot) {
  const languages = snapshot.languages.filter(({ name }) => name !== null).sort((first, second) => {
    return Number(second.name === 'JavaScript') - Number(first.name === 'JavaScript') ||
      second.count - first.count || first.name.localeCompare(second.name, 'en');
  });
  const unclassified = snapshot.languages.find(({ name }) => name === null)?.count ?? 0;
  const classified = snapshot.repositoryCount - unclassified;
  const slots = palette.slices.length;
  if (languages.length > slots) {
    const remaining = languages.splice(slots - 1);
    languages.push({ name: 'Other languages', count: remaining.reduce((total, entry) => total + entry.count, 0) });
  }
  let start = 0;
  const slices = languages.map(({ name, count }, index) => {
    const size = 100 * count / classified;
    const slice = { name, count, start, size, color: palette.slices[index] };
    start += size;
    return slice;
  });
  const capturedDate = dateFormat.format(new Date(snapshot.fetchedAt));
  const distribution = slices.map(({ name, count }) => `${name} ${count}`).join(', ');
  const description = `GitHub primary languages reported for ${classified} of ${snapshot.repositoryCount} owned public repositories as of ${capturedDate}. ${distribution}. Forks and archived repositories are excluded.`;
  return { classified, repositoryCount: snapshot.repositoryCount, capturedDate, slices, description };
}

function text(x, y, value, size, options = {}) {
  const { color = palette.detail, family = 'sans', align = 'start', weight = 400 } = options;
  return `<text x="${x}" y="${y}" class="${family}" font-size="${size}" fill="${color}" text-anchor="${align}" font-weight="${weight}">${escape(value)}</text>`;
}

function arc(slice, x, y, radius, width, color) {
  return `<circle cx="${x}" cy="${y}" r="${radius}" fill="none" stroke="${color}" stroke-width="${width}" pathLength="100" stroke-dasharray="${slice.size.toFixed(5)} ${(100 - slice.size).toFixed(5)}" stroke-dashoffset="${(-slice.start).toFixed(5)}" transform="rotate(-90 ${x} ${y})"/>`;
}

function highlightStyles(count) {
  const duration = Math.max(4, count * 2);
  const interval = 100 / count;
  const fade = Math.min(interval / 3, 2);
  const percent = value => `${Number(value.toFixed(3))}%`;
  const styles = Array.from({ length: count }, (_, index) => {
    const start = index * interval;
    const end = (index + 1) * interval;
    const on = index === 0 ? '0%' : percent(start + fade);
    const off = index === count - 1 ? '100%' : `${percent(end)},100%`;
    const initial = index === 0 ? '' : `0%,${percent(start)}{opacity:0}`;
    return `.language-${index}{animation:language-${index} ${duration}s ease infinite}\n` +
      `@keyframes language-${index}{${initial}${on},${percent(end - fade)}{opacity:1}${off}{opacity:0}}`;
  });
  return `${styles.join('\n')}\n@media(prefers-reduced-motion:reduce){.highlight{animation:none}}`;
}

function ring(summary, x, y, mobile, animated) {
  const radius = mobile ? 64 : 90;
  const thickness = mobile ? 27 : 37;
  const slices = summary.slices.map((slice, index) => {
    const base = arc(slice, x, y, radius, thickness, slice.color);
    const glow = arc(slice, x, y, radius + thickness / 2 + 2, 2, palette.accent);
    return `${base}${animated ? `<g class="highlight language-${index}">${glow}</g>` : ''}`;
  });
  return `${slices.join('\n')}
${text(x, y + 6, summary.classified, mobile ? 33 : 43, { align: 'middle', color: palette.heading, family: 'serif', weight: 600 })}
${text(x, y + (mobile ? 26 : 31), 'repositories', mobile ? 13 : 15, { align: 'middle' })}`;
}

function legend(summary, mobile, animated) {
  const slots = Math.ceil(summary.slices.length / 2);
  const width = mobile ? 183 : 337;
  const height = mobile ? 31 : 40;
  const separation = mobile ? 8 : 12;
  return summary.slices.map((slice, index) => {
    const x = (mobile ? 22 : 472) + (width + separation) * Math.floor(index / slots);
    const y = (mobile ? 277 : 123) + (height + separation) * (index % slots);
    const selected = animated ? `<rect class="highlight language-${index}" x="${x}" y="${y}" width="${width}" height="${height}" rx="6" fill="${palette.selected}" stroke="${slice.color}"/>` : '';
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="6" fill="${palette.inset}" stroke="${palette.border}"/>
${selected}
<circle cx="${x + 14}" cy="${y + height / 2}" r="${mobile ? 4 : 5}" fill="${slice.color}"/>
${text(x + 26, y + height / 2 + 5, slice.name, mobile ? 14 : 16, { color: palette.heading })}
${text(x + width - 13, y + height / 2 + 5, slice.count, mobile ? 14 : 16, { align: 'end', weight: 600 })}`;
  }).join('\n');
}

function render(summary, mobile, animated) {
  const width = mobile ? 420 : 1200;
  const mobileRows = Math.ceil(summary.slices.length / 2);
  const height = mobile ? 332 + mobileRows * 39 : 383;
  const inset = mobile ? 22 : 44;
  const subtitle = mobile ? `${summary.classified} of ${summary.repositoryCount} public repositories classified` :
    `Primary languages in ${summary.classified} of ${summary.repositoryCount} owned public repositories`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="title desc">
<title id="title">Repository languages</title>
<desc id="desc">${escape(summary.description)}</desc>
<defs><linearGradient id="board" x2="1" y2="1"><stop stop-color="${palette.panel}"/><stop offset="1" stop-color="${palette.dark}"/></linearGradient></defs>
<style>
.sans{font-family:system-ui,Arial,sans-serif}.serif{font-family:Georgia,'Times New Roman',serif}
${animated ? `.highlight{opacity:0}\n${highlightStyles(summary.slices.length)}\n` : ''}</style>
<rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="18" fill="url(#board)" stroke="${palette.border}" stroke-width="2"/>
${text(inset, mobile ? 47 : 59, 'Repository languages', mobile ? 32 : 41, { color: palette.heading, family: 'serif' })}
${text(inset, mobile ? 73 : 89, subtitle, mobile ? 15 : 18)}
${ring(summary, mobile ? 210 : 244, mobile ? 170 : 214, mobile, animated)}
${legend(summary, mobile, animated)}
${text(inset, height - 28, `GitHub · ${summary.capturedDate} · forks and archives excluded`, mobile ? 13 : 15)}
</svg>\n`;
}

export async function buildLanguageChart() {
  const snapshot = JSON.parse(await readFile(languageSnapshot, 'utf8'));
  validateLanguageSnapshot(snapshot);
  const summary = summarize(snapshot);
  return {
    desktop: render(summary, false, true), mobile: render(summary, true, true),
    desktopStatic: render(summary, false, false), mobileStatic: render(summary, true, false), summary,
  };
}
