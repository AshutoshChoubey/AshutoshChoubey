const foreground = '#F8F0F3';
const ink = '#E5B5C7';
const accent = '#C77B9B';
const border = '#54253A';
const xml = value => String(value).replace(/[&<>]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[character]);
const quote = value => `'${value.replaceAll("'", "\\'")}'`;

function terminalContent(config) {
  const { primary } = config.technology;
  const ui = primary.filter(name => ['Angular', 'TypeScript'].includes(name));
  const state = primary.filter(name => ['RxJS', 'NgRx'].includes(name));
  return { ...config.engineeringTerminal, ui, state };
}

export function terminalAlt(config) {
  const { focus, ui, state, research } = terminalContent(config);
  return `Ashutosh's engineering.ts. Focus areas include ${focus.join(' and ')}. Frontend stack includes ${[...ui, ...state].join(', ')}. Research includes ${research}.`;
}

function codeLines({ focus, ui, state, research }) {
  return [
    [['const', accent], [' engineering = {', foreground]],
    [['  focus: [', foreground]],
    ...focus.map(area => [['    ', foreground], [quote(area.toLowerCase()), ink], [',', foreground]]),
    [['  ],', foreground]],
    [['  ui: [', foreground], [ui.map(quote).join(', '), ink], ['],', foreground]],
    [['  state: [', foreground], [state.map(quote).join(', '), ink], ['],', foreground]],
    [['  research: ', foreground], [quote(research), ink], [',', foreground]],
    [['}', foreground], [' as const', accent], [';', foreground]],
  ];
}

function motionStyles(lines) {
  const declarations = lines.map((line, index) => {
    const columns = line.map(([token]) => token).join('').length;
    const delay = (0.10 + index * 0.25).toFixed(2);
    return `.source-${index + 1} { animation: type-line .32s steps(${columns}) ${delay}s both; }`;
  });
  return `
    ${declarations.join('\n    ')}
    @keyframes type-line { from { clip-path: inset(-3px 100% -4px 0); } to { clip-path: inset(-3px -3px -4px 0); } }
    @media (prefers-reduced-motion: reduce) { .code-line { animation: none; } }`;
}

export function renderTerminalCard(config, { mobile = false, staticAsset = false } = {}) {
  // Keep both code panels the same aspect ratio as the studio's seated portrait.
  const viewWidth = mobile ? 448 : 672;
  const viewHeight = mobile ? 288 : 432;
  const width = mobile ? 672 : 400;
  const height = mobile ? 432 : 257;
  const left = mobile ? 17 : 33;
  const codeX = mobile ? 51 : 82;
  const font = mobile ? 17 : 26;
  const header = mobile ? 44 : 64;
  const firstLine = mobile ? 74 : 111;
  const lineHeight = mobile ? 23 : 34;
  const lines = codeLines(terminalContent(config));
  const body = lines.map((line, index) => {
    const number = index + 1;
    const y = firstLine + lineHeight * index;
    return `<text x="${left}" y="${y}" fill="${accent}" font-size="${mobile ? 11 : 16}">${String(number).padStart(2, '0')}</text>
  <text x="${codeX}" y="${y}" class="code-line source-${number}" xml:space="preserve" font-size="${font}">${line.map(([token, color]) => `<tspan fill="${color}">${xml(token)}</tspan>`).join('')}</text>`;
  }).join('\n  ');
  const corner = mobile ? 12 : 18;
  const dotStep = mobile ? 10 : 16;
  const dots = [1, 0.58, 0.36].map((opacity, index) => `<circle cx="${left + 3 + dotStep * index}" cy="${header / 2}" r="${mobile ? 2.5 : 4}" fill="${accent}" opacity="${opacity}"/>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewWidth} ${viewHeight}" width="${width}" height="${height}" role="img" aria-labelledby="title desc">
  <title id="title">engineering.ts</title>
  <desc id="desc">${xml(terminalAlt(config))}</desc>
  <defs><linearGradient id="surface" x2=".75" y2="1"><stop stop-color="#190B12"/><stop offset="1" stop-color="#10070C"/></linearGradient></defs>
  <style>text { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }${staticAsset ? '' : motionStyles(lines)}</style>
  <rect x=".5" y=".5" width="${viewWidth - 1}" height="${viewHeight - 1}" rx="${corner}" fill="url(#surface)" stroke="${border}"/>
  <path d="M1 ${header} H${viewWidth - 1} M${codeX - (mobile ? 9 : 15)} ${firstLine - font} V${viewHeight - left}" stroke="${border}"/>
  ${dots}
  <text x="${left + dotStep * 4}" y="${header / 2 + (mobile ? 4 : 6)}" fill="${ink}" font-size="${mobile ? 13 : 19}">engineering.ts</text>
  ${body}
</svg>
`;
}
