import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export async function generateCyberTheme(customRoot) {
  const root = customRoot || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const outDir = path.join(root, 'themes/main/assets');
  await mkdir(outDir, { recursive: true });

  const photoBase64 = (await readFile(path.join(root, 'scripts/user_studio_creator_retina.base64.txt'), 'utf8')).trim();
  const standingPhotoBase64 = (await readFile(path.join(root, 'scripts/user_standing.base64.txt'), 'utf8')).trim();
  const logoBase64 = (await readFile(path.join(root, 'assets/worldgyan-logo-hero.base64.txt'), 'utf8')).trim();

  // Shared SVG defs and styles for Obsidian-Architect palette & aesthetics
  const commonDefs = `
    <linearGradient id="cyber-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#190B12"/>
      <stop offset=".45" stop-color="#14080F"/>
      <stop offset="1" stop-color="#10070C"/>
    </linearGradient>
    <radialGradient id="cyber-glow-rose" cx="80%" cy="25%" r="65%">
      <stop offset="0" stop-color="#701A3D" stop-opacity=".48"/>
      <stop offset="1" stop-color="#701A3D" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cyber-glow-plum" cx="20%" cy="80%" r="55%">
      <stop offset="0" stop-color="#451126" stop-opacity=".52"/>
      <stop offset="1" stop-color="#451126" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cyber-trace" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F8F0F3"/>
      <stop offset=".35" stop-color="#E5B5C7"/>
      <stop offset=".7" stop-color="#C77B9B"/>
      <stop offset="1" stop-color="#701A3D" stop-opacity="0"/>
    </linearGradient>
    <pattern id="cyber-grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" fill="none" stroke="#C77B9B" stroke-opacity=".07" stroke-width="1"/>
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

  function lavaSparks(w, h, seed = 0) {
    return `
    <!-- Floating Obsidian Embers & Radiant Particles -->
    <g class="lava-sparks">
      <!-- Rose Champagne Sparks -->
      <circle cx="${seed + 520}" cy="${h - 40}" r="2.2" fill="#E5B5C7" filter="url(#cyber-glow)">
        <animate attributeName="cy" values="${h - 40};40" dur="4.6s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;.95;.0" dur="4.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${seed + 740}" cy="${h - 60}" r="1.6" fill="#E5B5C7">
        <animate attributeName="cy" values="${h - 60};30" dur="5.8s" begin="1.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;.85;.0" dur="5.8s" begin="1.2s" repeatCount="indefinite"/>
      </circle>
      <!-- Ruby Plum Sparks -->
      <circle cx="${seed + 640}" cy="${h - 30}" r="2" fill="#C77B9B" filter="url(#cyber-glow)">
        <animate attributeName="cy" values="${h - 30};50" dur="5.2s" begin="0.6s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;.9;.0" dur="5.2s" begin="0.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${seed + 1060}" cy="${h - 50}" r="1.8" fill="#701A3D">
        <animate attributeName="cy" values="${h - 50};45" dur="6.1s" begin="2.1s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;.8;.0" dur="6.1s" begin="2.1s" repeatCount="indefinite"/>
      </circle>
      <!-- Frosted White Sparks -->
      <circle cx="${seed + 440}" cy="${h - 70}" r="1.8" fill="#F8F0F3">
        <animate attributeName="cy" values="${h - 70};35" dur="4.9s" begin="1.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;.9;.0" dur="4.9s" begin="1.8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${seed + 880}" cy="${h - 35}" r="2.2" fill="#E5B5C7" filter="url(#cyber-glow)">
        <animate attributeName="cy" values="${h - 35};60" dur="5.5s" begin="0.3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;.95;.0" dur="5.5s" begin="0.3s" repeatCount="indefinite"/>
      </circle>
      <!-- Soft Amber Sparks -->
      <circle cx="${seed + 800}" cy="${h - 45}" r="1.5" fill="#F59E0B">
        <animate attributeName="cy" values="${h - 45};55" dur="6.4s" begin="2.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;.75;.0" dur="6.4s" begin="2.8s" repeatCount="indefinite"/>
      </circle>
    </g>
  `;
  }

  // 1. HERO ARCHITECT SVG (Minimal, Commanding, Obsidian Architect Aesthetic)
  const heroArchitectSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 480" width="1200" height="480" role="img" aria-labelledby="hero-t hero-d">
  <title id="hero-t">Ashutosh Kumar Choubey — Software Engineer | System Design | AI Orchestration</title>
  <desc id="hero-d">Software Engineer, System Design and AI Orchestration. Agentic AI, AI Architecture, and enterprise systems.</desc>
  <defs>
    ${commonDefs}
    <clipPath id="hero-clip"><rect width="1200" height="480" rx="20"/></clipPath>
    <clipPath id="hero-arch"><path d="M847 380 V202 A118 118 0 0 1 1083 202 V380 Z"/></clipPath>
    <linearGradient id="hero-name-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#F8F0F3"/>
      <stop offset=".45" stop-color="#E5B5C7"/>
      <stop offset="1" stop-color="#C77B9B"/>
    </linearGradient>
    <linearGradient id="hero-pill-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#27101C"/>
      <stop offset=".5" stop-color="#190B12"/>
      <stop offset="1" stop-color="#10070C"/>
    </linearGradient>
    <linearGradient id="hero-photo-grade" x1="0" y1="0" x2="0" y2="1">
      <stop offset=".86" stop-color="#10070C" stop-opacity="0"/>
      <stop offset="1" stop-color="#10070C" stop-opacity=".75"/>
    </linearGradient>
    <linearGradient id="hero-photo-sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset=".5" stop-color="#FFFFFF" stop-opacity=".12"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="hero-scan" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#E5B5C7" stop-opacity="0"/>
      <stop offset=".5" stop-color="#E5B5C7" stop-opacity=".06"/>
      <stop offset="1" stop-color="#E5B5C7" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <style>
    ${commonStyles}
    .hero-rise { animation: hero-rise 1.2s cubic-bezier(.16,1,.3,1) both; }
    .hero-photo { animation: hero-photo 1.5s cubic-bezier(.16,1,.3,1) .35s both; }
    @keyframes hero-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes hero-photo { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .hero-rise, .hero-photo { animation: none; } }
  </style>
  <g clip-path="url(#hero-clip)">
    <!-- Base Deep Obsidian Canvas -->
    <rect width="1200" height="480" fill="url(#cyber-bg)"/>
    <!-- Ambient Light Fields in Rich Rose & Plum -->
    <ellipse cx="920" cy="160" rx="380" ry="260" fill="url(#cyber-glow-rose)">
      <animateTransform attributeName="transform" type="translate" values="0 0; -40 25; 0 0" dur="20s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1; .45 0 .55 1"/>
    </ellipse>
    <ellipse cx="240" cy="420" rx="340" ry="200" fill="url(#cyber-glow-plum)">
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
      <!-- Terminal Pill Top-Left -->
      <g transform="translate(56 46)">
        <rect width="364" height="34" rx="17" fill="#190B12" stroke="#C77B9B" stroke-opacity=".4"/>
        <circle cx="18" cy="17" r="4.5" fill="#E5B5C7" filter="url(#cyber-glow)">
          <animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <text class="mono" x="32" y="22" font-size="12" font-weight="600" fill="#B6A3AC"><tspan fill="#E5B5C7">~/ashutosh</tspan> $ build <tspan fill="#C77B9B">--scale-enterprise</tspan></text>
      </g>

      <!-- Main Name Heading -->
      <text class="sans" x="54" y="142" font-size="52" font-weight="800" letter-spacing="-0.5" fill="url(#hero-name-grad)">Ashutosh Kumar Choubey</text>

      <!-- Clean Rectangular Shape Container -->
      <g transform="translate(56 166)">
        <rect width="660" height="44" rx="10" fill="url(#hero-pill-grad)" stroke="#C77B9B" stroke-opacity=".35" stroke-width="1.2"/>
        <path d="M16 43H644" stroke="#C77B9B" stroke-opacity=".4" stroke-width="1.2"/>
        <text class="sans" x="22" y="28" font-size="17" font-weight="600" fill="#F8F0F3">Software Engineer <tspan fill="#E5B5C7">·</tspan> System Design <tspan fill="#C77B9B">·</tspan> AI Orchestration</text>
      </g>

      <!-- Focused Architectural Badges -->
      <g transform="translate(56 230)">
        <g><rect width="144" height="30" rx="15" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="72" y="19" text-anchor="middle" font-size="11.5" font-weight="600" fill="#E5B5C7">Software Engineer</text></g>
        <g transform="translate(154 0)"><rect width="130" height="30" rx="15" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="65" y="19" text-anchor="middle" font-size="11.5" font-weight="600" fill="#C77B9B">System Design</text></g>
        <g transform="translate(294 0)"><rect width="144" height="30" rx="15" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="72" y="19" text-anchor="middle" font-size="11.5" font-weight="600" fill="#F8F0F3">AI Architecture</text></g>
        <g transform="translate(448 0)"><rect width="112" height="30" rx="15" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="56" y="19" text-anchor="middle" font-size="11.5" font-weight="600" fill="#E5B5C7">Agentic AI</text></g>
        <g transform="translate(570 0)"><rect width="144" height="30" rx="15" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="72" y="19" text-anchor="middle" font-size="11.5" font-weight="600" fill="#C77B9B">AI Orchestration</text></g>
      </g>

      <!-- Horizontal Divider -->
      <line x1="56" y1="288" x2="720" y2="288" stroke="#C77B9B" stroke-opacity=".25"/>

      <!-- Capability Highlights Metrics -->
      <g transform="translate(56 342)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8F0F3">Angular</text>
        <text class="sans" y="24" font-size="12" font-weight="600" fill="#E5B5C7">REACTIVE ARCHITECTURE</text>
      </g>
      <g transform="translate(290 342)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8F0F3">TypeScript</text>
        <text class="sans" y="24" font-size="12" font-weight="600" fill="#C77B9B">STRICT TYPINGS</text>
      </g>
      <g transform="translate(510 342)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8F0F3">AI Systems</text>
        <text class="sans" y="24" font-size="12" font-weight="600" fill="#E5B5C7">AGENT ORCHESTRATION</text>
      </g>
    </g>

    <!-- Right Column: User Portrait in Architectural Arch -->
    <g class="hero-photo">
      <!-- Rotating Concentric Orbit Rings Around Portrait -->
      <g transform="translate(965 240)">
        <circle r="200" fill="none" stroke="#C77B9B" stroke-opacity=".2" stroke-width="1"/>
        <circle r="150" fill="none" stroke="#E5B5C7" stroke-opacity=".25" stroke-dasharray="6 8"/>

        <!-- Orbiting Satellite Nodes -->
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="45s" repeatCount="indefinite"/>
          <circle cx="200" cy="0" r="4.5" fill="#E5B5C7" filter="url(#cyber-glow)"/>
          <circle cx="-141" cy="-141" r="3.5" fill="#701A3D" filter="url(#cyber-glow)"/>
          <circle cx="0" cy="150" r="3" fill="#C77B9B"/>
        </g>
      </g>

      <!-- Clipped Portrait Photo (Full Rich Vibrant Color, Seamless Ambient Blend) -->
      <g clip-path="url(#hero-arch)">
        <rect x="847" y="84" width="236" height="296" fill="url(#cyber-bg)"/>
        <ellipse cx="965" cy="200" rx="100" ry="110" fill="url(#cyber-glow-rose)" opacity=".7"/>
        <image href="data:image/jpeg;base64,${photoBase64}" x="847" y="84" width="236" height="296" preserveAspectRatio="xMidYMin slice"/>
        <rect x="847" y="84" width="236" height="296" fill="url(#hero-photo-grade)"/>
        <!-- Diagonal Animated Sheen Reflection -->
        <rect x="700" y="84" width="90" height="296" fill="url(#hero-photo-sheen)" transform="skewX(-16)">
          <animate attributeName="x" values="700;1260;1260" keyTimes="0;.35;1" dur="8s" begin="2.5s" repeatCount="indefinite"/>
        </rect>
      </g>

      <!-- Arch Frame Outline & Corner Brackets -->
      <path d="M847 380 V202 A118 118 0 0 1 1083 202 V380 Z" fill="none" stroke="url(#cyber-trace)" stroke-width="2"/>
      <path d="M833 290 v-20 h20" fill="none" stroke="#E5B5C7" stroke-width="1.8"/>
      <path d="M1097 394 v-20 M1097 394 h-20" fill="none" stroke="#C77B9B" stroke-width="1.8"/>
    </g>

    <!-- Base Perimeter Border & Surrounding Corner Trace -->
    <rect x=".5" y=".5" width="1199" height="479" rx="19.5" fill="none" stroke="#C77B9B" stroke-opacity=".2"/>
    <rect class="trace-anim" x=".5" y=".5" width="1199" height="479" rx="19.5" fill="none" stroke="url(#cyber-trace)" stroke-width="2.0" stroke-linecap="round"/>
  </g>
</svg>
`;

  // 2. TERMINAL SYSTEM SVG (MacBook / Linux Terminal Window)
  const terminalSystemSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 420" width="1200" height="420" role="img" aria-labelledby="term-t term-d">
  <title id="term-t">System Architecture CLI — Ashutosh Kumar Choubey</title>
  <desc id="term-d">Developer terminal window with system diagnostics, whoami, focus, platform, shipped repositories, and architecture core.</desc>
  <defs>
    ${commonDefs}
    <clipPath id="term-clip"><rect width="1200" height="420" rx="20"/></clipPath>
    <pattern id="term-scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#F8F0F3" opacity=".025"/></pattern>
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
    <ellipse cx="980" cy="180" rx="400" ry="240" fill="url(#cyber-glow-rose)"/>
    <ellipse cx="220" cy="380" rx="340" ry="200" fill="url(#cyber-glow-plum)"/>
    <rect width="1200" height="420" fill="url(#cyber-grid)"/>

    ${lavaSparks(1200, 420, 40)}

    <!-- Terminal Window -->
    <g class="t-fade">
      <rect x="40" y="40" width="760" height="340" rx="14" fill="#10070C" stroke="#C77B9B" stroke-opacity=".3"/>
      <rect x="40" y="40" width="760" height="340" rx="14" fill="url(#term-scan)"/>
      <path d="M40 54 a14 14 0 0 1 14 -14 H786 a14 14 0 0 1 14 14 V76 H40 Z" fill="#190B12"/>
      <line x1="40" y1="76" x2="800" y2="76" stroke="#C77B9B" stroke-opacity=".2"/>
      <!-- Window Controls in Obsidian Garnet/Wine -->
      <circle cx="62" cy="58" r="5" fill="#701A3D"/>
      <circle cx="80" cy="58" r="5" fill="#451126"/>
      <circle cx="98" cy="58" r="5" fill="#451126"/>
      <text class="mono" x="420" y="62" text-anchor="middle" font-size="11" letter-spacing="1.5" fill="#B6A3AC">ashutosh@worldgyan: ~ (zsh)</text>
    </g>

    <!-- Terminal Code Execution Stream -->
    <g class="mono" font-size="13">
      <!-- 01 whoami -->
      <g clip-path="url(#t-c0)"><text x="72" y="128" fill="#C77B9B">$</text><text x="94" y="128" fill="#F8F0F3">whoami</text></g>
      <g clip-path="url(#t-c1)"><text x="72" y="153" fill="#701A3D">→</text><text x="94" y="153" fill="#B6A3AC">Ashutosh Kumar Choubey · Software Engineer · Founder, WorldGyan</text></g>

      <!-- 02 focus.txt -->
      <g clip-path="url(#t-c2)"><text x="72" y="178" fill="#C77B9B">$</text><text x="94" y="178" fill="#F8F0F3">cat focus.txt</text></g>
      <g clip-path="url(#t-c3)"><text x="72" y="203" fill="#701A3D">→</text><text x="94" y="203" fill="#B6A3AC">Software Engineering · System Design · AI Orchestration</text></g>

      <!-- 03 platform.txt -->
      <g clip-path="url(#t-c4)"><text x="72" y="228" fill="#C77B9B">$</text><text x="94" y="228" fill="#F8F0F3">cat platform.txt</text></g>
      <g clip-path="url(#t-c5)"><text x="72" y="253" fill="#701A3D">→</text><text x="94" y="253" fill="#B6A3AC">WorldGyan (worldgyan.com) · Research, System Design &amp; AI Systems</text></g>

      <!-- 04 shipped -->
      <g clip-path="url(#t-c6)"><text x="72" y="278" fill="#C77B9B">$</text><text x="94" y="278" fill="#F8F0F3">ls ./shipped</text></g>
      <g clip-path="url(#t-c7)"><text x="72" y="303" fill="#701A3D">→</text><text x="94" y="303" fill="#B6A3AC">angular-architecture  rxjs-operator-lab  ngrx-effects  typescript-type-system</text></g>

      <!-- 05 principle -->
      <g clip-path="url(#t-c8)"><text x="72" y="328" fill="#C77B9B">$</text><text x="94" y="328" fill="#F8F0F3">echo $PRINCIPLE</text></g>
      <g clip-path="url(#t-c9)"><text x="72" y="353" fill="#701A3D">→</text><text x="94" y="353" fill="#B6A3AC">scalable software systems · deterministic AI orchestration</text></g>
    </g>

    <!-- Blinking Terminal Prompt Cursor -->
    <rect x="72" y="364" width="8" height="16" fill="#E5B5C7" class="t-fade" style="animation-delay:7.2s">
      <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.5;1" dur="1s" repeatCount="indefinite"/>
    </rect>

    <!-- Right Column: Architecture Capability Cards -->
    <g class="t-card" style="animation-delay:0.8s">
      <!-- Card 1: Frontend Architecture -->
      <g transform="translate(830 40)">
        <rect width="330" height="96" rx="12" fill="#190B12" stroke="#C77B9B" stroke-opacity=".28"/>
        <line x1="16" y1="18" x2="16" y2="78" stroke="#C77B9B" stroke-width="3" stroke-linecap="round"/>
        <text class="sans" x="32" y="38" font-size="13" font-weight="600" letter-spacing="0.5" fill="#E5B5C7">Frontend Architecture</text>
        <text class="serif" x="32" y="60" font-size="16" font-weight="300" fill="#F8F0F3">Angular &amp; TypeScript</text>
        <text class="sans" x="32" y="80" font-size="12" fill="#B6A3AC">Component topology, signals &amp; reactive state</text>
      </g>

      <!-- Card 2: Intelligent Systems -->
      <g transform="translate(830 154)">
        <rect width="330" height="104" rx="12" fill="#190B12" stroke="#C77B9B" stroke-opacity=".28"/>
        <line x1="16" y1="18" x2="16" y2="86" stroke="#701A3D" stroke-width="3" stroke-linecap="round"/>
        <text class="sans" x="32" y="38" font-size="13" font-weight="600" letter-spacing="0.5" fill="#E5B5C7">Intelligent Systems</text>
        <text class="serif" x="32" y="60" font-size="16" font-weight="300" fill="#F8F0F3">AI Architecture</text>
        <text class="sans" x="32" y="80" font-size="12" fill="#B6A3AC">Agent workflows, tool execution &amp; MCP</text>
        <text class="sans" x="32" y="96" font-size="11" fill="#C77B9B">Evaluation telemetry &amp; human decisions</text>
      </g>

      <!-- Card 3: Enterprise Engineering -->
      <g transform="translate(830 276)">
        <rect width="330" height="104" rx="12" fill="#190B12" stroke="#C77B9B" stroke-opacity=".28"/>
        <line x1="16" y1="18" x2="16" y2="86" stroke="#E5B5C7" stroke-width="3" stroke-linecap="round"/>
        <text class="sans" x="32" y="38" font-size="13" font-weight="600" letter-spacing="0.5" fill="#E5B5C7">Enterprise Engineering</text>
        <text class="serif" x="32" y="60" font-size="16" font-weight="300" fill="#F8F0F3">Systems Design &amp; Quality</text>
        <text class="sans" x="32" y="80" font-size="12" fill="#B6A3AC">State management, HTTP interceptors &amp; APIs</text>
        <text class="sans" x="32" y="96" font-size="11" fill="#C77B9B">Automated testing &amp; CI/CD delivery</text>
      </g>
    </g>

    <!-- Base Perimeter Border & Surrounding Corner Trace -->
    <rect x=".5" y=".5" width="1199" height="419" rx="19.5" fill="none" stroke="#C77B9B" stroke-opacity=".2"/>
    <rect class="trace-anim" x=".5" y=".5" width="1199" height="419" rx="19.5" fill="none" stroke="url(#cyber-trace)" stroke-width="2.0" stroke-linecap="round"/>
  </g>
</svg>
`;

  // 3. ENGINEERING SYSTEMS SVG (WorldGyan Logo + Founder + Continuously Moving Cinematic Orbit)
  const engineeringSystemsSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 540" width="1200" height="540" role="img" aria-labelledby="eng-t eng-d">
  <title id="eng-t">WorldGyan — Engineering Systems &amp; Architecture</title>
  <desc id="eng-d">Founder Ashutosh Kumar Choubey, WorldGyan. Frontend architecture, enterprise engineering, system design, performance and scalability.</desc>
  <defs>
    ${commonDefs}
    <clipPath id="eng-clip"><rect width="1200" height="540" rx="20"/></clipPath>
  </defs>
  <style>
    ${commonStyles}
    .eng-in { animation: eng-in 1.2s cubic-bezier(.16,1,.3,1) both; }
    @keyframes eng-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .eng-in { animation: none; } }
  </style>
  <g clip-path="url(#eng-clip)">
    <!-- Base Deep Obsidian Canvas -->
    <rect width="1200" height="540" fill="url(#cyber-bg)"/>
    <ellipse cx="600" cy="240" rx="420" ry="260" fill="url(#cyber-glow-rose)"/>
    <rect width="1200" height="540" fill="url(#cyber-grid)"/>

    ${lavaSparks(1200, 540, 60)}

    <!-- Top Header: WorldGyan Logo & Founder Presentation -->
    <g class="eng-in" style="animation-delay: 0.1s;">
      <g transform="translate(56 36)">
        <!-- Embedded WorldGyan Logo -->
        <image x="0" y="0" width="48" height="48" href="data:image/png;base64,${logoBase64}"/>
        <text class="sans" x="62" y="24" font-size="22" font-weight="700">
          <tspan fill="#F8F0F3">World</tspan><tspan fill="#E5B5C7">Gyan</tspan>
          <tspan font-size="14" font-weight="400" fill="#B6A3AC" dx="12">· Next-Gen AI &amp; Engineering</tspan>
        </text>
        <text class="sans" x="62" y="44" font-size="13" font-weight="600" fill="#E5B5C7">Founder &amp; Principal Architect: <tspan fill="#F8F0F3">Ashutosh Kumar Choubey</tspan></text>
      </g>
      <g transform="translate(1144 50)">
        <rect x="-210" y="-14" width="210" height="28" rx="14" fill="#190B12" stroke="#C77B9B" stroke-opacity=".4"/>
        <text class="mono" x="-105" y="4" font-size="11" font-weight="700" text-anchor="middle" fill="#E5B5C7">PART 02 · ARCHITECTURE PLATFORM</text>
      </g>
      <line x1="56" y1="96" x2="1144" y2="96" stroke="#C77B9B" stroke-opacity=".25"/>
    </g>

    <!-- Center Cinematic Orbiting Circles around "Architecture" -->
    <g transform="translate(600 230)">
      <!-- Outer Rotating Ellipse -->
      <g fill="none" stroke="#C77B9B" stroke-opacity=".3" stroke-width="1.4">
        <ellipse cx="0" cy="0" rx="110" ry="136">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="28s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="0" cy="0" rx="136" ry="60">
          <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="22s" repeatCount="indefinite"/>
        </ellipse>
      </g>

      <!-- Counter-Rotating Dashed Orbit with Glowing Satellite Node -->
      <g fill="none" stroke="#E5B5C7" stroke-opacity=".5" stroke-width="1.6">
        <circle r="120" stroke-dasharray="24 16 6 16">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="18s" repeatCount="indefinite"/>
        </circle>
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="18s" repeatCount="indefinite"/>
          <circle cx="120" cy="0" r="4.5" fill="#E5B5C7" filter="url(#cyber-glow)"/>
        </g>
        <g>
          <animateTransform attributeName="transform" type="rotate" from="180" to="540" dur="24s" repeatCount="indefinite"/>
          <circle cx="120" cy="0" r="4" fill="#701A3D" filter="url(#cyber-glow)"/>
        </g>
      </g>

      <!-- 3D Isometric Stack in Obsidian Tones -->
      <g transform="translate(-44 -36)">
        <path d="M0 0l44 -20L88 0 44 20z" fill="#27101C" stroke="#E5B5C7" stroke-width="1.2"/>
        <path d="M0 0v8l44 20v-8M88 0v8l-44 20" fill="#190B12" stroke="#C77B9B" stroke-width="1"/>
        <path d="M0 24l44 -20L88 24 44 44z" fill="#451126" stroke="#C77B9B" stroke-width="1.2"/>
        <path d="M0 24v8l44 20v-8M88 24v8l-44 20" fill="#10070C" stroke="#701A3D" stroke-width="1"/>
        <path d="M0 48l44 -20L88 48 44 68z" fill="#190B12" stroke="#E5B5C7" stroke-width="1.2"/>
      </g>
      <text class="sans" x="0" y="68" font-size="13" font-weight="700" letter-spacing="1" fill="#E5B5C7" text-anchor="middle">ARCHITECTURE</text>
    </g>

    <!-- 4 Core Engineering Pillar Cards -->
    <g class="eng-in" style="animation-delay: 0.25s;">
      <!-- Card 1: Frontend Architecture (Top Left) -->
      <g transform="translate(56 120)">
        <rect width="360" height="92" rx="12" fill="#190B12" stroke="#C77B9B" stroke-opacity=".3"/>
        <text class="mono" x="20" y="28" font-size="11" font-weight="700" fill="#E5B5C7">01 · ARCHITECTURE</text>
        <text class="sans" x="20" y="54" font-size="19" font-weight="700" fill="#F8F0F3">Frontend Architecture</text>
        <text class="sans" x="20" y="76" font-size="13" fill="#B6A3AC">Components · Design Systems · Signals Reactive State</text>
      </g>

      <!-- Card 2: Enterprise Engineering (Top Right) -->
      <g transform="translate(784 120)">
        <rect width="360" height="92" rx="12" fill="#190B12" stroke="#C77B9B" stroke-opacity=".3"/>
        <text class="mono" x="20" y="28" font-size="11" font-weight="700" fill="#C77B9B">02 · ENTERPRISE</text>
        <text class="sans" x="20" y="54" font-size="19" font-weight="700" fill="#F8F0F3">Enterprise Engineering</text>
        <text class="sans" x="20" y="76" font-size="13" fill="#B6A3AC">Enterprise Integration · REST APIs · Testing &amp; Quality</text>
      </g>

      <!-- Card 3: System Design (Bottom Left) -->
      <g transform="translate(56 242)">
        <rect width="360" height="92" rx="12" fill="#190B12" stroke="#C77B9B" stroke-opacity=".3"/>
        <text class="mono" x="20" y="28" font-size="11" font-weight="700" fill="#E5B5C7">03 · DESIGN</text>
        <text class="sans" x="20" y="54" font-size="19" font-weight="700" fill="#F8F0F3">System Design</text>
        <text class="sans" x="20" y="76" font-size="13" fill="#B6A3AC">System Boundaries · State Isolation · Modular Architecture</text>
      </g>

      <!-- Card 4: Performance & Scalability (Bottom Right) -->
      <g transform="translate(784 242)">
        <rect width="360" height="92" rx="12" fill="#190B12" stroke="#C77B9B" stroke-opacity=".3"/>
        <text class="mono" x="20" y="28" font-size="11" font-weight="700" fill="#C77B9B">04 · SCALABILITY</text>
        <text class="sans" x="20" y="54" font-size="19" font-weight="700" fill="#F8F0F3">Performance &amp; Scalability</text>
        <text class="sans" x="20" y="76" font-size="13" fill="#B6A3AC">Signals Change Detection · Performance Optimization</text>
      </g>
    </g>

    <!-- Lower Section: Exploring AI Engineering -->
    <g class="eng-in" style="animation-delay: 0.4s;">
      <line x1="56" y1="364" x2="1144" y2="364" stroke="#C77B9B" stroke-opacity=".25"/>
      <text class="sans" x="56" y="394" font-size="12" font-weight="700" letter-spacing="1" fill="#E5B5C7">EXPLORING / AI ENGINEERING &amp; ORCHESTRATION</text>
      
      <!-- AI Architecture Card -->
      <g transform="translate(56 414)">
        <rect width="344" height="74" rx="10" fill="#10070C" stroke="#C77B9B" stroke-opacity=".25"/>
        <circle cx="20" cy="26" r="3.5" fill="#E5B5C7"/>
        <text class="sans" x="34" y="30" font-size="16" font-weight="700" fill="#F8F0F3">AI Architecture</text>
        <text class="sans" x="34" y="52" font-size="12.5" fill="#B6A3AC">Context engineering · Retrieval · Model routing</text>
      </g>

      <!-- Agentic AI Card -->
      <g transform="translate(428 414)">
        <rect width="344" height="74" rx="10" fill="#10070C" stroke="#C77B9B" stroke-opacity=".25"/>
        <circle cx="20" cy="26" r="3.5" fill="#C77B9B"/>
        <text class="sans" x="34" y="30" font-size="16" font-weight="700" fill="#F8F0F3">Agentic AI</text>
        <text class="sans" x="34" y="52" font-size="12.5" fill="#B6A3AC">Autonomous tools · Reasoning · MCP contracts</text>
      </g>

      <!-- AI Orchestration Card -->
      <g transform="translate(800 414)">
        <rect width="344" height="74" rx="10" fill="#10070C" stroke="#C77B9B" stroke-opacity=".25"/>
        <circle cx="20" cy="26" r="3.5" fill="#E5B5C7"/>
        <text class="sans" x="34" y="30" font-size="16" font-weight="700" fill="#F8F0F3">AI Orchestration</text>
        <text class="sans" x="34" y="52" font-size="12.5" fill="#B6A3AC">State machines · Multi-agent workflows · Evals</text>
      </g>

      <text class="mono" x="56" y="514" font-size="12" fill="#E5B5C7">LLM Integration · Model Context Protocol (MCP) · Automated Evaluations · Human Review</text>
    </g>

    <!-- Base Perimeter Border & Surrounding Corner Trace -->
    <rect x=".5" y=".5" width="1199" height="539" rx="19.5" fill="none" stroke="#C77B9B" stroke-opacity=".2"/>
    <rect class="trace-anim" x=".5" y=".5" width="1199" height="539" rx="19.5" fill="none" stroke="url(#cyber-trace)" stroke-width="2.0" stroke-linecap="round"/>
  </g>
</svg>
`;

  // 3B. ARCHITECTURE LEADERSHIP & STANDING PORTRAIT SVG
  const architectureLeadershipSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 560" width="1200" height="560" role="img" aria-labelledby="ldr-t ldr-d">
  <title id="ldr-t">Ashutosh Kumar Choubey — Architecture Leadership &amp; Scalability</title>
  <desc id="ldr-d">Executive standing portrait and architecture leadership pillars. Principal Frontend Architect &amp; Systems Engineer. Founder of WorldGyan.</desc>
  <defs>
    ${commonDefs}
    <clipPath id="ldr-clip"><rect width="1200" height="560" rx="20"/></clipPath>
    <clipPath id="ldr-arch"><rect x="0" y="0" width="294" height="512" rx="20"/></clipPath>
    <linearGradient id="ldr-sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#F8F0F3"/>
      <stop offset=".5" stop-color="#E5B5C7"/>
      <stop offset="1" stop-color="#C77B9B"/>
    </linearGradient>
    <linearGradient id="standing-back-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#27101C" stop-opacity=".9"/>
      <stop offset=".45" stop-color="#190B12" stop-opacity=".85"/>
      <stop offset="1" stop-color="#10070C" stop-opacity=".95"/>
    </linearGradient>
    <linearGradient id="standing-foot-blend" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#10070C" stop-opacity="0"/>
      <stop offset=".7" stop-color="#10070C" stop-opacity=".45"/>
      <stop offset="1" stop-color="#10070C" stop-opacity=".9"/>
    </linearGradient>
  </defs>
  <style>
    ${commonStyles}
    .ldr-in { animation: ldr-in 1.2s cubic-bezier(.16,1,.3,1) both; }
    .ldr-photo { animation: ldr-photo 1.4s cubic-bezier(.16,1,.3,1) .25s both; }
    @keyframes ldr-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
    @keyframes ldr-photo { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .ldr-in, .ldr-photo { animation: none; } }
  </style>
  <g clip-path="url(#ldr-clip)">
    <!-- Base Deep Obsidian Canvas -->
    <rect width="1200" height="560" fill="url(#cyber-bg)"/>
    <!-- Studio Ambient Light Fields in Rose & Plum -->
    <ellipse cx="995" cy="240" rx="360" ry="260" fill="url(#cyber-glow-rose)">
      <animateTransform attributeName="transform" type="translate" values="0 0; -25 20; 0 0" dur="18s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1; .45 0 .55 1"/>
    </ellipse>
    <ellipse cx="280" cy="420" rx="340" ry="220" fill="url(#cyber-glow-plum)">
      <animateTransform attributeName="transform" type="translate" values="0 0; 35 -15; 0 0" dur="22s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1; .45 0 .55 1"/>
    </ellipse>
    <!-- Technical Grid -->
    <rect width="1200" height="560" fill="url(#cyber-grid)"/>

    ${lavaSparks(1200, 560, 40)}

    <!-- LEFT COLUMN: ARCHITECTURE LEADERSHIP & STRATEGY (x: 56 to 820) -->
    <g class="ldr-in" style="animation-delay: 0.1s;">
      <!-- Category Badge -->
      <g transform="translate(56 42)">
        <rect width="390" height="32" rx="16" fill="#190B12" stroke="#C77B9B" stroke-opacity=".4"/>
        <circle cx="16" cy="16" r="4.5" fill="#E5B5C7" filter="url(#cyber-glow)">
          <animate attributeName="opacity" values="1;.35;1" dur="2.2s" repeatCount="indefinite"/>
        </circle>
        <text class="mono" x="32" y="20.5" font-size="11.5" font-weight="700" letter-spacing="1.2" fill="#E5B5C7">ARCHITECTURE LEADERSHIP &amp; STRATEGY</text>
      </g>

      <!-- Headline -->
      <text class="serif" x="56" y="112" font-size="34" font-weight="300" letter-spacing="-0.8" fill="#F8F0F3">Principal Frontend Architect <tspan font-style="italic" fill="url(#ldr-sheen)">&amp; Systems Engineer</tspan></text>
      <text class="sans" x="56" y="142" font-size="14.5" font-weight="500" fill="#E5B5C7">Founder &amp; Research Lead at WorldGyan <tspan fill="#B6A3AC">· Next-Generation AI &amp; Software Systems</tspan></text>
      
      <!-- Subtle Obsidian Divider -->
      <line x1="56" y1="164" x2="810" y2="164" stroke="#C77B9B" stroke-opacity=".25"/>

      <!-- Three Core Pillars -->
      <!-- Pillar 1: Enterprise Frontend Systems -->
      <g transform="translate(56 182)">
        <rect width="754" height="76" rx="12" fill="#190B12" stroke="#C77B9B" stroke-opacity=".3"/>
        <g transform="translate(20 18)">
          <circle cx="10" cy="10" r="10" fill="#27101C" stroke="#E5B5C7" stroke-width="1.2"/>
          <text class="mono" x="10" y="14" font-size="10.5" font-weight="700" text-anchor="middle" fill="#E5B5C7">01</text>
          <text class="sans" x="30" y="14" font-size="15.5" font-weight="700" fill="#F8F0F3">Fine-Grained Reactive Systems</text>
          <text class="sans" x="30" y="34" font-size="12.5" fill="#B6A3AC">Signals-driven reactive state, zoneless execution, O(1) change detection &amp; modular architecture.</text>
        </g>
      </g>

      <!-- Pillar 2: High-Reliability Architecture -->
      <g transform="translate(56 270)">
        <rect width="754" height="76" rx="12" fill="#190B12" stroke="#C77B9B" stroke-opacity=".3"/>
        <g transform="translate(20 18)">
          <circle cx="10" cy="10" r="10" fill="#27101C" stroke="#C77B9B" stroke-width="1.2"/>
          <text class="mono" x="10" y="14" font-size="10.5" font-weight="700" text-anchor="middle" fill="#C77B9B">02</text>
          <text class="sans" x="30" y="14" font-size="15.5" font-weight="700" fill="#F8F0F3">Enterprise Interceptor &amp; Concurrency Pipelines</text>
          <text class="sans" x="30" y="34" font-size="12.5" fill="#B6A3AC">Atomic token refresh mutex queues, resilient HTTP pipelines, circuit breakers &amp; contract safety.</text>
        </g>
      </g>

      <!-- Pillar 3: Agentic AI Orchestration -->
      <g transform="translate(56 358)">
        <rect width="754" height="76" rx="12" fill="#190B12" stroke="#C77B9B" stroke-opacity=".3"/>
        <g transform="translate(20 18)">
          <circle cx="10" cy="10" r="10" fill="#27101C" stroke="#E5B5C7" stroke-width="1.2"/>
          <text class="mono" x="10" y="14" font-size="10.5" font-weight="700" text-anchor="middle" fill="#E5B5C7">03</text>
          <text class="sans" x="30" y="14" font-size="15.5" font-weight="700" fill="#F8F0F3">Autonomous Multi-Agent Orchestration</text>
          <text class="sans" x="30" y="34" font-size="12.5" fill="#B6A3AC">Model Context Protocol (MCP), dynamic tool routing, evaluation gates &amp; Plan-Act-Reflect cycles.</text>
        </g>
      </g>

      <!-- Bottom Metric Strip -->
      <g transform="translate(56 450)">
        <!-- Metric 1 -->
        <g transform="translate(0 0)">
          <rect width="180" height="54" rx="10" fill="#10070C" stroke="#C77B9B" stroke-opacity=".25"/>
          <text class="mono" x="16" y="24" font-size="10.5" font-weight="700" fill="#E5B5C7">REACTIVITY</text>
          <text class="sans" x="16" y="42" font-size="13" font-weight="700" fill="#F8F0F3">100% Signals Core</text>
        </g>
        <!-- Metric 2 -->
        <g transform="translate(191 0)">
          <rect width="180" height="54" rx="10" fill="#10070C" stroke="#C77B9B" stroke-opacity=".25"/>
          <text class="mono" x="16" y="24" font-size="10.5" font-weight="700" fill="#C77B9B">PERFORMANCE</text>
          <text class="sans" x="16" y="42" font-size="13" font-weight="700" fill="#F8F0F3">O(1) Change Detection</text>
        </g>
        <!-- Metric 3 -->
        <g transform="translate(382 0)">
          <rect width="180" height="54" rx="10" fill="#10070C" stroke="#C77B9B" stroke-opacity=".25"/>
          <text class="mono" x="16" y="24" font-size="10.5" font-weight="700" fill="#E5B5C7">ORCHESTRATION</text>
          <text class="sans" x="16" y="42" font-size="13" font-weight="700" fill="#F8F0F3">Multi-Agent Loops</text>
        </g>
        <!-- Metric 4 -->
        <g transform="translate(573 0)">
          <rect width="181" height="54" rx="10" fill="#10070C" stroke="#C77B9B" stroke-opacity=".25"/>
          <text class="mono" x="16" y="24" font-size="10.5" font-weight="700" fill="#C77B9B">PLATFORM</text>
          <text class="sans" x="16" y="42" font-size="13" font-weight="700" fill="#F8F0F3">WorldGyan Research</text>
        </g>
      </g>
    </g>

    <!-- RIGHT COLUMN: STANDING FIGURE & ARCHITECTURAL PEDESTAL (x: 850 to 1160) -->
    <g class="ldr-photo">
      <!-- Architectural Pedestal & Framing Arch -->
      <g transform="translate(850 24)">
        <!-- Backdrop Arch Card -->
        <rect width="294" height="512" rx="20" fill="url(#standing-back-grad)" stroke="#C77B9B" stroke-opacity=".35"/>
        
        <!-- Rotating Ambient Orbital Halo -->
        <g transform="translate(147 210)">
          <ellipse cx="0" cy="0" rx="120" ry="145" fill="none" stroke="#C77B9B" stroke-opacity=".25" stroke-width="1.2">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="30s" repeatCount="indefinite"/>
          </ellipse>
          <circle r="132" fill="none" stroke="#E5B5C7" stroke-opacity=".35" stroke-width="1.4" stroke-dasharray="16 12 4 12">
            <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="24s" repeatCount="indefinite"/>
          </circle>
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="24s" repeatCount="indefinite"/>
            <circle cx="132" cy="0" r="3.5" fill="#E5B5C7" filter="url(#cyber-glow)"/>
          </g>
        </g>

        <!-- Floor Pedestal Reflection at Feet -->
        <ellipse cx="147" cy="496" rx="90" ry="12" fill="#E5B5C7" opacity=".18" filter="url(#cyber-glow)"/>
        <ellipse cx="147" cy="496" rx="55" ry="6" fill="#F8F0F3" opacity=".28"/>

        <!-- Standing Portrait in 100% Vibrant Color (Clipped Inside Arch) -->
        <g clip-path="url(#ldr-arch)">
          <image x="24" y="6" width="246" height="500" href="data:image/png;base64,${standingPhotoBase64}" preserveAspectRatio="xMidYMax meet"/>
          <!-- Grounding Gradient Overlay for Natural Studio Obsidian Blend -->
          <rect x="0" y="440" width="294" height="72" fill="url(#standing-foot-blend)"/>
        </g>

        <!-- Status Pill Overlay on Arch -->
        <g transform="translate(20 468)">
          <rect width="254" height="28" rx="14" fill="#10070C" fill-opacity=".85" stroke="#C77B9B" stroke-opacity=".4"/>
          <circle cx="16" cy="14" r="3.5" fill="#E5B5C7" filter="url(#cyber-glow)">
            <animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text class="mono" x="28" y="18" font-size="10.5" font-weight="600" fill="#E5B5C7">Ashutosh Kumar Choubey · Systems</text>
        </g>
      </g>
    </g>

    <!-- Outer Perimeter Border & Corner Flow Trace -->
    <rect x=".5" y=".5" width="1199" height="559" rx="19.5" fill="none" stroke="#C77B9B" stroke-opacity=".2"/>
    <rect class="trace-anim" x=".5" y=".5" width="1199" height="559" rx="19.5" fill="none" stroke="url(#cyber-trace)" stroke-width="2.0" stroke-linecap="round"/>
  </g>
</svg>
`;

  // 4. PROJECT 1: ANGULAR ARCHITECTURE STUDY SVG
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
    <ellipse cx="880" cy="180" rx="420" ry="240" fill="url(#cyber-glow-rose)"/>
    <rect x="700" width="500" height="370" fill="url(#cyber-grid)"/>

    ${lavaSparks(1200, 370, 80)}

    <!-- Left Content Column -->
    <g class="p1-in" style="animation-delay: 0.15s;">
      <text class="sans" x="56" y="62" font-size="12" font-weight="600" letter-spacing="1" fill="#E5B5C7">PART 05.1 · ARCHITECTURE · ANGULAR · SIGNALS</text>
      <text class="serif" x="54" y="126" font-size="50" font-weight="300" letter-spacing="-1" fill="#F8F0F3">Angular Architecture Study</text>
      <text class="sans" x="56" y="166" font-size="16.5" fill="#B6A3AC">Signals reactive state, HTTP interceptors, authentication flows and architecture patterns.</text>
      <text class="mono" x="56" y="200" font-size="12.5" fill="#F8F0F3"><tspan fill="#C77B9B">Built ›</tspan> Signals reactive state, authentication interceptors &amp; modular app.config</text>
      <line x1="56" y1="226" x2="680" y2="226" stroke="#C77B9B" stroke-opacity=".25"/>

      <!-- Metric Blocks -->
      <g transform="translate(56 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8F0F3">Signals</text>
        <text class="sans" y="24" font-size="12.5" fill="#E5B5C7">dynamic reactive graph</text>
      </g>
      <g transform="translate(261 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8F0F3">Interceptors</text>
        <text class="sans" y="24" font-size="12.5" fill="#C77B9B">auth &amp; request pipeline</text>
      </g>
      <g transform="translate(466 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8F0F3">Patterns</text>
        <text class="sans" y="24" font-size="12.5" fill="#E5B5C7">modular application state</text>
      </g>

      <!-- Chips -->
      <g class="p1-chip" style="animation-delay:1.00s"><rect x="56" y="314" width="84" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="98" y="331" text-anchor="middle" font-size="11.5" fill="#E5B5C7">Angular</text></g>
      <g class="p1-chip" style="animation-delay:1.12s"><rect x="148" y="314" width="92" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="194" y="331" text-anchor="middle" font-size="11.5" fill="#E5B5C7">TypeScript</text></g>
      <g class="p1-chip" style="animation-delay:1.24s"><rect x="248" y="314" width="76" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="286" y="331" text-anchor="middle" font-size="11.5" fill="#F8F0F3">Signals</text></g>
      <g class="p1-chip" style="animation-delay:1.36s"><rect x="332" y="314" width="112" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="388" y="331" text-anchor="middle" font-size="11.5" fill="#E5B5C7">Interceptors</text></g>
      <g class="p1-chip" style="animation-delay:1.48s"><rect x="452" y="314" width="108" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="506" y="331" text-anchor="middle" font-size="11.5" fill="#C77B9B">Architecture</text></g>
    </g>

    <!-- Right Column: Interactive Diagram -->
    <g class="p1-in" style="animation-delay: 0.35s;">
      <g transform="translate(740 40)">
        <text class="sans" x="14" y="16" font-size="11" font-weight="600" letter-spacing="0.8" fill="#B6A3AC">REACTIVE SIGNAL DEPENDENCY GRAPH</text>
        
        <!-- Signal Node 1 -->
        <g transform="translate(20 44)">
          <rect width="170" height="52" rx="10" fill="#27101C" stroke="#C77B9B" stroke-opacity=".4"/>
          <text class="mono" x="14" y="22" font-size="11" fill="#F8F0F3">signal(state)</text>
          <text class="mono" x="14" y="38" font-size="9.5" fill="#E5B5C7">producer · source</text>
        </g>

        <!-- Connecting Line & Animated Moving Particle -->
        <path d="M190 70 C 230 70, 230 130, 270 130" fill="none" stroke="#E5B5C7" stroke-width="1.8"/>
        <circle r="4" fill="#F8F0F3" filter="url(#cyber-glow)">
          <animateMotion dur="3s" repeatCount="indefinite" path="M190 70 C 230 70, 230 130, 270 130" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines=".45 0 .55 1"/>
        </circle>

        <!-- Computed Node -->
        <g transform="translate(270 104)">
          <rect width="180" height="52" rx="10" fill="#451126" stroke="#E5B5C7" stroke-opacity=".7" stroke-width="1.5"/>
          <text class="mono" x="14" y="22" font-size="11" fill="#F8F0F3">computed(derived)</text>
          <text class="mono" x="14" y="38" font-size="9.5" fill="#F8F0F3">memoized · reactive</text>
        </g>

        <!-- Interceptor Node -->
        <g transform="translate(20 160)">
          <rect width="190" height="52" rx="10" fill="#190B12" stroke="#C77B9B" stroke-opacity=".4"/>
          <text class="mono" x="14" y="22" font-size="11" fill="#F8F0F3">HttpInterceptorFn</text>
          <text class="mono" x="14" y="38" font-size="9.5" fill="#B6A3AC">auth token pipeline</text>
        </g>

        <!-- Line to RxJS Interop -->
        <path d="M210 186 C 240 186, 240 145, 270 140" fill="none" stroke="#C77B9B" stroke-opacity=".5" stroke-dasharray="4 4"/>

        <!-- Live Interop Indicator Box -->
        <g transform="translate(160 228)">
          <rect width="240" height="32" rx="8" fill="#10070C" stroke="#C77B9B" stroke-opacity=".3"/>
          <text class="mono" x="120" y="20" text-anchor="middle" font-size="10.5" fill="#E5B5C7">toSignal() &amp; toObservable() Interop</text>
        </g>
      </g>
    </g>

    <!-- Base Perimeter Border & Surrounding Corner Trace -->
    <rect x=".5" y=".5" width="1199" height="369" rx="17.5" fill="none" stroke="#C77B9B" stroke-opacity=".2"/>
    <rect class="trace-anim" x=".5" y=".5" width="1199" height="369" rx="17.5" fill="none" stroke="url(#cyber-trace)" stroke-width="2.0" stroke-linecap="round"/>
  </g>
</svg>
`;

  // 5. PROJECT 2: RXJS OPERATOR LAB SVG
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
    <ellipse cx="880" cy="180" rx="420" ry="240" fill="url(#cyber-glow-rose)"/>
    <rect x="700" width="500" height="370" fill="url(#cyber-grid)"/>

    ${lavaSparks(1200, 370, 120)}

    <!-- Left Content Column -->
    <g class="p2-in" style="animation-delay: 0.15s;">
      <text class="sans" x="56" y="62" font-size="12" font-weight="600" letter-spacing="1" fill="#E5B5C7">PART 05.2 · REACTIVE LAB · RXJS · OPERATORS</text>
      <text class="serif" x="54" y="126" font-size="50" font-weight="300" letter-spacing="-1" fill="#F8F0F3">RxJS Operator Lab</text>
      <text class="sans" x="56" y="166" font-size="16.5" fill="#B6A3AC">Comparing switchMap, mergeMap, concatMap and exhaustMap with reactive search.</text>
      <text class="mono" x="56" y="200" font-size="12.5" fill="#F8F0F3"><tspan fill="#C77B9B">Built ›</tspan> Interactive visual demonstrations of concurrency &amp; stream lifecycle</text>
      <line x1="56" y1="226" x2="680" y2="226" stroke="#C77B9B" stroke-opacity=".25"/>

      <!-- Metric Blocks -->
      <g transform="translate(56 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8F0F3">4 Maps</text>
        <text class="sans" y="24" font-size="12.5" fill="#E5B5C7">higher-order operators</text>
      </g>
      <g transform="translate(261 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8F0F3">100%</text>
        <text class="sans" y="24" font-size="12.5" fill="#C77B9B">deterministic streams</text>
      </g>
      <g transform="translate(466 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8F0F3">Zero</text>
        <text class="sans" y="24" font-size="12.5" fill="#E5B5C7">memory leaks · clean teardown</text>
      </g>

      <!-- Chips -->
      <g class="p2-chip" style="animation-delay:1.00s"><rect x="56" y="314" width="74" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="93" y="331" text-anchor="middle" font-size="11.5" fill="#E5B5C7">RxJS</text></g>
      <g class="p2-chip" style="animation-delay:1.12s"><rect x="138" y="314" width="92" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="184" y="331" text-anchor="middle" font-size="11.5" fill="#E5B5C7">TypeScript</text></g>
      <g class="p2-chip" style="animation-delay:1.24s"><rect x="238" y="314" width="102" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="289" y="331" text-anchor="middle" font-size="11.5" fill="#F8F0F3">Observables</text></g>
      <g class="p2-chip" style="animation-delay:1.36s"><rect x="348" y="314" width="108" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="402" y="331" text-anchor="middle" font-size="11.5" fill="#E5B5C7">Higher-Order</text></g>
      <g class="p2-chip" style="animation-delay:1.48s"><rect x="464" y="314" width="118" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="523" y="331" text-anchor="middle" font-size="11.5" fill="#C77B9B">Marble Testing</text></g>
    </g>

    <!-- Right Column: Interactive Concurrency Operator Routing -->
    <g class="p2-in" style="animation-delay: 0.35s;">
      <g transform="translate(760 40)" class="mono" font-size="13" text-anchor="middle">
        <text class="sans" x="12" y="20" text-anchor="start" font-size="11" font-weight="600" letter-spacing="0.8" fill="#B6A3AC">STREAM CONCURRENCY · OPERATOR ROUTING</text>
        <path d="M12 120 H70" stroke="#C77B9B" stroke-opacity=".5"/>
        <path d="M190 120 C 240 120, 250 64, 300 64" fill="none" stroke="#E5B5C7" stroke-width="1.8"/>
        <path d="M190 120 C 240 120, 250 176, 300 176" fill="none" stroke="#C77B9B" stroke-opacity=".35" stroke-dasharray="4 6"/>
        
        <rect x="70" y="98" width="120" height="44" rx="22" fill="#27101C" stroke="#C77B9B" stroke-opacity=".5"/>
        <text x="130" y="125" fill="#F8F0F3">switchMap</text>
        
        <rect x="300" y="42" width="116" height="44" rx="22" fill="#451126" stroke="#E5B5C7"/>
        <text x="358" y="69" fill="#E5B5C7">exhaustMap</text>
        
        <rect x="300" y="154" width="116" height="44" rx="22" fill="#190B12" stroke="#C77B9B" stroke-opacity=".4"/>
        <text x="358" y="181" fill="#B6A3AC">mergeMap</text>

        <!-- Traveling Pulse Particle -->
        <circle r="4.5" fill="#F8F0F3" filter="url(#cyber-glow)">
          <animateMotion dur="3.6s" repeatCount="indefinite" path="M12 120 H130 C 220 120, 250 64, 358 64" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines=".45 0 .55 1"/>
        </circle>
        
        <text class="mono" x="12" y="236" text-anchor="start" font-size="10.5" letter-spacing="1.2" fill="#E5B5C7">observable pipeline · debounceTime · distinctUntilChanged</text>
      </g>
    </g>

    <!-- Base Perimeter Border & Surrounding Corner Trace -->
    <rect x=".5" y=".5" width="1199" height="369" rx="17.5" fill="none" stroke="#C77B9B" stroke-opacity=".2"/>
    <rect class="trace-anim" x=".5" y=".5" width="1199" height="369" rx="17.5" fill="none" stroke="url(#cyber-trace)" stroke-width="2.0" stroke-linecap="round"/>
  </g>
</svg>
`;

  // 6. PROJECT 3: NGRX EFFECTS DEMO SVG
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
    <ellipse cx="880" cy="180" rx="420" ry="240" fill="url(#cyber-glow-rose)"/>
    <rect x="700" width="500" height="370" fill="url(#cyber-grid)"/>

    ${lavaSparks(1200, 370, 160)}

    <!-- Left Content Column -->
    <g class="p3-in" style="animation-delay: 0.15s;">
      <text class="sans" x="56" y="62" font-size="12" font-weight="600" letter-spacing="1" fill="#E5B5C7">PART 05.3 · STATE MANAGEMENT · NGRX · EFFECTS</text>
      <text class="serif" x="54" y="126" font-size="50" font-weight="300" letter-spacing="-1" fill="#F8F0F3">NgRx Effects Demo</text>
      <text class="sans" x="56" y="166" font-size="16.5" fill="#B6A3AC">Connecting store actions, reducers and HTTP side effects to decoupled views.</text>
      <text class="mono" x="56" y="200" font-size="12.5" fill="#F8F0F3"><tspan fill="#C77B9B">Built ›</tspan> clean action-reducer-effect separation with async HTTP side-effect dispatch</text>
      <line x1="56" y1="226" x2="680" y2="226" stroke="#C77B9B" stroke-opacity=".25"/>

      <!-- Metric Blocks -->
      <g transform="translate(56 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8F0F3">Store</text>
        <text class="sans" y="24" font-size="12.5" fill="#E5B5C7">immutable application state</text>
      </g>
      <g transform="translate(261 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8F0F3">Effects</text>
        <text class="sans" y="24" font-size="12.5" fill="#C77B9B">async HTTP dispatch</text>
      </g>
      <g transform="translate(466 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8F0F3">Selectors</text>
        <text class="sans" y="24" font-size="12.5" fill="#E5B5C7">memoized state queries</text>
      </g>

      <!-- Chips -->
      <g class="p3-chip" style="animation-delay:1.00s"><rect x="56" y="314" width="76" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="94" y="331" text-anchor="middle" font-size="11.5" fill="#E5B5C7">NgRx</text></g>
      <g class="p3-chip" style="animation-delay:1.12s"><rect x="142" y="314" width="86" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="185" y="331" text-anchor="middle" font-size="11.5" fill="#E5B5C7">Angular</text></g>
      <g class="p3-chip" style="animation-delay:1.24s"><rect x="238" y="314" width="70" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="273" y="331" text-anchor="middle" font-size="11.5" fill="#F8F0F3">Store</text></g>
      <g class="p3-chip" style="animation-delay:1.36s"><rect x="318" y="314" width="76" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="356" y="331" text-anchor="middle" font-size="11.5" fill="#E5B5C7">Effects</text></g>
      <g class="p3-chip" style="animation-delay:1.48s"><rect x="404" y="314" width="90" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="449" y="331" text-anchor="middle" font-size="11.5" fill="#C77B9B">Selectors</text></g>
    </g>

    <!-- Right Column: Step-by-Step Reactive State Cycle -->
    <g class="p3-in" style="animation-delay: 0.35s;">
      <g transform="translate(0 35)">
        <rect x="750" y="46" width="270" height="38" rx="12" fill="#190B12" stroke="#C77B9B" stroke-opacity=".4"/>
        <text class="mono" x="766" y="70" font-size="11.5" fill="#F8F0F3">dispatch(loadEntity({id}))</text>

        <!-- Step 1: Dispatch -->
        <g transform="translate(750 106)">
          <rect width="76" height="58" rx="9" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35">
            <animate attributeName="fill" values="#27101C;#451126;#27101C;#27101C" keyTimes="0;.08;.2;1" dur="6s" begin="1.0s" repeatCount="indefinite"/>
            <animate attributeName="stroke" values="#C77B9B;#E5B5C7;#C77B9B;#C77B9B" keyTimes="0;.08;.2;1" dur="6s" begin="1.0s" repeatCount="indefinite"/>
          </rect>
          <text class="mono" x="8" y="18" font-size="9" fill="#B6A3AC">01</text>
          <text class="mono" x="38" y="40" font-size="9.5" text-anchor="middle" fill="#F8F0F3">Dispatch</text>
        </g>

        <!-- Step 2: ofType -->
        <g transform="translate(834 106)">
          <rect width="76" height="58" rx="9" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35">
            <animate attributeName="fill" values="#27101C;#451126;#27101C;#27101C" keyTimes="0;.08;.2;1" dur="6s" begin="1.6s" repeatCount="indefinite"/>
            <animate attributeName="stroke" values="#C77B9B;#E5B5C7;#C77B9B;#C77B9B" keyTimes="0;.08;.2;1" dur="6s" begin="1.6s" repeatCount="indefinite"/>
          </rect>
          <text class="mono" x="8" y="18" font-size="9" fill="#B6A3AC">02</text>
          <text class="mono" x="38" y="40" font-size="9.5" text-anchor="middle" fill="#F8F0F3">ofType</text>
        </g>

        <!-- Step 3: Http API -->
        <g transform="translate(918 106)">
          <rect width="76" height="58" rx="9" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35">
            <animate attributeName="fill" values="#27101C;#451126;#27101C;#27101C" keyTimes="0;.08;.2;1" dur="6s" begin="2.2s" repeatCount="indefinite"/>
            <animate attributeName="stroke" values="#C77B9B;#E5B5C7;#C77B9B;#C77B9B" keyTimes="0;.08;.2;1" dur="6s" begin="2.2s" repeatCount="indefinite"/>
          </rect>
          <text class="mono" x="8" y="18" font-size="9" fill="#B6A3AC">03</text>
          <text class="mono" x="38" y="40" font-size="9.5" text-anchor="middle" fill="#F8F0F3">Http API</text>
        </g>

        <!-- Step 4: Success -->
        <g transform="translate(1002 106)">
          <rect width="76" height="58" rx="9" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35">
            <animate attributeName="fill" values="#27101C;#451126;#27101C;#27101C" keyTimes="0;.08;.2;1" dur="6s" begin="2.8s" repeatCount="indefinite"/>
            <animate attributeName="stroke" values="#C77B9B;#E5B5C7;#C77B9B;#C77B9B" keyTimes="0;.08;.2;1" dur="6s" begin="2.8s" repeatCount="indefinite"/>
          </rect>
          <text class="mono" x="8" y="18" font-size="9" fill="#B6A3AC">04</text>
          <text class="mono" x="38" y="40" font-size="9.5" text-anchor="middle" fill="#F8F0F3">Success</text>
        </g>

        <!-- Step 5: Reducer -->
        <g transform="translate(1086 106)">
          <rect width="76" height="58" rx="9" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35">
            <animate attributeName="fill" values="#27101C;#451126;#27101C;#27101C" keyTimes="0;.08;.2;1" dur="6s" begin="3.4s" repeatCount="indefinite"/>
            <animate attributeName="stroke" values="#C77B9B;#E5B5C7;#C77B9B;#C77B9B" keyTimes="0;.08;.2;1" dur="6s" begin="3.4s" repeatCount="indefinite"/>
          </rect>
          <text class="mono" x="8" y="18" font-size="9" fill="#B6A3AC">05</text>
          <text class="mono" x="38" y="40" font-size="9.5" text-anchor="middle" fill="#F8F0F3">Reducer</text>
        </g>

        <text class="mono" x="1162" y="206" font-size="11" text-anchor="end" fill="#E5B5C7">Actions → Effects → Reducers → View Selectors</text>
        <text class="sans" x="1162" y="232" font-size="11" font-weight="600" text-anchor="end" letter-spacing="0.8" fill="#B6A3AC">IMMUTABLE STATE · DETERMINISTIC CYCLE</text>
      </g>
    </g>

    <!-- Base Perimeter Border & Surrounding Corner Trace -->
    <rect x=".5" y=".5" width="1199" height="369" rx="17.5" fill="none" stroke="#C77B9B" stroke-opacity=".2"/>
    <rect class="trace-anim" x=".5" y=".5" width="1199" height="369" rx="17.5" fill="none" stroke="url(#cyber-trace)" stroke-width="2.0" stroke-linecap="round"/>
  </g>
</svg>
`;

  // 7. PROJECT 4: TYPESCRIPT TYPE-SYSTEM REFERENCE SVG
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
    <ellipse cx="880" cy="180" rx="420" ry="240" fill="url(#cyber-glow-rose)"/>
    <rect x="700" width="500" height="370" fill="url(#cyber-grid)"/>

    ${lavaSparks(1200, 370, 200)}

    <!-- Left Content Column -->
    <g class="p4-in" style="animation-delay: 0.15s;">
      <text class="sans" x="56" y="62" font-size="12" font-weight="600" letter-spacing="1" fill="#E5B5C7">PART 05.4 · TYPE SYSTEM · TYPESCRIPT · COMPILER</text>
      <text class="serif" x="54" y="126" font-size="50" font-weight="300" letter-spacing="-1" fill="#F8F0F3">TypeScript Type-System</text>
      <text class="sans" x="56" y="166" font-size="16.5" fill="#B6A3AC">Focused implementations of generics, unions, mapped types and utility types.</text>
      <text class="mono" x="56" y="200" font-size="12.5" fill="#F8F0F3"><tspan fill="#C77B9B">Built ›</tspan> Comprehensive type-system reference with conditional types &amp; mapped inference</text>
      <line x1="56" y1="226" x2="680" y2="226" stroke="#C77B9B" stroke-opacity=".25"/>

      <!-- Metric Blocks -->
      <g transform="translate(56 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8F0F3">Generics</text>
        <text class="sans" y="24" font-size="12.5" fill="#E5B5C7">constrained parameters</text>
      </g>
      <g transform="translate(261 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8F0F3">Unions</text>
        <text class="sans" y="24" font-size="12.5" fill="#C77B9B">discriminated matching</text>
      </g>
      <g transform="translate(466 266)">
        <text class="serif" font-size="34" font-weight="300" fill="#F8F0F3">Mapped</text>
        <text class="sans" y="24" font-size="12.5" fill="#E5B5C7">key remapping &amp; inference</text>
      </g>

      <!-- Chips -->
      <g class="p4-chip" style="animation-delay:1.00s"><rect x="56" y="314" width="96" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="104" y="331" text-anchor="middle" font-size="11.5" fill="#E5B5C7">TypeScript</text></g>
      <g class="p4-chip" style="animation-delay:1.12s"><rect x="160" y="314" width="86" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="203" y="331" text-anchor="middle" font-size="11.5" fill="#E5B5C7">Generics</text></g>
      <g class="p4-chip" style="animation-delay:1.24s"><rect x="254" y="314" width="136" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="322" y="331" text-anchor="middle" font-size="11.5" fill="#F8F0F3">Conditional Types</text></g>
      <g class="p4-chip" style="animation-delay:1.36s"><rect x="398" y="314" width="114" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="455" y="331" text-anchor="middle" font-size="11.5" fill="#E5B5C7">Mapped Types</text></g>
      <g class="p4-chip" style="animation-delay:1.48s"><rect x="520" y="314" width="106" height="26" rx="13" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/><text class="mono" x="573" y="331" text-anchor="middle" font-size="11.5" fill="#C77B9B">Compiler AST</text></g>
    </g>

    <!-- Right Column: Interactive Code Editor View -->
    <g class="p4-in" style="animation-delay: 0.35s;">
      <g transform="translate(750 40)">
        <text class="sans" x="14" y="16" font-size="11" font-weight="600" letter-spacing="0.8" fill="#B6A3AC">TYPE-LEVEL COMPUTATION &amp; INFERENCE</text>
        
        <!-- Layer 1: Conditional inference -->
        <g transform="translate(20 44)">
          <rect width="380" height="48" rx="10" fill="#27101C" stroke="#C77B9B" stroke-opacity=".35"/>
          <text class="mono" x="14" y="20" font-size="10.5" fill="#E5B5C7">type <tspan fill="#F8F0F3">Flatten&lt;T&gt;</tspan> = T extends Array&lt;infer U&gt;</text>
          <text class="mono" x="14" y="36" font-size="10.5" fill="#C77B9B">  ? Flatten&lt;U&gt; : T;</text>
        </g>

        <!-- Layer 2: Mapped type -->
        <g transform="translate(20 106)">
          <rect width="380" height="48" rx="10" fill="#451126" stroke="#E5B5C7" stroke-opacity=".6"/>
          <text class="mono" x="14" y="20" font-size="10.5" fill="#F8F0F3">type DeepReadonly&lt;T&gt; = {</text>
          <text class="mono" x="14" y="36" font-size="10.5" fill="#E5B5C7">  readonly [K in keyof T]: DeepReadonly&lt;T[K]&gt;</text>
        </g>

        <!-- Layer 3: Discriminated Union Pattern -->
        <g transform="translate(20 168)">
          <rect width="380" height="48" rx="10" fill="#190B12" stroke="#C77B9B" stroke-opacity=".35"/>
          <text class="mono" x="14" y="20" font-size="10.5" fill="#F8F0F3">type Match&lt;T extends { tag: string }&gt; =</text>
          <text class="mono" x="14" y="36" font-size="10.5" fill="#C77B9B">  Extract&lt;T, { tag: 'success' }&gt;;</text>
        </g>

        <!-- Compiler status indicator -->
        <g transform="translate(20 228)">
          <rect width="380" height="30" rx="8" fill="#10070C" stroke="#C77B9B" stroke-opacity=".25"/>
          <circle cx="18" cy="15" r="4" fill="#E5B5C7" filter="url(#cyber-glow)">
            <animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text class="mono" x="32" y="19" font-size="10" fill="#B6A3AC">tsc --strict · Zero Any · Deterministic Compilation</text>
        </g>
      </g>
    </g>

    <!-- Base Perimeter Border & Surrounding Corner Trace -->
    <rect x=".5" y=".5" width="1199" height="369" rx="17.5" fill="none" stroke="#C77B9B" stroke-opacity=".2"/>
    <rect class="trace-anim" x=".5" y=".5" width="1199" height="369" rx="17.5" fill="none" stroke="url(#cyber-trace)" stroke-width="2.0" stroke-linecap="round"/>
  </g>
</svg>
`;

  // 8. RESEARCH & KNOWLEDGE CARD (Engineering, Shared)
  const researchSystemsSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 320" width="1200" height="320" role="img" aria-labelledby="res-t res-d">
  <title id="res-t">WorldGyan — Engineering Shared &amp; Research Systems</title>
  <desc id="res-d">Published research in frontend system design, production AI engineering, and practical Angular testing tutorials.</desc>
  <defs>
    ${commonDefs}
    <clipPath id="res-clip"><rect width="1200" height="320" rx="20"/></clipPath>
  </defs>
  <style>
    ${commonStyles}
    .res-in { animation: res-in 1.2s cubic-bezier(.16,1,.3,1) both; }
    @keyframes res-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .res-in { animation: none; } }
  </style>
  <g clip-path="url(#res-clip)">
    <!-- Base Deep Obsidian Canvas -->
    <rect width="1200" height="320" fill="url(#cyber-bg)"/>
    <ellipse cx="600" cy="160" rx="380" ry="200" fill="url(#cyber-glow-rose)"/>
    <rect width="1200" height="320" fill="url(#cyber-grid)"/>

    ${lavaSparks(1200, 320, 100)}

    <!-- Header -->
    <g class="res-in" style="animation-delay: 0.1s;">
      <text class="sans" x="56" y="52" font-size="12" font-weight="600" letter-spacing="1" fill="#E5B5C7">PART 07 · RESEARCH &amp; KNOWLEDGE · WORLDGYAN</text>
      <text class="serif" x="54" y="94" font-size="36" font-weight="300" fill="#F8F0F3">Engineering, Shared.</text>
      <text class="sans" x="56" y="122" font-size="15" fill="#B6A3AC">Frontend systems, AI architecture &amp; practical enterprise tutorials.</text>
    </g>

    <!-- 3 Interactive Research Modules -->
    <g class="res-in" style="animation-delay: 0.25s;">
      <!-- Module 1: Frontend System Design -->
      <g transform="translate(56 150)">
        <rect width="344" height="120" rx="12" fill="#190B12" stroke="#C77B9B" stroke-opacity=".3"/>
        <line x1="16" y1="20" x2="16" y2="100" stroke="#E5B5C7" stroke-width="3" stroke-linecap="round"/>
        <text class="sans" x="32" y="38" font-size="15" font-weight="600" fill="#F8F0F3">Frontend System Design</text>
        <text class="sans" x="32" y="62" font-size="12.5" fill="#B6A3AC">Micro-frontends, integration boundaries &amp; scaling tradeoffs.</text>
        <text class="mono" x="32" y="92" font-size="11" font-weight="600" fill="#E5B5C7">Read research paper →</text>
      </g>

      <!-- Module 2: AI Engineering Research -->
      <g transform="translate(428 150)">
        <rect width="344" height="120" rx="12" fill="#190B12" stroke="#C77B9B" stroke-opacity=".3"/>
        <line x1="16" y1="20" x2="16" y2="100" stroke="#C77B9B" stroke-width="3" stroke-linecap="round"/>
        <text class="sans" x="32" y="38" font-size="15" font-weight="600" fill="#F8F0F3">Production AI Engineering</text>
        <text class="sans" x="32" y="62" font-size="12.5" fill="#B6A3AC">Architecture, retrieval, serving, orchestration &amp; evals.</text>
        <text class="mono" x="32" y="92" font-size="11" font-weight="600" fill="#E5B5C7">Read research paper →</text>
      </g>

      <!-- Module 3: Angular Testing Tutorials -->
      <g transform="translate(800 150)">
        <rect width="344" height="120" rx="12" fill="#190B12" stroke="#C77B9B" stroke-opacity=".3"/>
        <line x1="16" y1="20" x2="16" y2="100" stroke="#701A3D" stroke-width="3" stroke-linecap="round"/>
        <text class="sans" x="32" y="38" font-size="15" font-weight="600" fill="#F8F0F3">Angular Testing Tutorials</text>
        <text class="sans" x="32" y="62" font-size="12.5" fill="#B6A3AC">Unit testing, integration testing &amp; enterprise test suites.</text>
        <text class="mono" x="32" y="92" font-size="11" font-weight="600" fill="#C77B9B">Watch video series →</text>
      </g>
    </g>

    <!-- Base Perimeter Border & Surrounding Corner Trace -->
    <rect x=".5" y=".5" width="1199" height="319" rx="19.5" fill="none" stroke="#C77B9B" stroke-opacity=".2"/>
    <rect class="trace-anim" x=".5" y=".5" width="1199" height="319" rx="19.5" fill="none" stroke="url(#cyber-trace)" stroke-width="2.0" stroke-linecap="round"/>
  </g>
</svg>
`;

  // 9. CORE TECHNOLOGY WITH CONTINUOUS FLOWING WAVES & OBSIDIAN PALETTE
  const technologyCoreSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 340" width="1200" height="340" role="img" aria-labelledby="tech-title tech-desc">
  <title id="tech-title">Core Technology: Angular, TypeScript, RxJS, and NgRx.</title>
  <desc id="tech-desc">Core engineering stack: modern frontend architecture, reactive streaming, and state management.</desc>
  <defs>
    ${commonDefs}
    <clipPath id="tech-clip"><rect width="1200" height="340" rx="18"/></clipPath>
    <linearGradient id="wave-rose" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#E5B5C7" stop-opacity=".7"/>
      <stop offset=".5" stop-color="#C77B9B" stop-opacity=".9"/>
      <stop offset="1" stop-color="#E5B5C7" stop-opacity=".7"/>
    </linearGradient>
    <linearGradient id="wave-wine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#701A3D" stop-opacity=".75"/>
      <stop offset=".5" stop-color="#C77B9B" stop-opacity=".85"/>
      <stop offset="1" stop-color="#701A3D" stop-opacity=".75"/>
    </linearGradient>
    <linearGradient id="wave-fill-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#701A3D" stop-opacity=".15"/>
      <stop offset="1" stop-color="#10070C" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <style>
    ${commonStyles}
    .tech-in { animation: tech-in 1.2s cubic-bezier(.16,1,.3,1) both; }
    @keyframes tech-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .tech-in { animation: none; } }
  </style>
  <g clip-path="url(#tech-clip)">
    <!-- Base Deep Obsidian Canvas -->
    <rect width="1200" height="340" fill="url(#cyber-bg)"/>
    <ellipse cx="600" cy="170" rx="460" ry="180" fill="url(#cyber-glow-rose)"/>
    <rect width="1200" height="340" fill="url(#cyber-grid)"/>

    <!-- Continuous Flowing Waves in Rose & Wine -->
    <g opacity="0.35">
      <!-- Wave 1: Flowing Rose Champagne Wave -->
      <path fill="none" stroke="url(#wave-rose)" stroke-width="2.2">
        <animate attributeName="d" dur="12s" repeatCount="indefinite" values="M0 160 Q150 120 300 160 T600 160 T900 160 T1200 160;M0 160 Q150 200 300 160 T600 160 T900 160 T1200 160;M0 160 Q150 120 300 160 T600 160 T900 160 T1200 160"/>
      </path>
      <!-- Wave 2: Wine Wave with Moving Dash Stream -->
      <path fill="none" stroke="url(#wave-wine)" stroke-width="1.8" stroke-dasharray="14 10">
        <animate attributeName="d" dur="9s" repeatCount="indefinite" values="M0 180 Q200 220 400 180 T800 180 T1200 180;M0 180 Q200 140 400 180 T800 180 T1200 180;M0 180 Q200 220 400 180 T800 180 T1200 180"/>
        <animate attributeName="stroke-dashoffset" from="0" to="-240" dur="9s" repeatCount="indefinite"/>
      </path>
      <!-- Wave 3: Subtle Wine Fill Wave -->
      <path fill="url(#wave-fill-grad)">
        <animate attributeName="d" dur="15s" repeatCount="indefinite" values="M0 210 Q300 170 600 210 T1200 210 L1200 340 L0 340 Z;M0 210 Q300 250 600 210 T1200 210 L1200 340 L0 340 Z;M0 210 Q300 170 600 210 T1200 210 L1200 340 L0 340 Z"/>
      </path>
    </g>

    ${lavaSparks(1200, 340, 90)}

    <!-- Top Section Header -->
    <g class="tech-in" style="animation-delay: 0.1s;">
      <text class="mono" x="56" y="44" font-size="11.5" font-weight="700" letter-spacing="1.2" fill="#E5B5C7">PART 03 · CORE TECHNOLOGIES</text>
      <text class="serif" x="56" y="74" font-size="22" font-weight="300" fill="#F8F0F3">Engineering Foundations</text>
      <line x1="56" y1="92" x2="1144" y2="92" stroke="#C77B9B" stroke-opacity=".25"/>
    </g>

    <!-- 4 Clean Core Pillar Cards in Obsidian Theme -->
    <g class="tech-in" style="animation-delay: 0.25s;">
      <!-- Card 1: Angular -->
      <g transform="translate(56 112)">
        <rect width="258" height="130" rx="14" fill="#190B12" stroke="#C77B9B" stroke-opacity=".35"/>
        <text class="serif" x="22" y="48" font-size="26" font-weight="300" fill="#F8F0F3">Angular</text>
        <text class="sans" x="22" y="76" font-size="13" font-weight="600" fill="#E5B5C7">Signals &amp; Component Topology</text>
        <text class="sans" x="22" y="98" font-size="12" fill="#B6A3AC">Modular application architecture</text>
      </g>

      <!-- Card 2: TypeScript -->
      <g transform="translate(330 112)">
        <rect width="258" height="130" rx="14" fill="#190B12" stroke="#C77B9B" stroke-opacity=".35"/>
        <text class="serif" x="22" y="48" font-size="26" font-weight="300" fill="#F8F0F3">TypeScript</text>
        <text class="sans" x="22" y="76" font-size="13" font-weight="600" fill="#C77B9B">Type Systems &amp; Generics</text>
        <text class="sans" x="22" y="98" font-size="12" fill="#B6A3AC">Strict compile-time correctness</text>
      </g>

      <!-- Card 3: RxJS -->
      <g transform="translate(604 112)">
        <rect width="258" height="130" rx="14" fill="#190B12" stroke="#C77B9B" stroke-opacity=".35"/>
        <text class="serif" x="22" y="48" font-size="26" font-weight="300" fill="#F8F0F3">RxJS</text>
        <text class="sans" x="22" y="76" font-size="13" font-weight="600" fill="#E5B5C7">Reactive Streams</text>
        <text class="sans" x="22" y="98" font-size="12" fill="#B6A3AC">Declarative asynchronous pipelines</text>
      </g>

      <!-- Card 4: NgRx -->
      <g transform="translate(878 112)">
        <rect width="266" height="130" rx="14" fill="#190B12" stroke="#C77B9B" stroke-opacity=".35"/>
        <text class="serif" x="22" y="48" font-size="26" font-weight="300" fill="#F8F0F3">NgRx</text>
        <text class="sans" x="22" y="76" font-size="13" font-weight="600" fill="#C77B9B">State Management</text>
        <text class="sans" x="22" y="98" font-size="12" fill="#B6A3AC">Predictable unidirectional flow</text>
      </g>
    </g>

    <!-- Clean, Quiet Supporting Line -->
    <g class="tech-in" style="animation-delay: 0.4s;">
      <text class="mono" x="56" y="286" font-size="12" fill="#B6A3AC"><tspan fill="#E5B5C7" font-weight="600">Supporting ›</tspan> HTML5 · CSS3 / SCSS · Node.js · REST APIs · Jasmine / Jest · Git CI/CD</text>
    </g>

    <!-- Base Perimeter Border & Surrounding Radiant Corner Trace -->
    <rect x=".5" y=".5" width="1199" height="339" rx="17.5" fill="none" stroke="#C77B9B" stroke-opacity=".2"/>
    <rect class="trace-anim" x=".5" y=".5" width="1199" height="339" rx="17.5" fill="none" stroke="url(#cyber-trace)" stroke-width="2.0" stroke-linecap="round"/>
  </g>
</svg>
`;

  // 10. AI ARCHITECTURE & ORCHESTRATION WITH OBSIDIAN PALETTE & FLOWING FEEDBACK LOOP
  const aiOrchestrationSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 290" width="1200" height="290" role="img" aria-labelledby="ai-title ai-desc">
  <title id="ai-title">AI Architecture &amp; Orchestration: Agentic Workflows &amp; Execution Cycles.</title>
  <desc id="ai-desc">Autonomous Plan-Act-Reflect cycles, tool integrations, and continuous feedback loop.</desc>
  <defs>
    ${commonDefs}
    <clipPath id="ai-clip"><rect width="1200" height="290" rx="18"/></clipPath>
    <linearGradient id="wave-rose" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#E5B5C7" stop-opacity=".7"/>
      <stop offset=".5" stop-color="#C77B9B" stop-opacity=".9"/>
      <stop offset="1" stop-color="#E5B5C7" stop-opacity=".7"/>
    </linearGradient>
    <linearGradient id="wave-wine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#701A3D" stop-opacity=".75"/>
      <stop offset=".5" stop-color="#C77B9B" stop-opacity=".85"/>
      <stop offset="1" stop-color="#701A3D" stop-opacity=".75"/>
    </linearGradient>
  </defs>
  <style>
    ${commonStyles}
    .ai-in { animation: ai-in 1.2s cubic-bezier(.16,1,.3,1) both; }
    @keyframes ai-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .ai-in { animation: none; } }
  </style>
  <g clip-path="url(#ai-clip)">
    <!-- Base Deep Obsidian Canvas -->
    <rect width="1200" height="290" fill="url(#cyber-bg)"/>
    <ellipse cx="600" cy="145" rx="460" ry="160" fill="url(#cyber-glow-rose)"/>
    <rect width="1200" height="290" fill="url(#cyber-grid)"/>

    <!-- Continuous Flowing Waves in Rose & Wine -->
    <g opacity="0.32">
      <!-- Wave 1: Flowing Rose Champagne Wave -->
      <path fill="none" stroke="url(#wave-rose)" stroke-width="2.2">
        <animate attributeName="d" dur="11s" repeatCount="indefinite" values="M0 140 Q150 100 300 140 T600 140 T900 140 T1200 140;M0 140 Q150 180 300 140 T600 140 T900 140 T1200 140;M0 140 Q150 100 300 140 T600 140 T900 140 T1200 140"/>
      </path>
      <!-- Wave 2: Wine Wave with Moving Dash Stream -->
      <path fill="none" stroke="url(#wave-wine)" stroke-width="1.8" stroke-dasharray="14 10">
        <animate attributeName="d" dur="8.5s" repeatCount="indefinite" values="M0 155 Q200 195 400 155 T800 155 T1200 155;M0 155 Q200 115 400 155 T800 155 T1200 155;M0 155 Q200 195 400 155 T800 155 T1200 155"/>
        <animate attributeName="stroke-dashoffset" from="0" to="-240" dur="8.5s" repeatCount="indefinite"/>
      </path>
    </g>

    ${lavaSparks(1200, 290, 140)}

    <!-- Top Section Header -->
    <g class="ai-in" style="animation-delay: 0.1s;">
      <text class="mono" x="56" y="38" font-size="11.5" font-weight="700" letter-spacing="1.2" fill="#E5B5C7">PART 04 · AI ARCHITECTURE &amp; ORCHESTRATION</text>
      <text class="serif" x="56" y="66" font-size="22" font-weight="300" fill="#F8F0F3">Intelligent Systems &amp; Agent Workflows</text>
      <line x1="56" y1="82" x2="1144" y2="82" stroke="#C77B9B" stroke-opacity=".25"/>
    </g>

    <!-- Center Agentic Orchestration Cycle (Plan -> Act -> Reflect) -->
    <g class="ai-in" style="animation-delay: 0.25s;">
      <!-- Node 1: PLAN -->
      <g transform="translate(68 100)">
        <rect width="288" height="104" rx="12" fill="#190B12" stroke="#C77B9B" stroke-opacity=".35" stroke-width="1.2"/>
        <rect x="18" y="18" width="68" height="22" rx="11" fill="#27101C" stroke="#C77B9B" stroke-opacity=".5"/>
        <text class="mono" x="52" y="33" font-size="10.5" font-weight="700" fill="#E5B5C7" text-anchor="middle">01 PLAN</text>
        <text class="serif" x="18" y="66" font-size="22" font-weight="300" fill="#F8F0F3">Goal &amp; Strategy</text>
        <text class="sans" x="18" y="88" font-size="12" fill="#B6A3AC">Task decomposition &amp; context synthesis</text>
      </g>

      <!-- MOVING ARROW: Plan -> Act (Continuously Flowing Arrow & Chevron) -->
      <g>
        <line x1="368" y1="152" x2="438" y2="152" stroke="#E5B5C7" stroke-width="2.2" stroke-dasharray="6 4">
          <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.9s" repeatCount="indefinite"/>
        </line>
        <polygon points="446 152, 434 146, 437 152, 434 158" fill="#E5B5C7">
          <animate attributeName="transform" type="translate" values="0,0; 4,0; 0,0" dur="0.9s" repeatCount="indefinite"/>
        </polygon>
      </g>

      <!-- Node 2: ACT -->
      <g transform="translate(456 100)">
        <rect width="288" height="104" rx="12" fill="#190B12" stroke="#C77B9B" stroke-opacity=".35" stroke-width="1.2"/>
        <rect x="18" y="18" width="62" height="22" rx="11" fill="#451126" stroke="#E5B5C7" stroke-opacity=".6"/>
        <text class="mono" x="49" y="33" font-size="10.5" font-weight="700" fill="#F8F0F3" text-anchor="middle">02 ACT</text>
        <text class="serif" x="18" y="66" font-size="22" font-weight="300" fill="#F8F0F3">Tool Execution</text>
        <text class="sans" x="18" y="88" font-size="12" fill="#B6A3AC">Model inference &amp; tool invocations</text>
      </g>

      <!-- MOVING ARROW: Act -> Reflect (Continuously Flowing Arrow & Chevron) -->
      <g>
        <line x1="756" y1="152" x2="826" y2="152" stroke="#E5B5C7" stroke-width="2.2" stroke-dasharray="6 4">
          <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.9s" repeatCount="indefinite"/>
        </line>
        <polygon points="834 152, 822 146, 825 152, 822 158" fill="#E5B5C7">
          <animate attributeName="transform" type="translate" values="0,0; 4,0; 0,0" dur="0.9s" repeatCount="indefinite"/>
        </polygon>
      </g>

      <!-- Node 3: REFLECT -->
      <g transform="translate(844 100)">
        <rect width="288" height="104" rx="12" fill="#190B12" stroke="#C77B9B" stroke-opacity=".35" stroke-width="1.2"/>
        <rect x="18" y="18" width="86" height="22" rx="11" fill="#701A3D" stroke="#C77B9B" stroke-opacity=".5"/>
        <text class="mono" x="61" y="33" font-size="10.5" font-weight="700" fill="#E5B5C7" text-anchor="middle">03 REFLECT</text>
        <text class="serif" x="18" y="66" font-size="22" font-weight="300" fill="#F8F0F3">Self-Evaluation</text>
        <text class="sans" x="18" y="88" font-size="12" fill="#B6A3AC">Validation, guardrails &amp; error recovery</text>
      </g>

      <!-- CONTINUOUS FLOWING REFLECTION LOOP: Reflect back to Plan -->
      <g>
        <path d="M988 204 C988 246, 212 246, 212 208" fill="none" stroke="#C77B9B" stroke-width="1.8" stroke-dasharray="6 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="1.8s" repeatCount="indefinite"/>
        </path>
        <polygon points="212 205, 207 215, 217 215" fill="#C77B9B">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite"/>
        </polygon>
        <text class="mono" x="600" y="248" font-size="11" font-weight="600" fill="#B6A3AC" letter-spacing="1.2" text-anchor="middle">ADAPTIVE RE-PLANNING &amp; CONTINUOUS FEEDBACK LOOP</text>
      </g>
    </g>

    <!-- Base Perimeter Border & Surrounding Radiant Corner Trace -->
    <rect x=".5" y=".5" width="1199" height="289" rx="17.5" fill="none" stroke="#C77B9B" stroke-opacity=".2"/>
    <rect class="trace-anim" x=".5" y=".5" width="1199" height="289" rx="17.5" fill="none" stroke="url(#cyber-trace)" stroke-width="2.0" stroke-linecap="round"/>
  </g>
</svg>
`;

  const escXml = str => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;');

  function generatePartTitleSvg(id, partNum, partLabel, mainTitle, italicWord = '', rightLabel = '', {ambientMotion = true} = {}) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" width="1200" height="120" role="img" aria-labelledby="t-title-${id}">
  <title id="t-title-${id}">${escXml(partNum)} ${escXml(partLabel)}: ${escXml(mainTitle)} ${escXml(italicWord)}</title>
  <defs>
    <linearGradient id="t-line-${id}" gradientUnits="userSpaceOnUse" x1="40" y1="0" x2="1160" y2="0">
      <stop offset="0" stop-color="#C77B9B"/><stop offset=".6" stop-color="#701A3D"/><stop offset="1" stop-color="#701A3D" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="t-sheen-${id}" gradientUnits="userSpaceOnUse" x1="-300" y1="0" x2="0" y2="0">
      <stop offset="0" stop-color="#E5B5C7"/><stop offset=".5" stop-color="#F8F0F3"/><stop offset="1" stop-color="#E5B5C7"/>${ambientMotion ? `
      <animateTransform attributeName="gradientTransform" type="translate" values="0 0;1500 0;1500 0" keyTimes="0;.4;1" dur="7s" begin="1.5s" repeatCount="indefinite"/>` : ''}
    </linearGradient>
    <radialGradient id="t-pulse-${id}"><stop offset="0" stop-color="#F8F0F3"/><stop offset=".5" stop-color="#E5B5C7" stop-opacity=".6"/><stop offset="1" stop-color="#C77B9B" stop-opacity="0"/></radialGradient>
  </defs>
  <style>
    .tc-serif { font-family: Georgia, "Iowan Old Style", "Palatino Linotype", "Times New Roman", serif; }
    .tc-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; }
    .tc-sans { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
    .tc-in { animation: tc-in 1.1s cubic-bezier(.16,1,.3,1) both; }
    .tc-d2 { animation-delay: .2s; } .tc-d3 { animation-delay: .45s; }
    .tc-draw { stroke-dasharray: 1200; stroke-dashoffset: 1200; animation: tc-draw 1.8s cubic-bezier(.65,0,.35,1) .5s forwards; }
    @keyframes tc-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
    @keyframes tc-draw { to { stroke-dashoffset: 0; } }
    @media (prefers-reduced-motion: reduce) { .tc-in { animation: none; } .tc-draw { animation: none; stroke-dashoffset: 0; } }
  </style>
  <g class="tc-in">
    <text class="tc-sans" x="40" y="34" font-size="13" font-weight="600" letter-spacing="1" fill="#C77B9B"><tspan fill="#E5B5C7">${escXml(partNum)}</tspan>   ${escXml(partLabel)}</text>
  </g>
  <g class="tc-in tc-d2">
    <text class="tc-serif" x="38" y="84" font-size="44" font-weight="300" letter-spacing="-1" fill="#F8F0F3">${escXml(mainTitle)} <tspan font-style="italic" fill="url(#t-sheen-${id})">${escXml(italicWord)}</tspan></text>
  </g>
  <g class="tc-in tc-d3">
    <text class="tc-sans" x="1160" y="34" text-anchor="end" font-size="11.5" font-weight="500" letter-spacing="0.8" fill="#B6A3AC">${escXml(rightLabel)}</text>
  </g>
  <path class="tc-draw" d="M40 106 H1160" stroke="url(#t-line-${id})" stroke-width="1"/>${ambientMotion ? `
  <circle cx="40" cy="106" r="7" fill="url(#t-pulse-${id})" opacity="0">
    <animate attributeName="cx" values="40;1160" dur="6s" begin="2.3s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines=".45 0 .55 1"/>
    <animate attributeName="opacity" values="0;1;0" keyTimes="0;.15;1" dur="6s" begin="2.3s" repeatCount="indefinite"/>
  </circle>` : ''}
</svg>
`;
  }

  // 11 Core Cards
  await writeFile(path.join(outDir, 'hero-architect.svg'), heroArchitectSvg);
  await writeFile(path.join(outDir, 'hero-architect-v2.svg'), heroArchitectSvg);
  await writeFile(path.join(outDir, 'terminal-system.svg'), terminalSystemSvg);
  await writeFile(path.join(outDir, 'architecture-leadership.svg'), architectureLeadershipSvg);
  await writeFile(path.join(outDir, 'engineering-systems.svg'), engineeringSystemsSvg);
  await writeFile(path.join(outDir, 'technology-core.svg'), technologyCoreSvg);
  await writeFile(path.join(outDir, 'project-angular-architecture.svg'), projectAngularArchitectureSvg);
  await writeFile(path.join(outDir, 'project-rxjs-operator-lab.svg'), projectRxjsOperatorLabSvg);
  await writeFile(path.join(outDir, 'project-ngrx-effects.svg'), projectNgrxEffectsSvg);
  await writeFile(path.join(outDir, 'project-typescript-types.svg'), projectTypescriptTypesSvg);
  await writeFile(path.join(outDir, 'research-systems.svg'), researchSystemsSvg);
  await writeFile(path.join(outDir, 'ai-orchestration.svg'), aiOrchestrationSvg);

  // 8 Part Title SVGs
  await writeFile(path.join(outDir, 'title-part01.svg'), generatePartTitleSvg('part01', 'PART 01', 'SYSTEM ARCHITECTURE CLI', 'Developer Environment &', 'Execution Core.', 'whoami · focus · platform'));
  await writeFile(path.join(outDir, 'title-part02.svg'), generatePartTitleSvg('part02', 'PART 02', 'ENGINEERING SYSTEMS', 'Architecture Leadership &', 'Scalability.', 'WorldGyan Platform · 4 Core Pillars'));
  await writeFile(path.join(outDir, 'title-part03.svg'), generatePartTitleSvg('part03', 'PART 03', 'CORE TECHNOLOGY', 'Reactive Engineering &', 'Foundations.', 'Angular · TypeScript · RxJS · NgRx'));
  await writeFile(path.join(outDir, 'title-part04.svg'), generatePartTitleSvg('part04', 'PART 04', 'AI ORCHESTRATION', 'Autonomous Agent Workflows &', 'Execution Cycles.', 'Plan · Act · Reflect'));
  await writeFile(path.join(outDir, 'title-part05.svg'), generatePartTitleSvg('part05', 'PART 05', 'SELECTED ENGINEERING PROJECTS', 'Scalable Systems &', 'Open Source.', 'Verified Public Reference Implementations'));
  await writeFile(path.join(outDir, 'title-part06.svg'), generatePartTitleSvg('part06', 'PART 06', 'GITHUB ANALYTICS & OPEN SOURCE', 'Building in', 'public.', 'GitHub Contribution Calendar', {ambientMotion:false}));
  await writeFile(path.join(outDir, 'title-part07.svg'), generatePartTitleSvg('part07', 'PART 07', 'RESEARCH & KNOWLEDGE', 'Engineering,', 'shared.', 'Frontend Systems · AI Engineering'));
  await writeFile(path.join(outDir, 'title-part08.svg'), generatePartTitleSvg('part08', 'PART 08', 'CONNECT & COLLABORATE', "Let's build something", 'worth explaining.', 'Open Inbox & Direct Channels'));

  // Telemetry & Connect Obsidian Assets
  let githubJet = await readFile(path.join(root, 'themes/obsidian-architect/dist/github-jet.svg'), 'utf8');
  githubJet = githubJet.replace('fill="#0d1117"', 'fill="#10070C" rx="14" stroke="#C77B9B" stroke-opacity=".25"');
  await writeFile(path.join(outDir, 'github-jet.svg'), githubJet);

  const snake = await readFile(path.join(root, 'themes/obsidian-architect/assets/contribution-snake.svg'), 'utf8');
  await writeFile(path.join(outDir, 'contribution-snake.svg'), snake);

  const sig = await readFile(path.join(root, 'themes/obsidian-architect/assets/footer-signature-v2.svg'), 'utf8');
  await writeFile(path.join(outDir, 'footer-signature-v2.svg'), sig);

  console.log('Successfully generated Obsidian-Architect SVGs & Part Titles in themes/main/assets/');
}
