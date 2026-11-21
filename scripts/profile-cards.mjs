import { renderDotPortrait } from './profile-portrait.mjs';

const xml = value => String(value).replace(/[&<>]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]);
const quote = value => `'${value.replaceAll("'", "\\'")}'`;

const wine = {
  base: '#10070C',
  surface: '#190B12',
  border: '#54253A',
  accent: '#C77B9B',
  muted: '#E5B5C7',
  text: '#F8F0F3',
};

const desktop = { width: 584, height: 354, margin: 34, size: 22 };
const stacked = { width: 440, height: 314, margin: 26, size: 17 };

const fonts = `
  .sans { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; }
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
  .serif { font-family: Georgia, "Times New Roman", serif; }
`;

function motionStyles(lines) {
  return `
  .code-line { transform-box: fill-box; }
  ${lines.map((line, index) => {
    const length = line.map(([token]) => token).join('').length;
    const delay = (0.12 + index * 0.33).toFixed(2);
    return `.source-${index + 1} { animation: type-code .36s steps(${length}) ${delay}s both; }`;
  }).join('\n  ')}
  .code-caret { animation: settle-caret .58s ease-out 2.05s both; }
  @keyframes type-code { from { clip-path: inset(0 100% -4px 0); } to { clip-path: inset(0 -4px -4px 0); } }
  @keyframes settle-caret { from { opacity: 0; } 35% { opacity: 1; } to { opacity: .55; } }
  @media (prefers-reduced-motion: reduce) { .code-line, .code-caret { animation: none; } }
`;
}

function engineeringStack(c) {
  return {
    ui: c.technology.primary.filter(name => ['Angular', 'TypeScript'].includes(name)),
    state: c.technology.primary.filter(name => ['RxJS', 'NgRx'].includes(name)),
  };
}

function engineeringLines(c) {
  const { ui, state } = engineeringStack(c);
  const { focus, research } = c.profileCards;
  return [
    [['const', wine.accent], [' engineering = {', wine.text]],
    [['  focus: ', wine.text], [quote(focus.toLowerCase()), wine.muted], [',', wine.text]],
    [['  ui: [', wine.text], [ui.map(quote).join(', '), wine.muted], ['],', wine.text]],
    [['  state: [', wine.text], [state.map(quote).join(', '), wine.muted], ['],', wine.text]],
    [['  research: ', wine.text], [quote(research), wine.muted], [',', wine.text]],
    [['}', wine.text], [' as const', wine.accent], [';', wine.text]],
  ];
}

function details(c) {
  return [
    ['Design', c.capabilities[0].detail],
    ['Delivery', c.profileCards.delivery],
    ['Community', c.worldgyan.role],
  ];
}

function terminalAlt(c) {
  const { ui, state } = engineeringStack(c);
  return `Dot portrait of ${c.identity.name} alongside a TypeScript summary of his ${c.profileCards.focus.toLowerCase()} work with ${[...ui, ...state].join(', ')} and his research in ${c.profileCards.research}.`;
}

function infoAlt(c) {
  return `${c.identity.name}, ${c.profileCards.role}. ${details(c).map(([, value]) => value).join('. ')}.`;
}

export function profileCardsAlt(c) {
  return `${terminalAlt(c)} ${infoAlt(c)}`;
}

function cardSurface({ width, height }, terminal) {
  const panel = terminal ? 'terminal' : 'info';
  return `<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="20" fill="url(#${panel}-surface)" stroke="${wine.border}"/>
  <path d="M1 61H${width - 1}" stroke="${wine.border}"/>`;
}

const terminalHeight = layout => layout.height + (layout === stacked ? 110 : 0);

function terminalPanel(c, layout, staticAsset) {
  const { width, margin } = layout;
  const mobile = layout === stacked;
  const height = terminalHeight(layout);
  const size = mobile ? layout.size : 18;
  const lines = engineeringLines(c);
  const lineStep = mobile ? 34 : 39;
  const lineX = margin + 34;
  const startY = mobile ? 223 : 110;
  const endY = startY + (lines.length - 1) * lineStep;
  const code = lines.map((line, index) => {
    const number = index + 1;
    const y = startY + index * lineStep;
    return `<text x="${margin}" y="${y}" class="mono" font-size="14" fill="${wine.accent}">0${number}</text>
    <text x="${lineX}" y="${y}" xml:space="preserve" class="mono code-line source-${number}" font-size="${size}">${line.map(([token, color]) => `<tspan fill="${color}">${xml(token)}</tspan>`).join('')}</text>`;
  }).join('\n    ');
  const portrait = mobile ? `
    <text x="${margin}" y="119" class="serif" font-size="25" fill="${wine.text}">${xml(c.identity.name)}</text>
    <text x="${margin}" y="148" class="sans" font-size="17" fill="${wine.muted}">${xml(c.profileCards.focus)}</text>
    ${renderDotPortrait(323, 82, 2.36)}
    <path d="M${margin} 191H${width - margin}" stroke="${wine.border}"/>` : `
    <rect x="443" y="93" width="111" height="145" rx="10" fill="none" stroke="${wine.border}"/>
    ${renderDotPortrait(453, 102, 2.94)}`;
  return `${cardSurface({ width, height }, true)}
  <g aria-hidden="true">
    <circle cx="${margin + 4}" cy="31" r="4" fill="${wine.accent}"/>
    <circle cx="${margin + 19}" cy="31" r="4" fill="${wine.muted}" opacity=".58"/>
    <circle cx="${margin + 34}" cy="31" r="4" fill="${wine.accent}" opacity=".38"/>
    <text x="${margin + 56}" y="37" class="mono" font-size="16" fill="${wine.muted}">engineering.ts</text>${portrait}
    <path d="M${lineX - 11} ${startY - 24}V${height - 24}" stroke="${wine.border}"/>
    ${code}${staticAsset ? '' : `
    <rect class="code-caret" x="${lineX + 7.2 * size}" y="${endY - size + 3}" width="2" height="${size}" rx="1" fill="${wine.accent}" opacity=".55"/>`}
  </g>`;
}

