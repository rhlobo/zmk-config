// Layout code for the cheat sheets: draws the page from SHARED (shared-layout.js) and KEYBOARD
// (the data block of each keyboard's HTML file). No labels live here.

// Merges the shared layers with one keyboard's own slots. Each resulting layer has
// rows (3 x 12: left outer, 5 left, 5 right, right outer), thumbs, held, and optionally joy/enc.
function buildLayers(shared, keyboard) {
  const own = keyboard.layers || {};
  return [...shared.layers, ...(keyboard.extraLayers || [])].map(layer => {
    const l = { ...layer, ...(own[layer.id] || {}) };
    const outerL = l.outerL || [__, __, __], outerR = l.outerR || [__, __, __];
    l.rows = [0, 1, 2].map(r => [outerL[r], ...l.left[r], ...l.right[r], outerR[r]]);
    return l;
  });
}

function renderSheet() {
  const LAYERS = buildLayers(SHARED, KEYBOARD);
  const hasMiddle = LAYERS.some(l => l.joy || l.enc);   // joystick and encoder between the halves
  const infoInGrid = LAYERS.length % 2 === 1;           // odd layer count: legend fills the last cell

  // Geometry in millimetres.
  const W = 135;                           // width of a whole keyboard drawing
  const MIDDLE = hasMiddle ? 26.6 : 12;    // space between the halves
  const G = 0.6, OG = 0.8;                 // key gap; extra gap beside an outer column
  const KH = infoInGrid ? 12 : 10;         // key height: taller when there is no footer strip
  const KW = (W - MIDDLE - 2 * OG - 10 * G) / 12;
  const SCALE = Math.min(KW / 8.5, KH / 10);            // font scale for the keys
  const STAGGER = [2.6, 2.6, 1.0, 0, 1.0, 1.8];   // left half, outer column → inner column
  const THUMB_SHIFT = Math.min(5, MIDDLE / 2 - 2), THUMB_DROP = [0, 0.5, 1.4];  // left thumbs, outer → inner
  const MW = 8, MH = 6.8, MG = 0.4;        // joystick keys
  const P = KW + G;
  const HALF = KW + OG + 5 * P - G;        // width of one half
  const THUMB_Y = STAGGER[5] + 3 * (KH + G) + 0.4;
  const H = THUMB_Y + THUMB_DROP[2] + KH;  // height of a keyboard drawing

  const byId = Object.fromEntries(LAYERS.map(l => [l.id, l]));
  const base = LAYERS[0];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const mm = n => `${Math.round(n * 100) / 100}mm`;

  function parse(spec) {
    if (spec === __) return { trans: true };
    if (spec === XX) return { none: true };
    const parts = spec.split(/\s+(hold|shift|cap):/);
    const key = { tap: parts[0] };
    for (let i = 1; i < parts.length; i += 2) key[parts[i]] = parts[i + 1];
    return key;
  }
  const layerRef = s => { const m = /^@(\w+)$/.exec(s || ''); return m && byId[m[1]]; };

  // Font size (pt) for a tap legend, from its longest word.
  function tapSize(text) {
    const words = text.split(' ');
    // Modifier and key symbols are wider than letters, so they count for more.
    const width = w => Array.from(w.replace(/[\uFE0E\uFE0F]/g, '')).reduce((n, ch) => n + (/[⊞⌥⌃⇧⌫⌦⇥⏎]/.test(ch) ? 1.3 : 1), 0);
    const len = Math.ceil(Math.max(...words.map(width)) - 0.35);
    const size = [13, 13, 10.5, 8.6, 7, 6.2, 5.6][len] || 5;
    return words.length > 1 ? Math.min(size, 6.2) : size;
  }

  function tapHTML(key) {
    const to = layerRef(key.tap);
    if (to) return `<span class="chip" style="--t:${to.color}">${esc(to.short)}</span>`;
    return `<span class="tap" style="--f:${tapSize(key.tap)}">${key.tap.split(' ').map(esc).join('<br>')}</span>`;
  }

  // One key. opt: x, y, w, h (mm), base (the Base spec, for &trans), held, ghost, mini, rel.
  function keyHTML(spec, opt = {}) {
    let key = parse(spec), cls = ['key'], inner = '';
    if (key.trans && opt.held) { key = { tap: parse(opt.base).tap, hold: 'held' }; cls.push('held'); }
    else if (key.trans) { key = parse(opt.base ?? XX); cls.push('ghost'); if (key.trans) key = { none: true }; }
    else if (opt.held) cls.push('ring');
    if (opt.ghost) cls.push('ghost');
    if (opt.mini) cls.push('mini');
    if (key.none) cls.push('none');
    else if (opt.mini) {
      inner = tapHTML(key) + (key.shift ? `<span class="sub">⇧ ${esc(key.shift)}</span>` : '');
    } else {
      if (key.cap || key.shift) cls.push('has-top');
      if (key.cap) inner += `<span class="cap">${esc(key.cap)}</span>`;
      if (key.shift) inner += `<span class="sh">${esc(key.shift)}</span>`;
      inner += tapHTML(key);
      if (key.hold) {
        cls.push('has-hold');
        const to = layerRef(key.hold);
        if (to) inner += `<span class="hold layer" style="--t:${to.color}">${esc(to.short)}</span>`;
        else inner += `<span class="hold${/^[⇧⌃⌥⊞]+$/.test(key.hold) ? ' mod' : ''}">${esc(key.hold)}</span>`;
      }
    }
    const pos = opt.rel ? '' : `left:${mm(opt.x)};top:${mm(opt.y)};`;
    return `<div class="${cls.join(' ')}" style="${pos}width:${mm(opt.w ?? KW)};height:${mm(opt.h ?? KH)}">${inner}</div>`;
  }

  // Top-left corner of the key in column c (0-11) of row r (0-2).
  function keyXY(r, c) {
    const left = c < 6, i = left ? c : 11 - c;          // i: 0 = outer column … 5 = inner column
    const x = i === 0 ? 0 : KW + OG + (i - 1) * P;
    return [left ? x : W - KW - x, STAGGER[i] + r * (KH + G)];
  }
  function thumbXY(t) {
    const left = t < 3, i = left ? t : 5 - t;           // i: 0 = outer thumb … 2 = inner thumb
    const x = keyXY(0, 3)[0] + THUMB_SHIFT + i * P;
    return [left ? x : W - KW - x, THUMB_Y + THUMB_DROP[i]];
  }

  function joystickHTML(layer) {
    if (!layer.joy) return '';
    const x0 = HALF + (W - 2 * HALF - 3 * MW - 2 * MG) / 2, y0 = 0.4;
    const cell = (name, col, row) => keyHTML(layer.joy[name], {
      x: x0 + col * (MW + MG), y: y0 + row * (MH + MG), w: MW, h: MH, mini: true, base: base.joy[name],
    });
    const note = layer.joy.note
      ? `<div class="tag note" style="left:${mm(x0 + 2 * (MW + MG))};top:${mm(y0 + 2)};width:${mm(MW)}">${esc(layer.joy.note)}</div>` : '';
    return `<div class="tag" style="left:${mm(x0)};top:${mm(y0 + 2)}">joy<br>stick</div>${note}`
      + cell('up', 1, 0) + cell('left', 0, 1) + cell('press', 1, 1) + cell('right', 2, 1) + cell('down', 1, 2);
  }

  function encoderHTML(layer) {
    if (!layer.enc) return '';
    const x0 = HALF + 0.8, y0 = 0.4 + 3 * (MH + MG) + 0.5;
    const part = name => {
      let key = parse(layer.enc[name]), ghost = '';
      if (key.trans) { key = parse(base.enc[name]); ghost = ' ghost'; }
      return [key, ghost];
    };
    const side = (name, arrow) => {
      const [key, ghost] = part(name);
      const big = Array.from(key.tap).length <= 3 ? ' big' : '';
      return `<div class="side${ghost}${big}"><i>${arrow}</i>${key.tap.split(' ').map(esc).join('<br>')}</div>`;
    };
    const [push, ghost] = part('push');
    return `<div class="enc" style="left:${mm(x0)};top:${mm(y0)};width:${mm(W - 2 * HALF - 1.6)}">`
      + side('ccw', '↺')
      + `<div class="dial${ghost}" style="--f:${tapSize(push.tap)}">${push.tap.split(' ').map(esc).join('<br>')}</div>`
      + side('cw', '↻') + `</div>`;
  }

  function layerHTML(layer) {
    let keys = '';
    layer.rows.forEach((row, r) => row.forEach((spec, c) => {
      const [x, y] = keyXY(r, c);
      keys += keyHTML(spec, { x, y, base: base.rows[r][c] });
    }));
    layer.thumbs.forEach((spec, t) => {
      const [x, y] = thumbXY(t);
      keys += keyHTML(spec, { x, y, base: base.thumbs[t], held: layer.held === t });
    });
    return `<section class="layer" style="--c:${layer.color}">
      <h2><b>${esc(layer.name)}</b><span>${esc(layer.reach)}</span></h2>
      <div class="kb" style="--ks:${SCALE.toFixed(3)};width:${mm(W)};height:${mm(H)}">${keys}${joystickHTML(layer)}${encoderHTML(layer)}</div>
    </section>`;
  }

  const legend = SHARED.legend.map(item =>
    `<div class="item">${keyHTML(item.held ? __ : item.key, { rel: true, held: item.held, ghost: item.ghost, base: item.key, w: 8.5, h: 8.6 })}<span>${esc(item.text)}</span></div>`).join('');
  const combos = SHARED.combos.map(c => {
    const keys = c.keys.split(' + ').map(k => `<kbd>${esc(k)}</kbd>`).join(' + ');
    const tint = c.layer ? ` style="--t:${byId[c.layer].color}"` : '';
    return `<li>${keys} → <b${tint}>${esc(c.does)}</b>${c.only ? ` <em>(${esc(c.only)} only)</em>` : ''}</li>`;
  }).join('');

  const notes = [...SHARED.notes, ...(KEYBOARD.notes || [])];
  const info = `
      <section class="legend"><h3>Legend</h3><div class="items">${legend}</div></section>
      <section class="combos"><h3>Combos (keys pressed together)</h3><ul>${combos}</ul></section>
      <section class="notes"><h3>Notes</h3><ul>${notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul></section>`;

  document.title = KEYBOARD.title;
  document.getElementById('page').innerHTML = `
    <header><h1>${esc(KEYBOARD.title)}</h1><div class="glossary">${esc(SHARED.glossary)}</div></header>
    <div class="grid">${LAYERS.map(layerHTML).join('')}${infoInGrid ? `<div class="info cell">${info}</div>` : ''}</div>
    ${infoInGrid ? '' : `<footer class="info strip">${info}</footer>`}`;
}

if (typeof document !== 'undefined') renderSheet();
