import { mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { activityLogin, activitySnapshot, validateActivitySnapshot } from './activity.mjs';

const attributes = tag => Object.fromEntries(Array.from(tag.matchAll(/([\w-]+)="([^"]*)"/g), match => [match[1], match[2]]));

function parseCalendar(html) {
  const counts = new Map();
  for (const [, tag, label] of html.matchAll(/(<tool-tip\b[^>]*>)([^<]*)<\/tool-tip>/g)) {
    const target = attributes(tag).for;
    const numeric = label.trim().match(/^([\d,]+)\s+contributions?\b/i);
    if (target && numeric) counts.set(target, Number(numeric[1].replaceAll(',', '')));
    if (target && /^no contributions?\b/i.test(label.trim())) counts.set(target, 0);
  }

  const days = [];
  for (const [tag] of html.matchAll(/<td\b[^>]*>/g)) {
    const cell = attributes(tag);
    if (!cell.class?.split(/\s+/).includes('ContributionCalendar-day') || !cell['data-date']) continue;
    const count = counts.get(cell.id);
    if (count === undefined) throw new Error(`GitHub did not return a count for ${cell['data-date']}.`);
    days.push({ date: cell['data-date'], count, level: Number(cell['data-level']) });
  }
  return days.sort((first, second) => first.date.localeCompare(second.date));
}

async function refresh() {
  const response = await fetch(`https://github.com/users/${activityLogin}/contributions`, {
    headers: { 'Accept-Language': 'en-US', 'User-Agent': 'GitHub-profile-calendar-snapshot' },
    signal: AbortSignal.timeout(20_000)
  });
  if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}.`);

  const days = parseCalendar(await response.text());
  const fetchedAt = new Date().toISOString();
  const snapshot = {
    source: `github.com/${activityLogin}`,
    method: 'public GitHub contribution calendar',
    login: activityLogin,
    fetchedAt,
    total: days.reduce((sum, day) => sum + day.count, 0),
    days
  };
  validateActivitySnapshot(snapshot);
  if (Date.parse(fetchedAt) - Date.parse(days.at(-1).date) > 3 * 86_400_000) {
    throw new Error(`GitHub returned a stale calendar ending ${days.at(-1).date}.`);
  }

  const output = fileURLToPath(activitySnapshot);
  const tempDirectory = await mkdtemp(path.join(path.dirname(output), '.activity-'));
  const temporary = path.join(tempDirectory, 'contributions.json');
  try {
    await writeFile(temporary, `${JSON.stringify(snapshot)}\n`);
    await rename(temporary, output);
  } finally {
    await rm(tempDirectory, { recursive: true, force: true });
  }
  console.log(`Refreshed GitHub activity through ${days.at(-1).date}.`);
}

try {
  await refresh();
} catch (error) {
  console.error(`GitHub activity refresh failed. Existing snapshot retained. ${error.message}`);
  process.exitCode = 1;
}
