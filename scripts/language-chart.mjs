const palette = {
  dark: '#10070C', panel: '#190B12', inset: '#150910', border: '#542039',
  heading: '#F8F0F3', detail: '#E5B5C7', accent: '#FFC8DE', selected: '#381727',
  slices: ['#E9A6C2', '#9F648F', '#D25785', '#BD92C1', '#E17767', '#8369A5', '#6E475C'],
};
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function allocateSlices(areas) {
  const total = areas.reduce((sum, area) => sum + area.weight, 0);
  let offset = 0;
  return areas.map((area, index) => {
    const start = offset / total;
    offset += area.weight;
    return { ...area, start, end: offset / total, color: palette.slices[index] };
  });
}

function text(x, y, value, size, options = {}) {
  const { color = palette.detail, family = 'sans', align = 'start', weight = 400 } = options;
  return `<text x="${x}" y="${y}" class="${family}" font-size="${size}" fill="${color}" text-anchor="${align}" font-weight="${weight}">${escape(value)}</text>`;
}

function sectorPath({ start, end }, x, y, inner, outer) {
  const point = (radius, turn) => {
    const angle = (turn === 1 ? 0 : turn) * 2 * Math.PI;
    return `${(x + radius * Math.sin(angle)).toFixed(3)} ${(y - radius * Math.cos(angle)).toFixed(3)}`;
  };
  const largeArc = end - start > 0.5 ? 1 : 0;
  return `M${point(outer, start)} A${outer} ${outer} 0 ${largeArc} 1 ${point(outer, end)} ` +
    `L${point(inner, end)} A${inner} ${inner} 0 ${largeArc} 0 ${point(inner, start)} Z`;
}

function highlightStyles(count) {
  const duration = Math.max(4, count * 2);
  const interval = 100 / count;
  const fade = Math.min(interval / 3, 2);
  const percent = value => `${Number(value.toFixed(3))}%`;
  const styles = Array.from({ length: count }, (_, index) => {
    const start = index * interval;
    const end = (index + 1) * interval;
    const on = index === 0 ? '0%' : percent(start + fade);
    const off = index === count - 1 ? '100%' : `${percent(end)},100%`;
    const initial = index === 0 ? '' : `0%,${percent(start)}{opacity:0}`;
    return `.language-${index}{animation:language-${index} ${duration}s ease infinite}\n` +
      `@keyframes language-${index}{${initial}${on},${percent(end - fade)}{opacity:1}${off}{opacity:0}}`;
  });
  return `${styles.join('\n')}\n@media(prefers-reduced-motion:reduce){.highlight{animation:none}}`;
}

function ring(summary, view, x, y, mobile, animated) {
  const radius = mobile ? 64 : 90;
  const thickness = mobile ? 27 : 37;
  const centerSize = String(view.centerTitle).length > 3 ? (mobile ? 25 : 34) : (mobile ? 33 : 43);
  const slices = summary.slices.map(slice => ({
    ...slice, path: sectorPath(slice, x, y, radius - thickness / 2, radius + thickness / 2),
  }));
  // A same-color edge prevents the backdrop from showing through antialiased joins.
  const wedges = slices.map(({ path, color }) => `<path d="${path}" fill="${color}" fill-rule="evenodd" stroke="${color}" stroke-width=".65" stroke-linejoin="round"/>`);
  if (animated) {
    wedges.push(...slices.map(({ path }, index) => `<path class="highlight language-${index}" d="${path}" fill="${palette.accent}" fill-rule="evenodd" fill-opacity=".52"/>`));
  }
  return `${wedges.join('\n')}
${text(x, y + 6, view.centerTitle, centerSize, { align: 'middle', color: palette.heading, family: 'serif', weight: 600 })}
${text(x, y + (mobile ? 26 : 31), view.centerCaption, mobile ? 13 : 15, { align: 'middle' })}`;
}

