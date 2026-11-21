import { readFile } from 'node:fs/promises';

export const activityLogin = 'AshutoshChoubey';
export const activitySnapshot = new URL('../data/github-activity.json', import.meta.url);

const dayMs = 86_400_000;
const dayCount = 365;
const weekCount = 12;
const daysPerWeek = 7;
const palette = {
  dark: '#10070C', surface: '#190B12', border: '#542039', grid: '#3F1B2D',
  heading: '#F8F0F3', detail: '#E5B5C7', accent: '#C77B9B'
};
const weekFormat = new Intl.DateTimeFormat('en', { timeZone: 'UTC', month: 'short', day: 'numeric' });
const dateFormat = new Intl.DateTimeFormat('en', { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' });
const integerFormat = new Intl.NumberFormat('en-US');
const escapeXml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function dateKey(value) {
  return new Date(value).toISOString().slice(0, 10);
}

export function validateActivitySnapshot(snapshot) {
  if (snapshot.login !== activityLogin || snapshot.source !== `github.com/${activityLogin}` ||
      snapshot.method !== 'public GitHub contribution calendar' || !Number.isFinite(Date.parse(snapshot.fetchedAt))) {
    throw new Error('Expected an anonymous GitHub profile contribution snapshot for AshutoshChoubey.');
  }
  if (!Array.isArray(snapshot.days) || snapshot.days.length < dayCount || snapshot.days.length > dayCount + 7) {
    throw new Error('Expected a complete GitHub profile calendar.');
  }
  for (const [index, day] of snapshot.days.entries()) {
    const time = Date.parse(day.date);
    if (!Number.isFinite(time) || dateKey(time) !== day.date ||
        (index > 0 && time - Date.parse(snapshot.days[index - 1].date) !== dayMs) ||
        !Number.isSafeInteger(day.count) || day.count < 0 ||
        !Number.isInteger(day.level) || day.level < 0 || day.level > 4 || (day.count === 0) !== (day.level === 0)) {
      throw new Error(`Invalid or missing GitHub contribution day near ${day.date}.`);
    }
  }
  const last = snapshot.days.at(-1).date;
  if (last > dateKey(snapshot.fetchedAt) || snapshot.days.reduce((sum, day) => sum + day.count, 0) !== snapshot.total) {
    throw new Error('GitHub contribution snapshot dates or totals are inconsistent.');
  }
}

function completedWeeks(snapshot) {
  const lastDate = snapshot.days.at(-1).date;
  const captureDate = dateKey(snapshot.fetchedAt);
  const lastWeekday = new Date(lastDate).getUTCDay();
  // Saturday remains in progress if it is also the capture date.
  const lastDayIsCompleteSaturday = lastWeekday === 6 && lastDate < captureDate;
  const incompleteDays = lastDayIsCompleteSaturday ? 0 : lastWeekday + 1;
  const end = snapshot.days.length - incompleteDays;
  const days = snapshot.days.slice(end - weekCount * daysPerWeek, end);

  return Array.from({ length: weekCount }, (_, index) => {
    const first = index * daysPerWeek;
    const week = days.slice(first, first + daysPerWeek);
    return {
      start: week[0].date,
      end: week.at(-1).date,
      count: week.reduce((total, { count }) => total + count, 0)
    };
  });
}

function summarize(weeks) {
  const startDate = weeks[0].start;
  const endDate = weeks.at(-1).end;
  const first = new Date(startDate);
  const last = new Date(endDate);
  const dateRange = first.getUTCFullYear() === last.getUTCFullYear()
    ? `${weekFormat.format(first)} – ${dateFormat.format(last)}`
    : `${dateFormat.format(first)} – ${dateFormat.format(last)}`;
  const contributions = weeks.reduce((sum, week) => sum + week.count, 0);
  const values = weeks.map(week => integerFormat.format(week.count)).join(', ');
  const description = `Weekly GitHub contributions for @${activityLogin} from ${dateFormat.format(first)} through ${dateFormat.format(last)}. ${integerFormat.format(contributions)} contributions across ${weekCount} completed weeks. Weekly counts in chronological order: ${values}.`;
  return { startDate, endDate, dateRange, contributions, description };
}

function text(x, y, value, size, { color = palette.detail, family = 'sans', align = 'start' } = {}) {
  return `<text x="${x}" y="${y}" class="${family}" font-size="${size}" fill="${color}" text-anchor="${align}">${escapeXml(value)}</text>`;
}

function plot(weeks, { x, y, width, height, labelSize }) {
  const largest = Math.max(...weeks.map(week => week.count));
  const desiredStep = Math.max(1, largest / 3);
  const magnitude = 10 ** Math.floor(Math.log10(desiredStep));
  const step = Math.ceil([1, 2, 2.5, 5, 10].find(value => value * magnitude >= desiredStep) * magnitude);
  const baseline = y + height;
  const maxTick = step * 3;
  const leftAt = index => x + index * width / (weeks.length - 1);
  const topAt = count => baseline - height * count / maxTick;
  const points = weeks.map((week, index) => [leftAt(index).toFixed(2), topAt(week.count).toFixed(2)]);
  const line = `M${points.map(point => point.join(' ')).join('L')}`;

  const axis = [0, 1, 2, 3].map(index => {
    const tick = index * step;
    const top = topAt(tick);
    return `<path d="M${x} ${top}h${width}" stroke="${palette.grid}"/>
${text(x - 12, top + labelSize * .33, integerFormat.format(tick), labelSize, { align: 'end' })}`;
  });
  for (const index of [0, 3, 6, 9, weeks.length - 1]) {
    const align = index === 0 ? 'start' : index === weeks.length - 1 ? 'end' : 'middle';
    axis.push(text(leftAt(index), baseline + labelSize + 10, weekFormat.format(new Date(weeks[index].start)), labelSize, { align }));
  }

  const markers = points.map(([cx, cy], index) => {
    const { start, end, count } = weeks[index];
    const title = `${weekFormat.format(new Date(start))} – ${weekFormat.format(new Date(end))}: ${integerFormat.format(count)} ${count === 1 ? 'contribution' : 'contributions'}`;
    return `<circle cx="${cx}" cy="${cy}" r="3.6" fill="${palette.heading}" stroke="${palette.surface}" stroke-width="1.2"><title>${title}</title></circle>`;
  });
  const area = `${line}L${x + width} ${baseline}H${x}Z`;
  const series = [
    `<path d="${area}" fill="url(#trend-area)"/>`,
    `<path d="${line}" fill="none" stroke="url(#trend-line)" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"/>`,
    ...markers
  ];
  return { axis: axis.join('\n'), series: series.join('\n') };
}

const motion = `
  .trend-window { transform-box: fill-box; transform-origin: left; animation: grow-trend 11s linear infinite; }
  .trend-series { animation: hold-trend 11s linear infinite; }
  @keyframes grow-trend {
    0%, 5% { transform: scaleX(0); }
    42%, 100% { transform: scaleX(1); }
  }
  @keyframes hold-trend {
    0%, 90% { opacity: 1; }
    100% { opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .trend-window, .trend-series { animation: none; }
  }`;

function renderWeeklyChart(weeks, summary, { mobile = false, animated = true } = {}) {
  const width = mobile ? 420 : 1200;
  const height = mobile ? 302 : 352;
  const geometry = mobile
    ? { x: 54, y: 98, width: 340, height: 149, labelSize: 13 }
    : { x: 80, y: 102, width: 1076, height: 184, labelSize: 17 };
  const { x, y, width: plotWidth, height: plotHeight } = geometry;
  const { axis, series } = plot(weeks, geometry);
  const heading = text(mobile ? 24 : 40, mobile ? 43 : 54, 'Weekly contributions', mobile ? 29 : 40,
    { color: palette.heading, family: 'serif' });
  const range = `${weekCount} completed weeks · ${summary.dateRange}`;
  const subtitle = mobile
    ? text(25, 67, range, 14)
    : text(1156, 51, range, 19, { align: 'end' });
  const clip = animated
    ? `  <clipPath id="trend-reveal"><rect class="trend-window" x="${x - 6}" y="${y - 6}" width="${plotWidth + 12}" height="${plotHeight + 12}"/></clipPath>\n`
    : '';
  const chart = animated ? `<g class="trend-series" clip-path="url(#trend-reveal)">\n${series}\n</g>` : series;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">Weekly GitHub contributions for @${activityLogin}</title>
<desc id="desc">${escapeXml(summary.description)}</desc>
<defs>
  <linearGradient id="surface" x2="1" y2="1"><stop stop-color="${palette.surface}"/><stop offset="1" stop-color="${palette.dark}"/></linearGradient>
  <linearGradient id="trend-area" x2="0" y2="1"><stop stop-color="${palette.accent}" stop-opacity=".32"/><stop offset="1" stop-color="${palette.accent}" stop-opacity=".04"/></linearGradient>
  <linearGradient id="trend-line" x2="1" y2="0"><stop stop-color="${palette.accent}"/><stop offset="1" stop-color="${palette.detail}"/></linearGradient>
${clip}</defs>
<style>
  .sans { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; }
  .serif { font-family: Georgia, 'Times New Roman', serif; }${animated ? motion : ''}
</style>
<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="16" fill="url(#surface)" stroke="${palette.border}"/>
${heading}
${subtitle}
${axis}
${chart}
</svg>
`;
}

export async function buildGitHubActivity() {
  const snapshot = JSON.parse(await readFile(activitySnapshot, 'utf8'));
  validateActivitySnapshot(snapshot);
  const weeks = completedWeeks(snapshot);
  const summary = summarize(weeks);
  return {
    desktop: renderWeeklyChart(weeks, summary),
    mobile: renderWeeklyChart(weeks, summary, { mobile: true }),
    desktopStatic: renderWeeklyChart(weeks, summary, { animated: false }),
    mobileStatic: renderWeeklyChart(weeks, summary, { mobile: true, animated: false }),
    summary
  };
}
