import rows from '../data/character-portrait.json' with { type: 'json' };

const artWidth = 628;
const artHeight = 318;
const fontSize = (artWidth / rows[0].length / .60).toFixed(2);
const redrawCycle = '16s';

export const characterPortraitAlt = 'ASCII character portrait of Ashutosh Kumar Choubey seated, drawn with asterisks, hash signs, and other coding symbols.';

const reveal = `
    .characters { animation: clear-portrait ${redrawCycle} ease-in-out infinite; }
    .characters text { animation: write-portrait ${redrawCycle} steps(28) infinite; }
    .characters text:nth-child(even) { animation: write-alternate-rows ${redrawCycle} steps(28) infinite; }
    @keyframes write-portrait {
      0%, 1% { clip-path: inset(-4px 100% -4px 0); }
      13%, 100% { clip-path: inset(-4px); }
    }
    @keyframes write-alternate-rows {
      0%, 2.5% { clip-path: inset(-4px 100% -4px 0); }
      14.5%, 100% { clip-path: inset(-4px); }
    }
    @keyframes clear-portrait {
      0%, 95% { opacity: 1; }
      99.5%, 100% { opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .characters, .characters text, .characters text:nth-child(even) { animation: none; }
    }`;

function portraitRows() {
  return rows.map((row, index) => {
    const y = 75 + index * artHeight / rows.length;
    return `<text x="22" y="${y.toFixed(2)}" textLength="${artWidth}" lengthAdjust="spacingAndGlyphs" xml:space="preserve">${row}</text>`;
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
    <linearGradient id="surface" x2="0" y2="1"><stop stop-color="#190B12"/><stop offset="1" stop-color="#10070C"/></linearGradient>
  </defs>
  <style>text { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }${staticAsset ? '' : reveal}</style>
  <rect x=".5" y=".5" width="671" height="431" rx="18" fill="url(#surface)" stroke="#54253A"/>
  <path d="M1 57 H671 M1 400 H671" stroke="#54253A"/>
  <circle cx="36" cy="29" r="4" fill="#C77B9B"/>
  <circle cx="52" cy="29" r="4" fill="#C77B9B" opacity=".58"/>
  <circle cx="68" cy="29" r="4" fill="#C77B9B" opacity=".36"/>
  <text x="336" y="35" fill="#E5B5C7" font-size="18" text-anchor="middle">./portrait.sh</text>
  <g class="characters" fill="#F5EEF2" font-size="${fontSize}" font-weight="500" aria-hidden="true">
    ${portraitRows()}
  </g>
  <text x="22" y="420" fill="#D9AFBF" font-size="15" xml:space="preserve">$ whoami  <tspan fill="#F9EFF2">Ashutosh Kumar Choubey</tspan></text>
</svg>
`;
}