function infoPanel(c, layout) {
  const { width, margin, size } = layout;
  const mobile = layout === stacked;
  const detailX = margin + (mobile ? 112 : 130);
  const dividerY = mobile ? 157 : 176;
  const gap = mobile ? 45 : 49;
  const rows = details(c).map(([label, value], index) => {
    const y = dividerY + 34 + index * gap;
    return `<text x="${margin}" y="${y}" class="mono" font-size="${size - 2}" fill="${wine.accent}">${xml(label)}</text>
    <text x="${detailX}" y="${y}" class="sans" font-size="${size}" font-weight="500" fill="${wine.text}">${xml(value)}</text>`;
  }).join('\n    ');
  return `${cardSurface(layout, false)}
  <g aria-hidden="true">
    <path d="M${margin} 28l7-7 7 7-7 7Z" fill="none" stroke="${wine.accent}" stroke-width="1.5"/>
    <path d="M${margin + 7} 39h7" stroke="${wine.accent}" stroke-width="1.5" stroke-linecap="round"/>
    <text x="${margin + 27}" y="36" class="mono" font-size="16" fill="${wine.muted}">Profile brief</text>
    <text x="${margin}" y="${mobile ? 107 : 118}" class="serif" font-size="${mobile ? 33 : 43}" fill="${wine.text}">${xml(c.identity.name)}</text>
    <text x="${margin}" y="${mobile ? 136 : 150}" class="sans" font-size="${size}" font-weight="600" fill="${wine.muted}">${xml(c.profileCards.role)}</text>
    <path d="M${margin} ${dividerY}H${width - margin}" stroke="${wine.border}"/>
    ${rows}
  </g>`;
}

function svg({ width, height, title, description, body, animation = '' }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">${xml(title)}</title>
  <desc id="desc">${xml(description)}</desc>
  <defs>
    <linearGradient id="terminal-surface" x2=".75" y2="1">
      <stop stop-color="${wine.surface}"/>
      <stop offset="1" stop-color="${wine.base}"/>
    </linearGradient>
    <radialGradient id="info-surface" cx="100%" cy="0%" r="92%">
      <stop stop-color="#321224"/>
      <stop offset=".56" stop-color="${wine.surface}"/>
      <stop offset="1" stop-color="${wine.base}"/>
    </radialGradient>
  </defs>
  <style>${fonts}${animation}</style>
  ${body}
</svg>
`;
}

export function renderProfileCards(c, { mobile = false, staticAsset = false } = {}) {
  const layout = mobile ? stacked : desktop;
  const gap = mobile ? 18 : 32;
  const x = mobile ? 0 : layout.width + gap;
  const y = mobile ? terminalHeight(layout) + gap : 0;
  return svg({
    width: x + layout.width,
    height: y + layout.height,
    title: `Engineering profile of ${c.identity.name}`,
    description: profileCardsAlt(c),
    body: `${terminalPanel(c, layout, staticAsset)}\n  <g transform="translate(${x} ${y})">${infoPanel(c, layout)}</g>`,
    animation: staticAsset ? '' : motionStyles(engineeringLines(c)),
  });
}

export function renderTerminalCard(c, { staticAsset = false } = {}) {
  return svg({
    width: desktop.width,
    height: terminalHeight(desktop),
    title: 'Engineering TypeScript profile',
    description: terminalAlt(c),
    body: terminalPanel(c, desktop, staticAsset),
    animation: staticAsset ? '' : motionStyles(engineeringLines(c)),
  });
}

export function renderInfoCard(c) {
  return svg({
    width: desktop.width,
    height: desktop.height,
    title: `Profile brief of ${c.identity.name}`,
    description: infoAlt(c),
    body: infoPanel(c, desktop),
  });
}
