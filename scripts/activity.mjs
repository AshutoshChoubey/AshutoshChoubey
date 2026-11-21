import { readFile } from 'node:fs/promises';

export const activityLogin = 'AshutoshChoubey';
export const activitySnapshot = new URL('../data/github-activity.json', import.meta.url);

const dayMs = 86_400_000;
const dayCount = 365;
const palette = {
  dark: '#10070C', surface: '#190B12', inset: '#150910', border: '#542039', grid: '#3F1B2D',
  heading: '#F8F0F3', detail: '#E5B5C7', accent: '#C77B9B',
  heat: ['#2B1420', '#581A35', '#88274D', '#BB4F7B', '#E5B5C7']
};
const monthFormat = new Intl.DateTimeFormat('en', { timeZone: 'UTC', month: 'short' });
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

function summarize(snapshot, days) {
  let contributions = 0;
  let activeDays = 0;
  let longestStreak = 0;
  let streak = 0;
  for (const { count } of days) {
    contributions += count;
    if (count > 0) {
      activeDays++;
      streak++;
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 0;
    }
  }
  const startDate = days[0].date;
  const endDate = days.at(-1).date;
  const capturedDate = dateKey(snapshot.fetchedAt);
  const dateRange = `${dateFormat.format(Date.parse(startDate))} – ${dateFormat.format(Date.parse(endDate))}`;
  const description = `From ${dateFormat.format(Date.parse(startDate))} through ${dateFormat.format(Date.parse(endDate))}, GitHub displayed ${integerFormat.format(contributions)} contributions for @${activityLogin} across ${activeDays} active days. The longest streak was ${longestStreak} ${longestStreak === 1 ? 'day' : 'days'}. The calendar shows daily counts and the trend shows the latest 12 completed weeks.`;
  return { startDate, endDate, capturedDate, dateRange, contributions, activeDays, longestStreak, description };
}

function calendarWeeks(days) {
  const firstDay = Date.parse(days[0].date);
  const offset = new Date(firstDay).getUTCDay();
  const weeks = [];
  for (const [index, day] of days.entries()) {
    const position = index + offset;
    const column = Math.floor(position / 7);
    (weeks[column] ??= []).push({ ...day, row: position % 7 });
  }
  return weeks;
}

function recentWeeks(weeks, endDate, capturedDate) {
  // A Saturday observed on the snapshot day can still be in progress.
  const isComplete = new Date(`${endDate}T00:00:00Z`).getUTCDay() === 6 && endDate < capturedDate;
  const completeWeeks = isComplete ? weeks : weeks.slice(0, -1);
  return completeWeeks.slice(-12).map(days => ({
    start: days[0].date,
    end: days.at(-1).date,
    count: days.reduce((sum, day) => sum + day.count, 0)
  }));
}

function text(x, y, value, size, options = {}) {
  const { color = palette.detail, family = 'sans', align = 'start', weight = 400 } = options;
  return `<text x="${x}" y="${y}" class="${family}" font-size="${size}" fill="${color}" text-anchor="${align}" font-weight="${weight}">${escapeXml(value)}</text>`;
}