function legend(summary, mobile, animated) {
  const slots = Math.ceil(summary.slices.length / 2);
  const width = mobile ? 183 : 337;
  const height = mobile ? 31 : 40;
  const separation = mobile ? 8 : 12;
  return summary.slices.map((slice, index) => {
    const x = (mobile ? 22 : 472) + (width + separation) * Math.floor(index / slots);
    const y = (mobile ? 277 : 123) + (height + separation) * (index % slots);
    const selected = animated ? `<rect class="highlight language-${index}" x="${x}" y="${y}" width="${width}" height="${height}" rx="6" fill="${palette.selected}" stroke="${slice.color}"/>` : '';
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="6" fill="${palette.inset}" stroke="${palette.border}"/>
${selected}
<circle cx="${x + 14}" cy="${y + height / 2}" r="${mobile ? 4 : 5}" fill="${slice.color}"/>
${text(x + 26, y + height / 2 + 5, slice.name, mobile ? 14 : 16, { color: palette.heading })}
${text(x + width - 13, y + height / 2 + 5, slice.role, mobile ? 13 : 16, { align: 'end', weight: 600 })}`;
  }).join('\n');
}

function render(summary, view, mobile, animated) {
  const width = mobile ? 420 : 1200;
  const mobileRows = Math.ceil(summary.slices.length / 2);
  const height = mobile ? 332 + mobileRows * 39 : 383;
  const inset = mobile ? 22 : 44;
  const subtitle = mobile ? view.mobileSubtitle : view.subtitle;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="title desc">
<title id="title">${escape(view.title)}</title>
<desc id="desc">${escape(summary.description)}</desc>
<defs><linearGradient id="board" x2="1" y2="1"><stop stop-color="${palette.panel}"/><stop offset="1" stop-color="${palette.dark}"/></linearGradient></defs>
<style>
.sans{font-family:system-ui,Arial,sans-serif}.serif{font-family:Georgia,'Times New Roman',serif}
${animated ? `.highlight{opacity:0}\n${highlightStyles(summary.slices.length)}\n` : ''}</style>
<rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="18" fill="url(#board)" stroke="${palette.border}" stroke-width="2"/>
${text(inset, mobile ? 47 : 59, view.title, mobile ? 32 : 41, { color: palette.heading, family: 'serif' })}
${text(inset, mobile ? 73 : 89, subtitle, mobile ? 15 : 18)}
${ring(summary, view, mobile ? 210 : 244, mobile ? 170 : 214, mobile, animated)}
${legend(summary, mobile, animated)}
${text(inset, height - 28, view.footer, mobile ? 13 : 15)}
</svg>\n`;
}

function chartVariants(summary, view) {
  return {
    desktop: render(summary, view, false, true), mobile: render(summary, view, true, true),
    desktopStatic: render(summary, view, false, false), mobileStatic: render(summary, view, true, false), summary,
  };
}

export function buildTechnologyFocus(areas) {
  if (!Array.isArray(areas) || areas.length < 2 || areas.length > palette.slices.length ||
      areas.some(area => !area || typeof area.name !== 'string' || !area.name.trim() ||
        typeof area.role !== 'string' || !area.role.trim() || !Number.isSafeInteger(area.weight) || area.weight <= 0) ||
      new Set(areas.map(area => area.name)).size !== areas.length) {
    throw new Error('Configure two to seven distinct technology focus areas with positive weights and nonempty labels.');
  }
  const slices = allocateSlices(areas);
  const scope = slices.map(({ name, role }) => `${name} (${role.toLowerCase()})`).join(', ');
  const largestWeight = Math.max(...areas.map(area => area.weight));
  const primary = areas.filter(area => area.weight === largestWeight).map(area => area.name);
  const abbreviations = new Map([['JavaScript', 'JS'], ['TypeScript', 'TS']]);
  const centerLabel = primary.map(name => abbreviations.get(name) ?? name).join(' · ');
  const showPrimary = centerLabel.length <= 8;
  const description = `Technology focus cycles through ${scope}. Most emphasis goes to ${primary.join(' and ')}. Slice size shows relative emphasis.`;
  return chartVariants({ slices, description }, {
    title: 'Technology focus',
    subtitle: 'Frontend engineering, supporting tools, and AI exploration',
    mobileSubtitle: 'Frontend engineering and AI exploration',
    centerTitle: showPrimary ? centerLabel : areas.length,
    centerCaption: showPrimary ? 'primary focus' : 'focus areas',
    footer: 'Slice size reflects relative emphasis',
  });
}
