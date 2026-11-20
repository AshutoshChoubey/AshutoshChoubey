import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export async function generateCyberTheme(customRoot) {
  const root = customRoot || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const outDir = path.join(root, 'themes/main/assets');
  await mkdir(outDir, { recursive: true });

  const photoBase64 = (await readFile(path.join(root, 'scripts/user_photo.base64.txt'), 'utf8')).trim();

// Shared SVG defs and styles for Cyber-Architect theme
const commonDefs = `
    <linearGradient id="cyber-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#060B17"/>
      <stop offset=".45" stop-color="#0B172E"/>
      <stop offset="1" stop-color="#050811"/>
    </linearGradient>
    <radialGradient id="cyber-glow-cyan" cx="80%" cy="25%" r="65%">
      <stop offset="0" stop-color="#00C9FF" stop-opacity=".22"/>
      <stop offset="1" stop-color="#00C9FF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cyber-glow-blue" cx="20%" cy="80%" r="55%">
      <stop offset="0" stop-color="#1E40AF" stop-opacity=".32"/>
      <stop offset="1" stop-color="#1E40AF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cyber-trace" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#34D399"/>
      <stop offset=".3" stop-color="#00C9FF"/>
      <stop offset=".7" stop-color="#38BDF8"/>
      <stop offset="1" stop-color="#F43F5E"/>
    </linearGradient>
    <pattern id="cyber-grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" fill="none" stroke="#38BDF8" stroke-opacity=".05" stroke-width="1"/>
    </pattern>
    <filter id="cyber-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3.5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
`;

const commonStyles = `
    .sans { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
    .serif { font-family: Georgia, "Iowan Old Style", "Palatino Linotype", "Times New Roman", serif; }
    .trace-anim { stroke-dasharray: 620 2700; stroke-dashoffset: 3320; animation: trace 6.5s linear infinite; }
    @keyframes trace { to { stroke-dashoffset: 0; } }
    @media (prefers-reduced-motion: reduce) { .trace-anim { display: none; } }
`;

// Floating lava sparks SVG snippet
function lavaSparks(w, h, seed = 0) {
  return `
    <!-- Floating Lava Sparks & Energetic Embers -->
    <g class="lava-sparks">
      <!-- Emerald Green Sparks -->
      <circle cx="${seed + 520}" cy="${h - 40}" r="2.2" fill="#34D399" filter="url(#cyber-glow)">
        <animate attributeName="cy" values="${h - 40};40" dur="4.6s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;.95;.0" dur="4.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${seed + 740}" cy="${h - 60}" r="1.6" fill="#34D399">
        <animate attributeName="cy" values="${h - 60};30" dur="5.8s" begin="1.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;.85;.0" dur="5.8s" begin="1.2s" repeatCount="indefinite"/>
      </circle>
      <!-- Ruby Red Sparks -->
      <circle cx="${seed + 640}" cy="${h - 30}" r="2" fill="#F43F5E" filter="url(#cyber-glow)">
        <animate attributeName="cy" values="${h - 30};50" dur="5.2s" begin="0.6s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;.9;.0" dur="5.2s" begin="0.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${seed + 1060}" cy="${h - 50}" r="1.8" fill="#F43F5E">
        <animate attributeName="cy" values="${h - 50};45" dur="6.1s" begin="2.1s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;.8;.0" dur="6.1s" begin="2.1s" repeatCount="indefinite"/>
      </circle>
      <!-- Electric Cyan Sparks -->
      <circle cx="${seed + 440}" cy="${h - 70}" r="1.8" fill="#00C9FF">
        <animate attributeName="cy" values="${h - 70};35" dur="4.9s" begin="1.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;.9;.0" dur="4.9s" begin="1.8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${seed + 880}" cy="${h - 35}" r="2.2" fill="#38BDF8" filter="url(#cyber-glow)">
        <animate attributeName="cy" values="${h - 35};60" dur="5.5s" begin="0.3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;.95;.0" dur="5.5s" begin="0.3s" repeatCount="indefinite"/>
      </circle>
      <!-- Golden Amber Sparks -->
      <circle cx="${seed + 800}" cy="${h - 45}" r="1.5" fill="#F59E0B">
        <animate attributeName="cy" values="${h - 45};55" dur="6.4s" begin="2.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;.75;.0" dur="6.4s" begin="2.8s" repeatCount="indefinite"/>
      </circle>
    </g>
  `;
}

// 1. HERO ARCHITECT SVG
const heroArchitectSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 480" width="1200" height="480" role="img" aria-labelledby="hero-t hero-d">
  <title id="hero-t">Ashutosh Kumar Choubey — Frontend Architect | System Design | AI Orchestration</title>
  <desc id="hero-d">Building scalable frontend systems. Exploring intelligent, agent-powered software. Founder, WorldGyan.</desc>
  <defs>
    ${commonDefs}
    <clipPath id="hero-clip"><rect width="1200" height="480" rx="20"/></clipPath>
    <clipPath id="hero-arch"><path d="M847 380 V202 A118 118 0 0 1 1083 202 V380 Z"/></clipPath>
    <linearGradient id="hero-name-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset=".45" stop-color="#E2E8F0"/>
      <stop offset=".8" stop-color="#73DEFF"/>
      <stop offset="1" stop-color="#38BDF8"/>
    </linearGradient>
    <linearGradient id="hero-photo-grade" x1="0" y1="0" x2="0" y2="1">
      <stop offset=".5" stop-color="#060B17" stop-opacity="0"/>
      <stop offset=".8" stop-color="#060B17" stop-opacity=".6"/>
      <stop offset="1" stop-color="#060B17" stop-opacity=".95"/>
    </linearGradient>
    <linearGradient id="hero-photo-wash" cx="50%" cy="30%" r="80%">
      <stop offset="0" stop-color="#E0F2FE"/>
      <stop offset=".5" stop-color="#7DD3FC"/>
      <stop offset="1" stop-color="#0284C7"/>
    </linearGradient>
    <linearGradient id="hero-photo-sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset=".5" stop-color="#FFFFFF" stop-opacity=".25"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="hero-frame-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#34D399"/>
      <stop offset=".5" stop-color="#00C9FF"/>
      <stop offset="1" stop-color="#F43F5E"/>
    </linearGradient>
    <linearGradient id="hero-scan" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#38BDF8" stop-opacity="0"/>
      <stop offset=".5" stop-color="#38BDF8" stop-opacity=".08"/>
      <stop offset="1" stop-color="#38BDF8" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <style>
    ${commonStyles}
    .hero-rise { animation: hero-rise 1.2s cubic-bezier(.16,1,.3,1) both; }
    .hero-fade { animation: hero-fade 1.5s cubic-bezier(.16,1,.3,1) both; }
    .hero-photo { animation: hero-photo 1.5s cubic-bezier(.16,1,.3,1) .35s both; }
    @keyframes hero-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes hero-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes hero-photo { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .hero-rise, .hero-fade, .hero-photo { animation: none; } }
  </style>
  <g clip-path="url(#hero-clip)">
    <!-- Base Deep Obsidian Canvas -->
    <rect width="1200" height="480" fill="url(#cyber-bg)"/>
    <!-- Slow Ambient Light Fields -->
    <ellipse cx="920" cy="160" rx="380" ry="260" fill="url(#cyber-glow-cyan)">
      <animateTransform attributeName="transform" type="translate" values="0 0; -40 25; 0 0" dur="20s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1; .45 0 .55 1"/>
    </ellipse>
    <ellipse cx="240" cy="420" rx="340" ry="200" fill="url(#cyber-glow-blue)">
      <animateTransform attributeName="transform" type="translate" values="0 0; 50 -20; 0 0" dur="24s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1; .45 0 .55 1"/>
    </ellipse>
    <!-- Technical Grid -->
    <rect width="1200" height="480" fill="url(#cyber-grid)"/>
    <!-- Sweeping Scan Line -->
    <rect x="0" y="-120" width="1200" height="120" fill="url(#hero-scan)">
      <animate attributeName="y" values="-120;480" dur="10s" begin="1s" repeatCount="indefinite"/>
    </rect>

    ${lavaSparks(1200, 480, 0)}

    <!-- Left Content Column -->
    <g class="hero-rise" style="animation-delay: 0.1s;">
      <!-- Terminal Pill Top-Left: ~/ashutosh $ build -scale-enterprise -->
      <g transform="translate(56 50)">
        <rect width="364" height="34" rx="17" fill="#0A1526" stroke="#1E3A5F" stroke-opacity=".8"/>
        <circle cx="18" cy="17" r="4.5" fill="#34D399" filter="url(#cyber-glow)">
          <animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <text class="mono" x="32" y="22" font-size="12" font-weight="600" fill="#94A3B8"><tspan fill="#34D399">~/ashutosh</tspan> $ build <tspan fill="#38BDF8">--scale-enterprise</tspan></text>
      </g>

      <!-- Main Name Heading -->
      <text class="sans" x="54" y="146" font-size="50" font-weight="800" letter-spacing="-0.5" fill="url(#hero-name-grad)">Ashutosh Kumar Choubey</text>

      <!-- Subtitle -->
      <text class="sans" x="56" y="186" font-size="19" font-weight="600" fill="#E2E8F0">Frontend Architect <tspan fill="#34D399">·</tspan> System Design <tspan fill="#38BDF8">·</tspan> AI Orchestration</text>

      <!-- Positioning -->
      <text class="sans" x="56" y="222" font-size="15" fill="#94A3B8">Building scalable frontend systems. Exploring intelligent, agent-powered software.</text>
      <text class="mono" x="56" y="248" font-size="12.5" fill="#38BDF8"><tspan fill="#34D399">Platform ›</tspan> Founder, WorldGyan (worldgyan.com) · Research, Architecture &amp; Intelligence</text>

      <!-- Horizontal Divider -->
      <line x1="56" y1="272" x2="720" y2="272" stroke="#1E3A5F" stroke-opacity=".6"/>

      <!-- Capability Highlights Metrics -->
      <g transform="translate(56 312)">
        <text class="serif" font-size="32" font-weight="400" fill="#F8FAFC">Angular 18+</text>
        <text class="sans" y="24" font-size="12" font-weight="600" fill="#34D399">SIGNALS &amp; INTEROPERABILITY</text>
      </g>
      <g transform="translate(290 312)">
        <text class="serif" font-size="32" font-weight="400" fill="#F8FAFC">TypeScript</text>
        <text class="sans" y="24" font-size="12" font-weight="600" fill="#38BDF8">TYPE-LEVEL COMPUTATION</text>
      </g>
      <g transform="translate(510 312)">
        <text class="serif" font-size="32" font-weight="400" fill="#F8FAFC">Agentic AI</text>
        <text class="sans" y="24" font-size="12" font-weight="600" fill="#F43F5E">ORCHESTRATION &amp; MCP</text>
      </g>

      <!-- Architectural Focus Badges -->
      <g transform="translate(56 394)">
        <g><rect width="144" height="28" rx="14" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="72" y="18" text-anchor="middle" font-size="11.5" fill="#38BDF8">Founder, WorldGyan</text></g>
        <g transform="translate(154 0)"><rect width="176" height="28" rx="14" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="88" y="18" text-anchor="middle" font-size="11.5" fill="#34D399">Angular &amp; TypeScript</text></g>
        <g transform="translate(340 0)"><rect width="178" height="28" rx="14" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="89" y="18" text-anchor="middle" font-size="11.5" fill="#E2E8F0">Reactive Concurrency</text></g>
        <g transform="translate(528 0)"><rect width="170" height="28" rx="14" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="85" y="18" text-anchor="middle" font-size="11.5" fill="#F43F5E">Agentic Orchestration</text></g>
      </g>
    </g>

    <!-- Right Column: User Portrait in Architectural Arch -->
    <g class="hero-photo">
      <!-- Rotating Concentric Orbit Rings Around Portrait -->
      <g transform="translate(965 240)">
        <circle r="200" fill="none" stroke="#1E3A5F" stroke-opacity=".4" stroke-width="1"/>
        <circle r="150" fill="none" stroke="#38BDF8" stroke-opacity=".25" stroke-dasharray="6 8"/>

        <!-- Orbiting Satellite Nodes in Green, Red, Cyan -->
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="45s" repeatCount="indefinite"/>
          <!-- Emerald Green Node -->
          <circle cx="200" cy="0" r="4.5" fill="#34D399" filter="url(#cyber-glow)"/>
          <!-- Ruby Red Node -->
          <circle cx="-141" cy="-141" r="3.5" fill="#F43F5E" filter="url(#cyber-glow)"/>
          <!-- Cyan Node -->
          <circle cx="0" cy="150" r="3" fill="#00C9FF"/>
        </g>
      </g>

      <!-- Clipped Portrait Photo -->
      <g clip-path="url(#hero-arch)">
        <rect x="847" y="84" width="236" height="296" fill="#0A1628"/>
        <image href="data:image/jpeg;base64,${photoBase64}" x="847" y="84" width="236" height="296" preserveAspectRatio="xMidYMin slice" style="mix-blend-mode:luminosity; opacity: 0.92;"/>
        <rect x="847" y="84" width="236" height="296" fill="url(#hero-photo-grade)"/>
        <!-- Diagonal Animated Sheen Reflection -->
        <rect x="700" y="84" width="90" height="296" fill="url(#hero-photo-sheen)" transform="skewX(-16)">
          <animate attributeName="x" values="700;1260;1260" keyTimes="0;.35;1" dur="8s" begin="2.5s" repeatCount="indefinite"/>
        </rect>
      </g>

      <!-- Arch Frame Outline & Corner Brackets -->
      <path d="M847 380 V202 A118 118 0 0 1 1083 202 V380 Z" fill="none" stroke="url(#hero-frame-grad)" stroke-width="2"/>
      <path d="M833 290 v-20 h20" fill="none" stroke="#34D399" stroke-width="1.8"/>
      <path d="M1097 394 v-20 M1097 394 h-20" fill="none" stroke="#F43F5E" stroke-width="1.8"/>
    </g>

    <!-- Base Perimeter Border & Surrounding Corner Trace -->
    <rect x=".5" y=".5" width="1199" height="479" rx="19.5" fill="none" stroke="#1E3A5F" stroke-opacity=".4"/>
    <rect class="trace-anim" x=".5" y=".5" width="1199" height="479" rx="19.5" fill="none" stroke="url(#cyber-trace)" stroke-width="2.2" stroke-linecap="round"/>
  </g>
</svg>
`;

// 2. TERMINAL SYSTEM SVG (MacBook / Linux Terminal Window)
const terminalSystemSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 420" width="1200" height="420" role="img" aria-labelledby="term-t term-d">
  <title id="term-t">System Architecture CLI — Ashutosh Kumar Choubey</title>
  <desc id="term-d">MacBook Linux developer terminal window with system diagnostics, whoami, focus, platform, shipped repositories, and architecture core.</desc>
  <defs>
    ${commonDefs}
    <clipPath id="term-clip"><rect width="1200" height="420" rx="20"/></clipPath>
    <pattern id="term-scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#38BDF8" opacity=".035"/></pattern>
    <clipPath id="t-c0"><rect class="t-type" x="68" y="112" width="92" height="22" style="animation-delay:0.5s;animation-duration:0.4s;animation-timing-function:steps(6)"/></clipPath>
    <clipPath id="t-c1"><rect class="t-type" x="68" y="137" width="560" height="22" style="animation-delay:1.0s;animation-duration:0.5s;animation-timing-function:steps(1)"/></clipPath>
    <clipPath id="t-c2"><rect class="t-type" x="68" y="162" width="180" height="22" style="animation-delay:1.8s;animation-duration:0.5s;animation-timing-function:steps(16)"/></clipPath>
    <clipPath id="t-c3"><rect class="t-type" x="68" y="187" width="560" height="22" style="animation-delay:2.4s;animation-duration:0.5s;animation-timing-function:steps(1)"/></clipPath>
    <clipPath id="t-c4"><rect class="t-type" x="68" y="212" width="190" height="22" style="animation-delay:3.2s;animation-duration:0.5s;animation-timing-function:steps(18)"/></clipPath>
    <clipPath id="t-c5"><rect class="t-type" x="68" y="237" width="560" height="22" style="animation-delay:3.8s;animation-duration:0.5s;animation-timing-function:steps(1)"/></clipPath>
    <clipPath id="t-c6"><rect class="t-type" x="68" y="262" width="140" height="22" style="animation-delay:4.6s;animation-duration:0.4s;animation-timing-function:steps(12)"/></clipPath>
    <clipPath id="t-c7"><rect class="t-type" x="68" y="287" width="560" height="22" style="animation-delay:5.1s;animation-duration:0.5s;animation-timing-function:steps(1)"/></clipPath>
    <clipPath id="t-c8"><rect class="t-type" x="68" y="312" width="168" height="22" style="animation-delay:5.9s;animation-duration:0.4s;animation-timing-function:steps(15)"/></clipPath>
    <clipPath id="t-c9"><rect class="t-type" x="68" y="337" width="560" height="22" style="animation-delay:6.4s;animation-duration:0.5s;animation-timing-function:steps(1)"/></clipPath>
  </defs>
  <style>
    ${commonStyles}
    .t-type { transform-box: fill-box; transform-origin: left center; animation-name: t-type; animation-fill-mode: both; }
    .t-card { animation: t-in 1s cubic-bezier(.16,1,.3,1) both; }
    .t-fade { animation: t-fade 1s ease both; }
    @keyframes t-type { 0% { transform: scaleX(0); } 85%, 100% { transform: scaleX(1); } }
    @keyframes t-in { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }
    @keyframes t-fade { from { opacity: 0; } to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .t-type, .t-card, .t-fade { animation: none; } }
  </style>
  <g clip-path="url(#term-clip)">
    <!-- Base Deep Obsidian Canvas -->
    <rect width="1200" height="420" fill="url(#cyber-bg)"/>
    <ellipse cx="980" cy="180" rx="400" ry="240" fill="url(#cyber-glow-cyan)"/>
    <ellipse cx="220" cy="380" rx="340" ry="200" fill="url(#cyber-glow-blue)"/>
    <rect width="1200" height="420" fill="url(#cyber-grid)"/>

    ${lavaSparks(1200, 420, 40)}

    <!-- MacBook / Linux Style Terminal Window -->
    <g class="t-fade">
      <rect x="40" y="40" width="760" height="340" rx="14" fill="#08101E" stroke="#1E3A5F" stroke-opacity=".7"/>
      <rect x="40" y="40" width="760" height="340" rx="14" fill="url(#term-scan)"/>
      <path d="M40 54 a14 14 0 0 1 14 -14 H786 a14 14 0 0 1 14 14 V76 H40 Z" fill="#0D192E"/>
      <line x1="40" y1="76" x2="800" y2="76" stroke="#1E3A5F" stroke-opacity=".5"/>
      <!-- Traffic Light Buttons -->
      <circle cx="62" cy="58" r="5.5" fill="#EF4444"/>
      <circle cx="80" cy="58" r="5.5" fill="#F59E0B"/>
      <circle cx="98" cy="58" r="5.5" fill="#10B981"/>
      <text class="mono" x="420" y="62" text-anchor="middle" font-size="11.5" letter-spacing="1.2" fill="#94A3B8">ashutosh@worldgyan: ~ (zsh)</text>
    </g>

    <!-- Terminal Code Execution Stream -->
    <g class="mono" font-size="13">
      <!-- 01 whoami -->
      <g clip-path="url(#t-c0)"><text x="72" y="128" fill="#38BDF8">$</text><text x="94" y="128" fill="#F8FAFC">whoami</text></g>
      <g clip-path="url(#t-c1)"><text x="72" y="153" fill="#34D399">→</text><text x="94" y="153" fill="#94A3B8">Ashutosh Kumar Choubey · Frontend Architect · Founder, WorldGyan</text></g>

      <!-- 02 focus.txt -->
      <g clip-path="url(#t-c2)"><text x="72" y="178" fill="#38BDF8">$</text><text x="94" y="178" fill="#F8FAFC">cat focus.txt</text></g>
      <g clip-path="url(#t-c3)"><text x="72" y="203" fill="#34D399">→</text><text x="94" y="203" fill="#94A3B8">Frontend Architecture · Enterprise Scale · AI Orchestration</text></g>

      <!-- 03 platform.txt -->
      <g clip-path="url(#t-c4)"><text x="72" y="228" fill="#38BDF8">$</text><text x="94" y="228" fill="#F8FAFC">cat platform.txt</text></g>
      <g clip-path="url(#t-c5)"><text x="72" y="253" fill="#34D399">→</text><text x="94" y="253" fill="#94A3B8">WorldGyan (worldgyan.com) · Research, System Design &amp; AI Systems</text></g>

      <!-- 04 shipped -->
      <g clip-path="url(#t-c6)"><text x="72" y="278" fill="#38BDF8">$</text><text x="94" y="278" fill="#F8FAFC">ls ./shipped</text></g>
      <g clip-path="url(#t-c7)"><text x="72" y="303" fill="#34D399">→</text><text x="94" y="303" fill="#94A3B8">angular-architecture  rxjs-operator-lab  ngrx-effects  typescript-type-system</text></g>

      <!-- 05 principle -->
      <g clip-path="url(#t-c8)"><text x="72" y="328" fill="#38BDF8">$</text><text x="94" y="328" fill="#F8FAFC">echo $PRINCIPLE</text></g>
      <g clip-path="url(#t-c9)"><text x="72" y="353" fill="#34D399">→</text><text x="94" y="353" fill="#94A3B8">scalable frontend systems · deterministic AI orchestration</text></g>
    </g>

    <!-- Blinking Terminal Prompt Cursor -->
    <rect x="72" y="364" width="8" height="15" fill="#38BDF8" class="t-fade" style="animation-delay:7.2s">
      <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.5;1" dur="1s" repeatCount="indefinite"/>
    </rect>

    <!-- Right Column: Architecture Capability Cards -->
    <g class="t-card" style="animation-delay:0.8s">
      <!-- Card 1: Primary Architecture -->
      <g transform="translate(830 40)">
        <rect width="330" height="96" rx="12" fill="#0D1D33" stroke="#1E3A5F" stroke-opacity=".7"/>
        <line x1="16" y1="18" x2="16" y2="78" stroke="#34D399" stroke-width="3" stroke-linecap="round"/>
        <text class="sans" x="32" y="38" font-size="13" font-weight="700" letter-spacing="0.5" fill="#38BDF8">Primary Architecture</text>
        <text class="sans" x="32" y="60" font-size="14.5" font-weight="600" fill="#F8FAFC">Angular 18+ · TypeScript 5+</text>
        <text class="sans" x="32" y="80" font-size="12" fill="#94A3B8">Signals graph, RxJS interop, Zoneless CD</text>
      </g>

      <!-- Card 2: Intelligent Systems -->
      <g transform="translate(830 154)">
        <rect width="330" height="104" rx="12" fill="#0D1D33" stroke="#1E3A5F" stroke-opacity=".7"/>
        <line x1="16" y1="18" x2="16" y2="86" stroke="#00C9FF" stroke-width="3" stroke-linecap="round"/>
        <text class="sans" x="32" y="38" font-size="13" font-weight="700" letter-spacing="0.5" fill="#F59E0B">Intelligent Systems</text>
        <text class="sans" x="32" y="60" font-size="14.5" font-weight="600" fill="#F8FAFC">AI Architecture &amp; MCP</text>
        <text class="sans" x="32" y="80" font-size="12" fill="#94A3B8">Deterministic agent orchestration, tool workflows</text>
        <text class="sans" x="32" y="96" font-size="11" fill="#38BDF8">LLM routing &amp; automated evaluations</text>
      </g>

      <!-- Card 3: Engineering Foundation -->
      <g transform="translate(830 276)">
        <rect width="330" height="104" rx="12" fill="#0D1D33" stroke="#1E3A5F" stroke-opacity=".7"/>
        <line x1="16" y1="18" x2="16" y2="86" stroke="#F43F5E" stroke-width="3" stroke-linecap="round"/>
        <text class="sans" x="32" y="38" font-size="13" font-weight="700" letter-spacing="0.5" fill="#F43F5E">Engineering Foundation</text>
        <text class="sans" x="32" y="60" font-size="14.5" font-weight="600" fill="#F8FAFC">Clean Systems &amp; Concurrency</text>
        <text class="sans" x="32" y="80" font-size="12" fill="#94A3B8">Micro-frontends, HTTP mutex queues, caching</text>
        <text class="sans" x="32" y="96" font-size="11" fill="#34D399">Strict unit testing, CI/CD verification</text>
      </g>
    </g>

    <!-- Base Perimeter Border & Surrounding Corner Trace -->
    <rect x=".5" y=".5" width="1199" height="419" rx="19.5" fill="none" stroke="#1E3A5F" stroke-opacity=".4"/>
    <rect class="trace-anim" x=".5" y=".5" width="1199" height="419" rx="19.5" fill="none" stroke="url(#cyber-trace)" stroke-width="2.2" stroke-linecap="round"/>
  </g>
</svg>
`;

// 3. PROJECT 1: ANGULAR ARCHITECTURE STUDY SVG
const projectAngularArchitectureSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 370" width="1200" height="370" role="img" aria-labelledby="p1-t">
  <title id="p1-t">Angular Architecture Study: Signals, HTTP Interceptors &amp; Enterprise Architecture.</title>
  <defs>
    ${commonDefs}
    <clipPath id="p1-clip"><rect width="1200" height="370" rx="18"/></clipPath>
  </defs>
  <style>
    ${commonStyles}
    .p1-in { animation: p1-in 1.2s cubic-bezier(.16,1,.3,1) both; }
    .p1-chip { animation: p1-chip .7s cubic-bezier(.34,1.56,.64,1) both; }
    @keyframes p1-chip { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    @keyframes p1-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .p1-in, .p1-chip { animation: none; } }
  </style>
  <g clip-path="url(#p1-clip)">
    <!-- Base Deep Obsidian Canvas -->
    <rect width="1200" height="370" fill="url(#cyber-bg)"/>
    <ellipse cx="880" cy="180" rx="420" ry="240" fill="url(#cyber-glow-cyan)"/>
    <rect x="700" width="500" height="370" fill="url(#cyber-grid)"/>

    ${lavaSparks(1200, 370, 80)}

    <!-- Left Content Column -->
    <g class="p1-in" style="animation-delay: 0.15s;">
      <text class="sans" x="56" y="62" font-size="12" font-weight="700" letter-spacing="1" fill="#38BDF8">01 · ARCHITECTURE · ANGULAR · SIGNALS</text>
      <text class="serif" x="54" y="126" font-size="50" font-weight="300" letter-spacing="-1" fill="#F8FAFC">Angular Architecture Study</text>
      <text class="sans" x="56" y="166" font-size="16.5" fill="#94A3B8">Signals, HTTP interceptors, caching, and enterprise application architecture.</text>
      <text class="mono" x="56" y="200" font-size="12.5" fill="#E2E8F0"><tspan fill="#34D399">Built ›</tspan> Signals interop, caching &amp; mutex interceptors, modular app.config</text>
      <line x1="56" y1="226" x2="680" y2="226" stroke="#1E3A5F" stroke-opacity=".7"/>

      <!-- Metric Blocks -->
      <g transform="translate(56 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8FAFC">Signals</text>
        <text class="sans" y="24" font-size="12.5" fill="#34D399">dynamic reactive graph</text>
      </g>
      <g transform="translate(261 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8FAFC">Mutex</text>
        <text class="sans" y="24" font-size="12.5" fill="#38BDF8">concurrency interceptor</text>
      </g>
      <g transform="translate(466 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8FAFC">Enterprise</text>
        <text class="sans" y="24" font-size="12.5" fill="#F43F5E">modular application config</text>
      </g>

      <!-- Chips -->
      <g class="p1-chip" style="animation-delay:1.00s"><rect x="56" y="314" width="112" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="112" y="331" text-anchor="middle" font-size="11.5" fill="#38BDF8">Angular 18+</text></g>
      <g class="p1-chip" style="animation-delay:1.12s"><rect x="176" y="314" width="92" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="222" y="331" text-anchor="middle" font-size="11.5" fill="#34D399">TypeScript</text></g>
      <g class="p1-chip" style="animation-delay:1.24s"><rect x="276" y="314" width="102" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="327" y="331" text-anchor="middle" font-size="11.5" fill="#E2E8F0">RxJS Interop</text></g>
      <g class="p1-chip" style="animation-delay:1.36s"><rect x="386" y="314" width="126" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="449" y="331" text-anchor="middle" font-size="11.5" fill="#38BDF8">HTTP Interceptors</text></g>
      <g class="p1-chip" style="animation-delay:1.48s"><rect x="520" y="314" width="118" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="579" y="331" text-anchor="middle" font-size="11.5" fill="#F43F5E">Mutex Queue</text></g>
    </g>

    <!-- Right Column: Interactive Diagram -->
    <g class="p1-in" style="animation-delay: 0.35s;">
      <g transform="translate(740 40)">
        <text class="sans" x="14" y="16" font-size="11" font-weight="700" letter-spacing="0.8" fill="#94A3B8">REACTIVE SIGNAL DEPENDENCY GRAPH</text>
        
        <!-- Signal Node 1 -->
        <g transform="translate(20 44)">
          <rect width="170" height="52" rx="10" fill="#0D1D33" stroke="#1E3A5F"/>
          <text class="mono" x="14" y="22" font-size="11" fill="#F8FAFC">signal(state)</text>
          <text class="mono" x="14" y="38" font-size="9.5" fill="#38BDF8">producer · source</text>
        </g>

        <!-- Connecting Line & Animated Moving Particle -->
        <path d="M190 70 C 230 70, 230 130, 270 130" fill="none" stroke="#38BDF8" stroke-width="1.8"/>
        <circle r="4" fill="#34D399" filter="url(#cyber-glow)">
          <animateMotion dur="3s" repeatCount="indefinite" path="M190 70 C 230 70, 230 130, 270 130" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines=".45 0 .55 1"/>
        </circle>

        <!-- Computed Node -->
        <g transform="translate(270 104)">
          <rect width="180" height="52" rx="10" fill="#163659" stroke="#34D399" stroke-width="1.5"/>
          <text class="mono" x="14" y="22" font-size="11" fill="#F8FAFC">computed(derived)</text>
          <text class="mono" x="14" y="38" font-size="9.5" fill="#34D399">memoized · reactive</text>
        </g>

        <!-- Interceptor Node -->
        <g transform="translate(20 160)">
          <rect width="190" height="52" rx="10" fill="#08101E" stroke="#1E3A5F"/>
          <text class="mono" x="14" y="22" font-size="11" fill="#F8FAFC">HttpInterceptorFn</text>
          <text class="mono" x="14" y="38" font-size="9.5" fill="#94A3B8">mutexQueue &amp; cache</text>
        </g>

        <!-- Line to RxJS Interop -->
        <path d="M210 186 C 240 186, 240 145, 270 140" fill="none" stroke="#38BDF8" stroke-opacity=".5" stroke-dasharray="4 4"/>

        <!-- Live Interop Indicator Box -->
        <g transform="translate(160 228)">
          <rect width="240" height="32" rx="8" fill="#060B17" stroke="#1E3A5F"/>
          <text class="mono" x="120" y="20" text-anchor="middle" font-size="10.5" fill="#38BDF8">toSignal() &amp; toObservable() Interop</text>
        </g>
      </g>
    </g>

    <!-- Base Perimeter Border & Surrounding Corner Trace -->
    <rect x=".5" y=".5" width="1199" height="369" rx="17.5" fill="none" stroke="#1E3A5F" stroke-opacity=".4"/>
    <rect class="trace-anim" x=".5" y=".5" width="1199" height="369" rx="17.5" fill="none" stroke="url(#cyber-trace)" stroke-width="2.2" stroke-linecap="round"/>
  </g>
</svg>
`;

// 4. PROJECT 2: RXJS OPERATOR LAB SVG
const projectRxjsOperatorLabSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 370" width="1200" height="370" role="img" aria-labelledby="p2-t">
  <title id="p2-t">RxJS Operator Lab: Interactive Higher-Order Mapping Lab.</title>
  <defs>
    ${commonDefs}
    <clipPath id="p2-clip"><rect width="1200" height="370" rx="18"/></clipPath>
  </defs>
  <style>
    ${commonStyles}
    .p2-in { animation: p2-in 1.2s cubic-bezier(.16,1,.3,1) both; }
    .p2-chip { animation: p2-chip .7s cubic-bezier(.34,1.56,.64,1) both; }
    @keyframes p2-chip { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    @keyframes p2-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .p2-in, .p2-chip { animation: none; } }
  </style>
  <g clip-path="url(#p2-clip)">
    <!-- Base Deep Obsidian Canvas -->
    <rect width="1200" height="370" fill="url(#cyber-bg)"/>
    <ellipse cx="880" cy="180" rx="420" ry="240" fill="url(#cyber-glow-cyan)"/>
    <rect x="700" width="500" height="370" fill="url(#cyber-grid)"/>

    ${lavaSparks(1200, 370, 120)}

    <!-- Left Content Column -->
    <g class="p2-in" style="animation-delay: 0.15s;">
      <text class="sans" x="56" y="62" font-size="12" font-weight="700" letter-spacing="1" fill="#38BDF8">02 · REACTIVE PROGRAMMING · RXJS · STREAMS</text>
      <text class="serif" x="54" y="126" font-size="50" font-weight="300" letter-spacing="-1" fill="#F8FAFC">RxJS Operator Lab</text>
      <text class="sans" x="56" y="166" font-size="16.5" fill="#94A3B8">Comparing switchMap, mergeMap, concatMap and exhaustMap with reactive search.</text>
      <text class="mono" x="56" y="200" font-size="12.5" fill="#E2E8F0"><tspan fill="#34D399">Built ›</tspan> Interactive visual demonstrations of concurrency &amp; stream lifecycle</text>
      <line x1="56" y1="226" x2="680" y2="226" stroke="#1E3A5F" stroke-opacity=".7"/>

      <!-- Metric Blocks -->
      <g transform="translate(56 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8FAFC">4 Maps</text>
        <text class="sans" y="24" font-size="12.5" fill="#34D399">higher-order operators</text>
      </g>
      <g transform="translate(261 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8FAFC">100%</text>
        <text class="sans" y="24" font-size="12.5" fill="#38BDF8">deterministic streams</text>
      </g>
      <g transform="translate(466 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8FAFC">Zero</text>
        <text class="sans" y="24" font-size="12.5" fill="#F43F5E">memory leaks · clean teardown</text>
      </g>

      <!-- Chips -->
      <g class="p2-chip" style="animation-delay:1.00s"><rect x="56" y="314" width="86" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="99" y="331" text-anchor="middle" font-size="11.5" fill="#38BDF8">RxJS 7+</text></g>
      <g class="p2-chip" style="animation-delay:1.12s"><rect x="150" y="314" width="92" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="196" y="331" text-anchor="middle" font-size="11.5" fill="#34D399">TypeScript</text></g>
      <g class="p2-chip" style="animation-delay:1.24s"><rect x="250" y="314" width="102" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="301" y="331" text-anchor="middle" font-size="11.5" fill="#E2E8F0">Observables</text></g>
      <g class="p2-chip" style="animation-delay:1.36s"><rect x="360" y="314" width="108" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="414" y="331" text-anchor="middle" font-size="11.5" fill="#38BDF8">Higher-Order</text></g>
      <g class="p2-chip" style="animation-delay:1.48s"><rect x="476" y="314" width="118" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="535" y="331" text-anchor="middle" font-size="11.5" fill="#F43F5E">Marble Testing</text></g>
    </g>

    <!-- Right Column: Interactive Concurrency Operator Routing -->
    <g class="p2-in" style="animation-delay: 0.35s;">
      <g transform="translate(760 40)" class="mono" font-size="13" text-anchor="middle">
        <text class="sans" x="12" y="20" text-anchor="start" font-size="11" font-weight="700" letter-spacing="0.8" fill="#94A3B8">STREAM CONCURRENCY · OPERATOR ROUTING</text>
        <path d="M12 120 H70" stroke="#38BDF8" stroke-opacity=".6"/>
        <path d="M190 120 C 240 120, 250 64, 300 64" fill="none" stroke="#34D399" stroke-width="1.8"/>
        <path d="M190 120 C 240 120, 250 176, 300 176" fill="none" stroke="#1E3A5F" stroke-dasharray="4 6"/>
        
        <rect x="70" y="98" width="120" height="44" rx="22" fill="#0D1D33" stroke="#38BDF8"/>
        <text x="130" y="125" fill="#F8FAFC">switchMap</text>
        
        <rect x="300" y="42" width="116" height="44" rx="22" fill="#163659" stroke="#34D399"/>
        <text x="358" y="69" fill="#34D399">exhaustMap</text>
        
        <rect x="300" y="154" width="116" height="44" rx="22" fill="#08101E" stroke="#1E3A5F"/>
        <text x="358" y="181" fill="#94A3B8">mergeMap</text>

        <!-- Traveling Pulse Particle -->
        <circle r="4.5" fill="#F8FAFC" filter="url(#cyber-glow)">
          <animateMotion dur="3.6s" repeatCount="indefinite" path="M12 120 H130 C 220 120, 250 64, 358 64" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines=".45 0 .55 1"/>
        </circle>
        
        <text class="mono" x="12" y="236" text-anchor="start" font-size="10.5" letter-spacing="1.2" fill="#38BDF8">observable pipeline · debounceTime · distinctUntilChanged</text>
      </g>
    </g>

    <!-- Base Perimeter Border & Surrounding Corner Trace -->
    <rect x=".5" y=".5" width="1199" height="369" rx="17.5" fill="none" stroke="#1E3A5F" stroke-opacity=".4"/>
    <rect class="trace-anim" x=".5" y=".5" width="1199" height="369" rx="17.5" fill="none" stroke="url(#cyber-trace)" stroke-width="2.2" stroke-linecap="round"/>
  </g>
</svg>
`;

// 5. PROJECT 3: NGRX EFFECTS DEMO SVG
const projectNgrxEffectsSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 370" width="1200" height="370" role="img" aria-labelledby="p3-t">
  <title id="p3-t">NgRx Effects Demo: Connecting Store Actions, Reducers &amp; HTTP Side Effects.</title>
  <defs>
    ${commonDefs}
    <clipPath id="p3-clip"><rect width="1200" height="370" rx="18"/></clipPath>
  </defs>
  <style>
    ${commonStyles}
    .p3-in { animation: p3-in 1.2s cubic-bezier(.16,1,.3,1) both; }
    .p3-chip { animation: p3-chip .7s cubic-bezier(.34,1.56,.64,1) both; }
    @keyframes p3-chip { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    @keyframes p3-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .p3-in, .p3-chip { animation: none; } }
  </style>
  <g clip-path="url(#p3-clip)">
    <!-- Base Deep Obsidian Canvas -->
    <rect width="1200" height="370" fill="url(#cyber-bg)"/>
    <ellipse cx="880" cy="180" rx="420" ry="240" fill="url(#cyber-glow-cyan)"/>
    <rect x="700" width="500" height="370" fill="url(#cyber-grid)"/>

    ${lavaSparks(1200, 370, 160)}

    <!-- Left Content Column -->
    <g class="p3-in" style="animation-delay: 0.15s;">
      <text class="sans" x="56" y="62" font-size="12" font-weight="700" letter-spacing="1" fill="#38BDF8">03 · STATE MANAGEMENT · NGRX · ARCHITECTURE</text>
      <text class="serif" x="54" y="126" font-size="50" font-weight="300" letter-spacing="-1" fill="#F8FAFC">NgRx Effects Demo<tspan class="serif" font-size="22" font-style="italic" fill="#38BDF8" dx="14">PokéAPI Store</tspan></text>
      <text class="sans" x="56" y="166" font-size="16.5" fill="#94A3B8">Connecting store actions, reducers and HTTP side effects to decoupled views.</text>
      <text class="mono" x="56" y="200" font-size="12.5" fill="#E2E8F0"><tspan fill="#34D399">Built ›</tspan> clean action-reducer-effect separation with async HTTP side-effect dispatch</text>
      <line x1="56" y1="226" x2="680" y2="226" stroke="#1E3A5F" stroke-opacity=".7"/>

      <!-- Metric Blocks -->
      <g transform="translate(56 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8FAFC">Store</text>
        <text class="sans" y="24" font-size="12.5" fill="#34D399">immutable application state</text>
      </g>
      <g transform="translate(261 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8FAFC">Effects</text>
        <text class="sans" y="24" font-size="12.5" fill="#38BDF8">async HTTP dispatch</text>
      </g>
      <g transform="translate(466 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8FAFC">Selectors</text>
        <text class="sans" y="24" font-size="12.5" fill="#F43F5E">memoized state queries</text>
      </g>

      <!-- Chips -->
      <g class="p3-chip" style="animation-delay:1.00s"><rect x="56" y="314" width="92" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="102" y="331" text-anchor="middle" font-size="11.5" fill="#38BDF8">NgRx 18+</text></g>
      <g class="p3-chip" style="animation-delay:1.12s"><rect x="156" y="314" width="86" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="199" y="331" text-anchor="middle" font-size="11.5" fill="#34D399">Angular</text></g>
      <g class="p3-chip" style="animation-delay:1.24s"><rect x="250" y="314" width="70" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="285" y="331" text-anchor="middle" font-size="11.5" fill="#E2E8F0">Store</text></g>
      <g class="p3-chip" style="animation-delay:1.36s"><rect x="328" y="314" width="76" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="366" y="331" text-anchor="middle" font-size="11.5" fill="#38BDF8">Effects</text></g>
      <g class="p3-chip" style="animation-delay:1.48s"><rect x="412" y="314" width="90" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="457" y="331" text-anchor="middle" font-size="11.5" fill="#F43F5E">Selectors</text></g>
    </g>

    <!-- Right Column: Step-by-Step Reactive State Cycle -->
    <g class="p3-in" style="animation-delay: 0.35s;">
      <g transform="translate(0 35)">
        <rect x="750" y="46" width="270" height="38" rx="12" fill="#0D192E" stroke="#38BDF8" stroke-opacity=".7"/>
        <text class="mono" x="766" y="70" font-size="11.5" fill="#F8FAFC">dispatch(loadPokemon({id}))</text>

        <!-- Step 1: Dispatch -->
        <g transform="translate(750 106)">
          <rect width="76" height="58" rx="9" fill="#0D1D33" stroke="#1E3A5F">
            <animate attributeName="fill" values="#0D1D33;#163659;#0D1D33;#0D1D33" keyTimes="0;.08;.2;1" dur="6s" begin="1.0s" repeatCount="indefinite"/>
            <animate attributeName="stroke" values="#1E3A5F;#34D399;#1E3A5F;#1E3A5F" keyTimes="0;.08;.2;1" dur="6s" begin="1.0s" repeatCount="indefinite"/>
          </rect>
          <text class="mono" x="8" y="18" font-size="9" fill="#94A3B8">01</text>
          <text class="mono" x="38" y="40" font-size="9.5" text-anchor="middle" fill="#F8FAFC">Dispatch</text>
        </g>

        <!-- Step 2: ofType -->
        <g transform="translate(834 106)">
          <rect width="76" height="58" rx="9" fill="#0D1D33" stroke="#1E3A5F">
            <animate attributeName="fill" values="#0D1D33;#163659;#0D1D33;#0D1D33" keyTimes="0;.08;.2;1" dur="6s" begin="1.6s" repeatCount="indefinite"/>
            <animate attributeName="stroke" values="#1E3A5F;#00C9FF;#1E3A5F;#1E3A5F" keyTimes="0;.08;.2;1" dur="6s" begin="1.6s" repeatCount="indefinite"/>
          </rect>
          <text class="mono" x="8" y="18" font-size="9" fill="#94A3B8">02</text>
          <text class="mono" x="38" y="40" font-size="9.5" text-anchor="middle" fill="#F8FAFC">ofType</text>
        </g>

        <!-- Step 3: Http API -->
        <g transform="translate(918 106)">
          <rect width="76" height="58" rx="9" fill="#0D1D33" stroke="#1E3A5F">
            <animate attributeName="fill" values="#0D1D33;#163659;#0D1D33;#0D1D33" keyTimes="0;.08;.2;1" dur="6s" begin="2.2s" repeatCount="indefinite"/>
            <animate attributeName="stroke" values="#1E3A5F;#38BDF8;#1E3A5F;#1E3A5F" keyTimes="0;.08;.2;1" dur="6s" begin="2.2s" repeatCount="indefinite"/>
          </rect>
          <text class="mono" x="8" y="18" font-size="9" fill="#94A3B8">03</text>
          <text class="mono" x="38" y="40" font-size="9.5" text-anchor="middle" fill="#F8FAFC">Http API</text>
        </g>

        <!-- Step 4: Success -->
        <g transform="translate(1002 106)">
          <rect width="76" height="58" rx="9" fill="#0D1D33" stroke="#1E3A5F">
            <animate attributeName="fill" values="#0D1D33;#163659;#0D1D33;#0D1D33" keyTimes="0;.08;.2;1" dur="6s" begin="2.8s" repeatCount="indefinite"/>
            <animate attributeName="stroke" values="#1E3A5F;#F59E0B;#1E3A5F;#1E3A5F" keyTimes="0;.08;.2;1" dur="6s" begin="2.8s" repeatCount="indefinite"/>
          </rect>
          <text class="mono" x="8" y="18" font-size="9" fill="#94A3B8">04</text>
          <text class="mono" x="38" y="40" font-size="9.5" text-anchor="middle" fill="#F8FAFC">Success</text>
        </g>

        <!-- Step 5: Reducer -->
        <g transform="translate(1086 106)">
          <rect width="76" height="58" rx="9" fill="#0D1D33" stroke="#1E3A5F">
            <animate attributeName="fill" values="#0D1D33;#163659;#0D1D33;#0D1D33" keyTimes="0;.08;.2;1" dur="6s" begin="3.4s" repeatCount="indefinite"/>
            <animate attributeName="stroke" values="#1E3A5F;#F43F5E;#1E3A5F;#1E3A5F" keyTimes="0;.08;.2;1" dur="6s" begin="3.4s" repeatCount="indefinite"/>
          </rect>
          <text class="mono" x="8" y="18" font-size="9" fill="#94A3B8">05</text>
          <text class="mono" x="38" y="40" font-size="9.5" text-anchor="middle" fill="#F8FAFC">Reducer</text>
        </g>

        <text class="mono" x="1162" y="206" font-size="11" text-anchor="end" fill="#38BDF8">Actions → Effects → Reducers → View Selectors</text>
        <text class="sans" x="1162" y="232" font-size="11" font-weight="600" text-anchor="end" letter-spacing="0.8" fill="#94A3B8">IMMUTABLE STATE · DETERMINISTIC CYCLE</text>
      </g>
    </g>

    <!-- Base Perimeter Border & Surrounding Corner Trace -->
    <rect x=".5" y=".5" width="1199" height="369" rx="17.5" fill="none" stroke="#1E3A5F" stroke-opacity=".4"/>
    <rect class="trace-anim" x=".5" y=".5" width="1199" height="369" rx="17.5" fill="none" stroke="url(#cyber-trace)" stroke-width="2.2" stroke-linecap="round"/>
  </g>
</svg>
`;

// 6. PROJECT 4: TYPESCRIPT TYPE-SYSTEM REFERENCE SVG
const projectTypescriptTypesSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 370" width="1200" height="370" role="img" aria-labelledby="p4-t">
  <title id="p4-t">TypeScript Type-System: Advanced Generics, Unions &amp; Mapped Types.</title>
  <defs>
    ${commonDefs}
    <clipPath id="p4-clip"><rect width="1200" height="370" rx="18"/></clipPath>
  </defs>
  <style>
    ${commonStyles}
    .p4-in { animation: p4-in 1.2s cubic-bezier(.16,1,.3,1) both; }
    .p4-chip { animation: p4-chip .7s cubic-bezier(.34,1.56,.64,1) both; }
    @keyframes p4-chip { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    @keyframes p4-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .p4-in, .p4-chip { animation: none; } }
  </style>
  <g clip-path="url(#p4-clip)">
    <!-- Base Deep Obsidian Canvas -->
    <rect width="1200" height="370" fill="url(#cyber-bg)"/>
    <ellipse cx="880" cy="180" rx="420" ry="240" fill="url(#cyber-glow-cyan)"/>
    <rect x="700" width="500" height="370" fill="url(#cyber-grid)"/>

    ${lavaSparks(1200, 370, 200)}

    <!-- Left Content Column -->
    <g class="p4-in" style="animation-delay: 0.15s;">
      <text class="sans" x="56" y="62" font-size="12" font-weight="700" letter-spacing="1" fill="#38BDF8">04 · TYPE SYSTEM · TYPESCRIPT · COMPILER</text>
      <text class="serif" x="54" y="126" font-size="50" font-weight="300" letter-spacing="-1" fill="#F8FAFC">TypeScript Type-System</text>
      <text class="sans" x="56" y="166" font-size="16.5" fill="#94A3B8">Focused implementations of generics, unions, mapped types and utility types.</text>
      <text class="mono" x="56" y="200" font-size="12.5" fill="#E2E8F0"><tspan fill="#34D399">Built ›</tspan> Comprehensive type-system reference with conditional types &amp; mapped inference</text>
      <line x1="56" y1="226" x2="680" y2="226" stroke="#1E3A5F" stroke-opacity=".7"/>

      <!-- Metric Blocks -->
      <g transform="translate(56 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8FAFC">Generics</text>
        <text class="sans" y="24" font-size="12.5" fill="#34D399">constrained parameters</text>
      </g>
      <g transform="translate(261 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8FAFC">Unions</text>
        <text class="sans" y="24" font-size="12.5" fill="#38BDF8">discriminated matching</text>
      </g>
      <g transform="translate(466 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8FAFC">Mapped</text>
        <text class="sans" y="24" font-size="12.5" fill="#F43F5E">key remapping &amp; inference</text>
      </g>

      <!-- Chips -->
      <g class="p4-chip" style="animation-delay:1.00s"><rect x="56" y="314" width="112" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="112" y="331" text-anchor="middle" font-size="11.5" fill="#38BDF8">TypeScript 5+</text></g>
      <g class="p4-chip" style="animation-delay:1.12s"><rect x="176" y="314" width="86" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="219" y="331" text-anchor="middle" font-size="11.5" fill="#34D399">Generics</text></g>
      <g class="p4-chip" style="animation-delay:1.24s"><rect x="270" y="314" width="136" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="338" y="331" text-anchor="middle" font-size="11.5" fill="#E2E8F0">Conditional Types</text></g>
      <g class="p4-chip" style="animation-delay:1.36s"><rect x="414" y="314" width="114" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="471" y="331" text-anchor="middle" font-size="11.5" fill="#38BDF8">Mapped Types</text></g>
      <g class="p4-chip" style="animation-delay:1.48s"><rect x="536" y="314" width="106" height="26" rx="13" fill="#0D1D33" stroke="#1E3A5F"/><text class="mono" x="589" y="331" text-anchor="middle" font-size="11.5" fill="#F43F5E">Compiler AST</text></g>
    </g>

    <!-- Right Column: Interactive Code Editor View -->
    <g class="p4-in" style="animation-delay: 0.35s;">
      <g transform="translate(750 40)">
        <text class="sans" x="14" y="16" font-size="11" font-weight="700" letter-spacing="0.8" fill="#94A3B8">TYPE-LEVEL COMPUTATION &amp; INFERENCE</text>
        
        <!-- Layer 1: Conditional inference -->
        <g transform="translate(20 44)">
          <rect width="380" height="48" rx="10" fill="#0D1D33" stroke="#1E3A5F"/>
          <text class="mono" x="14" y="20" font-size="10.5" fill="#38BDF8">type <tspan fill="#F8FAFC">Flatten&lt;T&gt;</tspan> = T extends Array&lt;infer U&gt;</text>
          <text class="mono" x="14" y="36" font-size="10.5" fill="#34D399">  ? Flatten&lt;U&gt; : T;</text>
        </g>

        <!-- Layer 2: Mapped type -->
        <g transform="translate(20 106)">
          <rect width="380" height="48" rx="10" fill="#163659" stroke="#34D399" stroke-opacity=".7"/>
          <text class="mono" x="14" y="20" font-size="10.5" fill="#F8FAFC">type DeepReadonly&lt;T&gt; = {</text>
          <text class="mono" x="14" y="36" font-size="10.5" fill="#73DEFF">  readonly [K in keyof T]: DeepReadonly&lt;T[K]&gt;</text>
        </g>

        <!-- Layer 3: Discriminated Union Pattern -->
        <g transform="translate(20 168)">
          <rect width="380" height="48" rx="10" fill="#08101E" stroke="#1E3A5F"/>
          <text class="mono" x="14" y="20" font-size="10.5" fill="#F8FAFC">type Match&lt;T extends { tag: string }&gt; =</text>
          <text class="mono" x="14" y="36" font-size="10.5" fill="#F43F5E">  Extract&lt;T, { tag: 'success' }&gt;;</text>
        </g>

        <!-- Compiler status indicator -->
        <g transform="translate(20 228)">
          <rect width="380" height="30" rx="8" fill="#060B17" stroke="#1E3A5F"/>
          <circle cx="18" cy="15" r="4" fill="#34D399" filter="url(#cyber-glow)">
            <animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text class="mono" x="32" y="19" font-size="10" fill="#94A3B8">tsc --strict · Zero Any · Deterministic Compilation</text>
        </g>
      </g>
    </g>

    <!-- Base Perimeter Border & Surrounding Corner Trace -->
    <rect x=".5" y=".5" width="1199" height="369" rx="17.5" fill="none" stroke="#1E3A5F" stroke-opacity=".4"/>
    <rect class="trace-anim" x=".5" y=".5" width="1199" height="369" rx="17.5" fill="none" stroke="url(#cyber-trace)" stroke-width="2.2" stroke-linecap="round"/>
  </g>
</svg>
`;

  await writeFile(path.join(outDir, 'hero-architect.svg'), heroArchitectSvg);
  await writeFile(path.join(outDir, 'terminal-system.svg'), terminalSystemSvg);
  await writeFile(path.join(outDir, 'project-angular-architecture.svg'), projectAngularArchitectureSvg);
  await writeFile(path.join(outDir, 'project-rxjs-operator-lab.svg'), projectRxjsOperatorLabSvg);
  await writeFile(path.join(outDir, 'project-ngrx-effects.svg'), projectNgrxEffectsSvg);
  await writeFile(path.join(outDir, 'project-typescript-types.svg'), projectTypescriptTypesSvg);

  console.log('Successfully generated 6 Cyber-Architect SVGs in themes/main/assets/');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await generateCyberTheme();
}