function panel(x, y, width, height) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="12" fill="${palette.inset}" stroke="${palette.border}"/>`;
}

function heatColor(count) {
  const ranges = [0, 4, 9, 19, Infinity];
  return palette.heat[ranges.findIndex(max => count <= max)];
}

const motionStyles = `
  .activity-metric { animation: activity-metric 14s ease-in-out var(--activity-delay) infinite; }
  .activity-week { animation: activity-week 14s ease-in-out var(--activity-delay) infinite; }
  .activity-trace { animation: activity-trace 14s ease-out 1.5s infinite; }
  .activity-point { animation: activity-point 14s ease-in-out var(--activity-delay) infinite; }
  @keyframes activity-metric {
    0%, 10%, 100% { transform: translateY(0); }
    4% { transform: translateY(-4px); }
  }
  @keyframes activity-week {
    0%, 11%, 100% { transform: translateY(0); filter: none; }
    4% { transform: translateY(-1.8px); filter: brightness(1.25); }
  }
  @keyframes activity-trace {
    0% { stroke-dashoffset: 100; opacity: .88; }
    25% { stroke-dashoffset: 0; opacity: .88; }
    39%, 100% { stroke-dashoffset: 0; opacity: 0; }
  }
  @keyframes activity-point {
    0%, 12%, 100% { r: 3.5px; }
    5% { r: 5px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .activity-metric, .activity-week, .activity-trace, .activity-point { animation: none; }
  }`;

const motionAttributes = (name, delay) => ` class="${name}" style="--activity-delay: ${delay.toFixed(2)}s"`;

function calendar(weeks, x, y, step, verticalStep, cell, labelSize, { animated, weekOffset = 0 }) {
  const days = [['Mon', 1], ['Wed', 3], ['Fri', 5]];
  const dayLabels = days.map(([label, row]) => text(x - 8, y + row * verticalStep + cell, label, labelSize, { align: 'end' }));
  const monthLabels = [];
  const cells = [];
  const firstMonthStart = weeks.findIndex(week => week.some(({ date }) => date.endsWith('-01')));
  const showOpeningMonth = firstMonthStart === -1 || firstMonthStart >= 3;
  for (const [index, week] of weeks.entries()) {
    const left = x + index * step;
    const monthStart = week.find(({ date }) => date.endsWith('-01'));
    if (monthStart || (index === 0 && showOpeningMonth)) {
      const date = (monthStart ?? week[0]).date;
      monthLabels.push(text(left, y - 7, monthFormat.format(Date.parse(date)), labelSize));
    }
    const weekCells = week.map(({ date, count, row }) => {
      const label = `${dateFormat.format(Date.parse(date))}: ${count} ${count === 1 ? 'contribution' : 'contributions'}`;
      return `<rect x="${left}" y="${y + row * verticalStep}" width="${cell}" height="${cell}" rx="2" fill="${heatColor(count)}"><title>${label}</title></rect>`;
    }).join('\n');
    const delay = 1 + Math.floor((index + weekOffset) / 4) * .22;
    cells.push(animated ? `<g${motionAttributes('activity-week', delay)}>${weekCells}</g>` : weekCells);
  }
  return [...dayLabels, ...monthLabels, ...cells].join('\n');
}

function calendarLegend(x, y, size) {
  const bins = ['0', '1–4', '5–9', '10–19', '20+'];
  const offsets = [0, 38, 86, 135, 195];
  return bins.map((bin, index) => {
    const left = x + offsets[index];
    const cell = `<rect x="${left}" y="${y - 10}" width="11" height="11" rx="2" fill="${palette.heat[index]}"/>`;
    return `${cell}${text(left + 15, y, bin, size)}`;
  }).join('\n');
}

function weeklyTrend(weeks, x, y, width, height, labelSize, animated) {
  const desiredStep = Math.max(1, Math.max(...weeks.map(week => week.count)) / 3);
  const magnitude = 10 ** Math.floor(Math.log10(desiredStep));
  const tickStep = Math.ceil([1, 2, 2.5, 5, 10].find(value => value * magnitude >= desiredStep) * magnitude);
  const baseline = y + height;
  const maxTick = tickStep * 3;
  const leftAt = index => x + index * width / (weeks.length - 1);
  const topAt = count => baseline - height * count / maxTick;
  const grids = [0, 1, 2, 3].map(index => {
    const count = index * tickStep;
    const top = topAt(count);
    return `<path d="M${x} ${top}h${width}" stroke="${palette.grid}"/>${text(x - 8, top + 4, count, labelSize, { align: 'end' })}`;
  });
  const points = weeks.map((week, i) => `${leftAt(i).toFixed(2)} ${topAt(week.count).toFixed(2)}`);
  const path = `M${points.join('L')}`;
  const dots = weeks.map((week, index) => {
    const label = `${weekFormat.format(Date.parse(week.start))} – ${weekFormat.format(Date.parse(week.end))}: ${week.count} ${week.count === 1 ? 'contribution' : 'contributions'}`;
    const motion = animated ? motionAttributes('activity-point', 1.65 + index * .26) : '';
    return `<circle cx="${leftAt(index).toFixed(2)}" cy="${topAt(week.count).toFixed(2)}" r="3.5" fill="${palette.detail}"${motion}><title>${label}</title></circle>`;
  });
  const firstWeek = weekFormat.format(Date.parse(weeks[0].start));
  const lastWeek = weekFormat.format(Date.parse(weeks.at(-1).end));
  return `${grids.join('\n')}
<path d="M${x} ${baseline}L${points.join('L')}L${x + width} ${baseline}Z" fill="url(#trend-area)"/>
<path d="${path}" fill="none" stroke="${palette.accent}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
${animated ? `<path class="activity-trace" d="${path}" pathLength="100" fill="none" stroke="${palette.detail}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="100" opacity="0" aria-hidden="true"/>\n` : ''}${dots.join('\n')}
${text(x, baseline + 22, firstWeek, labelSize)}
${text(x + width, baseline + 22, lastWeek, labelSize, { align: 'end' })}`;
}

function renderDashboard(summary, weeks, trend, { mobile = false, animated = true } = {}) {
  const width = mobile ? 420 : 1200;
  const height = mobile ? 685 : 422;
  const metricX = mobile ? [20, 149, 278] : [36, 420, 804];
  const metricWidth = mobile ? 122 : 360;
  const metricY = mobile ? 105 : 93;
  const metricInset = mobile ? 12 : 20;
  const metrics = [
    ['Contributions', integerFormat.format(summary.contributions)],
    ['Active days', summary.activeDays],
    ['Longest streak', `${summary.longestStreak} ${summary.longestStreak === 1 ? 'day' : 'days'}`]
  ].map(([label, value], index) => {
    const number = text(metricX[index] + metricInset, metricY + 57, value, mobile ? 24 : 31, { color: palette.heading, weight: 600 });
    return `${panel(metricX[index], metricY, metricWidth, 73)}
${text(metricX[index] + metricInset, metricY + 25, label, mobile ? 14 : 17)}
${animated ? `<g${motionAttributes('activity-metric', .35 + index * .16)}>${number}</g>` : number}`;
  });

  const heading = mobile ? [
    text(20, 47, 'GitHub activity', 37, { color: palette.heading, family: 'serif' }),
    text(20, 79, summary.dateRange, 15)
  ] : [
    text(36, 55, 'GitHub activity', 43, { color: palette.heading, family: 'serif' }),
    text(1164, 36, `@${activityLogin}`, 17, { align: 'end', family: 'mono' }),
    text(1164, 64, summary.dateRange, 15, { align: 'end' })
  ];
  const calendarTitle = 'Daily contribution calendar';
  const trendTitle = 'Weekly contributions';
  const axesScope = '12 completed weeks';
  const panels = mobile ? [
    panel(20, 196, 380, 255),
    text(36, 225, calendarTitle, 20, { color: palette.heading, weight: 600 }),
    calendar(weeks.slice(0, 27), 65, 253, 11.8, 10.7, 9, 12, { animated }),
    calendar(weeks.slice(27), 65, 344, 11.8, 10.7, 9, 12, { animated, weekOffset: 27 }),
    calendarLegend(65, 435, 12),
    panel(20, 466, 380, 168),
    text(36, 495, trendTitle, 20, { color: palette.heading, weight: 600 }),
    text(383, 495, axesScope, 12, { align: 'end' }),
    weeklyTrend(trend, 66, 519, 309, 72, 12, animated),
    text(20, 656, 'GitHub profile calendar. Counts may include', 13),
    text(20, 673, 'anonymized private contributions.', 13)
  ] : [
    panel(36, 185, 690, 195),
    text(56, 221, calendarTitle, 23, { color: palette.heading, weight: 600 }),
    calendar(weeks, 95, 263, 11.4, 12, 9.5, 13, { animated }),
    calendarLegend(95, 360, 13),
    panel(742, 185, 422, 195),
    text(762, 221, trendTitle, 23, { color: palette.heading, weight: 600 }),
    text(1144, 220, axesScope, 13, { align: 'end' }),
    weeklyTrend(trend, 803, 260, 330, 66, 13, animated),
    text(36, 405, 'GitHub profile calendar. Counts may include anonymized private contributions.', 14)
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">GitHub activity for @${activityLogin}</title>
<desc id="desc">${escapeXml(summary.description)}</desc>
<defs>
  <linearGradient id="surface" x2="1" y2="1"><stop stop-color="${palette.surface}"/><stop offset="1" stop-color="${palette.dark}"/></linearGradient>
  <linearGradient id="trend-area" x2="0" y2="1"><stop stop-color="${palette.accent}" stop-opacity=".26"/><stop offset="1" stop-color="${palette.accent}" stop-opacity=".02"/></linearGradient>
</defs>
<style>
  .sans { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; }
  .serif { font-family: Georgia, 'Times New Roman', serif; }
  .mono { font-family: ui-monospace, Consolas, monospace; }${animated ? motionStyles : ''}
</style>
<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="16" fill="url(#surface)" stroke="${palette.border}"/>
${[...heading, ...metrics, ...panels].join('\n')}
</svg>
`;
}

export async function buildGitHubActivity() {
  const snapshot = JSON.parse(await readFile(activitySnapshot, 'utf8'));
  validateActivitySnapshot(snapshot);
  const days = snapshot.days.slice(-dayCount);
  const summary = summarize(snapshot, days);
  const weeks = calendarWeeks(days);
  const trend = recentWeeks(weeks, summary.endDate, summary.capturedDate);
  return {
    desktop: renderDashboard(summary, weeks, trend),
    mobile: renderDashboard(summary, weeks, trend, { mobile: true }),
    desktopStatic: renderDashboard(summary, weeks, trend, { animated: false }),
    mobileStatic: renderDashboard(summary, weeks, trend, { mobile: true, animated: false }),
    summary
  };
}
