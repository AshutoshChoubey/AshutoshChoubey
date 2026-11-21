import rows from '../data/character-portrait.json' with { type: 'json' };

const colors = {
  '~': '#674253',
  '-': '#8B536C',
  '+': '#A86583',
  '=': '#C77B9B',
  '*': '#DA91AF',
  '#': '#E5B5C7',
  '%': '#F2CCDA',
  '@': '#F8E4EC',
  ' ': '#10070C',
};
const cellWidth = 7.4;
const cellHeight = 9.65;

export const characterPortraitAlt = 'ASCII character portrait of Ashutosh Kumar Choubey seated, drawn with asterisks, hash signs, and other coding symbols.';

const reveal = `
    .characters { animation: decode-portrait 1.25s ease-out both; }
    @keyframes decode-portrait { from { opacity: .28; } to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .characters { animation: none; } }`;

function portraitRows() {
  const columns = Math.max(...rows.map(row => row.length));
  const width = columns * cellWidth;
  const left = (672 - width) / 2;
  return rows.map((row, index) => {
    const y = 85 + index * cellHeight;
    const characters = row.padEnd(columns).match(/(.)\1*/g).map(run => `<tspan fill="${colors[run[0]]}">${run}</tspan>`).join('');
    return `<text x="${left.toFixed(2)}" y="${y.toFixed(2)}" textLength="${width.toFixed(2)}" lengthAdjust="spacingAndGlyphs" xml:space="preserve">${characters}</text>`;
  }).join('\n    ');
}

export function renderCharacterPortrait({ mobile = false, staticAsset = false } = {}) {
  const width = mobile ? 672 : 400;
  const height = mobile ? 432 : 257;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 672 432" width="${width}" height="${height}" role="img" aria-labelledby="title desc">
  <title id="title">portrait.ascii</title>
  <desc id="desc">${characterPortraitAlt}</desc>
  <defs>
    <linearGradient id="surface" x2=".75" y2="1"><stop stop-color="#190B12"/><stop offset="1" stop-color="#10070C"/></linearGradient>
    <radialGradient id="portrait-halo" cx="48%" cy="58%" r="58%"><stop stop-color="#3E1E30" stop-opacity=".42"/><stop offset="1" stop-color="#190B12" stop-opacity="0"/></radialGradient>
  </defs>
  <style>text { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }${staticAsset ? '' : reveal}</style>
  <rect x=".5" y=".5" width="671" height="431" rx="18" fill="url(#surface)"/>
  <rect x=".5" y=".5" width="671" height="431" rx="18" fill="url(#portrait-halo)" stroke="#54253A"/>
  <path d="M1 64 H671" stroke="#54253A"/>
  <circle cx="36" cy="32" r="4" fill="#C77B9B"/>
  <circle cx="52" cy="32" r="4" fill="#C77B9B" opacity=".58"/>
  <circle cx="68" cy="32" r="4" fill="#C77B9B" opacity=".36"/>
  <text x="97" y="38" fill="#E5B5C7" font-size="19">portrait.ascii</text>
  <g class="characters" font-size="13.1" font-weight="600" aria-hidden="true">
    ${portraitRows()}
  </g>
</svg>
`;
}
