import { readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const heroSvgPath = path.join(root, 'themes/obsidian-architect/assets/architect-hero.svg');
let svg = await readFile(heroSvgPath, 'utf8');

const base64 = (await readFile(path.join(root, 'scripts/user_studio_creator_retina.base64.txt'), 'utf8')).trim();

// 1. Update hero-photo-grade to only fade the bottom 18% into obsidian ground
svg = svg.replace(
  /<linearGradient id="hero-photo-grade"[\s\S]*?<\/linearGradient>/,
  `<linearGradient id="hero-photo-grade" x1="0" y1="0" x2="0" y2="1">
      <stop offset=".80" stop-color="#10070C" stop-opacity="0"/>
      <stop offset=".92" stop-color="#10070C" stop-opacity=".45"/>
      <stop offset="1" stop-color="#10070C" stop-opacity=".85"/>
    </linearGradient>`
);

// 2. Replace the photo-arch contents with full vibrant color and obsidian backing
svg = svg.replace(
  /<g clip-path="url\(#hero-arch\)">[\s\S]*?<\/g>/,
  `<g clip-path="url(#hero-arch)">
        <rect x="847" y="84" width="236" height="296" fill="#10070C"/>
        <image href="data:image/jpeg;base64,${base64}" x="847" y="84" width="236" height="296" preserveAspectRatio="xMidYMin slice"/>
        <rect x="847" y="84" width="236" height="296" fill="url(#hero-photo-grade)"/>
        <rect x="700" y="84" width="90" height="296" fill="url(#hero-photo-sheen)" transform="skewX(-14)">
          <animate attributeName="x" values="700;1260;1260" keyTimes="0;.3;1" dur="9s" begin="3.5s" repeatCount="indefinite"/>
        </rect>
      </g>`
);

await writeFile(heroSvgPath, svg, 'utf8');
console.log('Successfully updated architect-hero.svg with new creator studio portrait!');

// Also update site portfolio assets
const siteImgDir = path.join(root, 'themes/obsidian-architect/site/assets/img');
await copyFile(
  path.join(root, 'assets/user-studio-creator-portrait.jpg'),
  path.join(siteImgDir, 'ashutosh-portrait.jpg')
);
await copyFile(
  path.join(root, 'assets/user-studio-creator-portrait.jpg'),
  path.join(siteImgDir, 'ashutosh-portrait-640.jpg')
);
spawnSync('sips', ['--resampleWidth', '640', path.join(siteImgDir, 'ashutosh-portrait-640.jpg')]);
console.log('Successfully updated obsidian-architect site images!');
