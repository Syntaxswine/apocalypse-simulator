// Page wiring: knobs in, ensemble out, everything on the screen traceable back
// to a line in data/hazards.json and from there to a citation.

import { runOnce, makeEnsemble, seedFor, initialWorld } from './model.js';
import { explainRate, hazardRate } from './couplings.js';
import { KNOBS, CONST, PRESETS } from './params.js';
import { drawSurvival, drawFan, drawRun } from './charts.js';
import { narrateEvent, summarise, ruleOfThumb, fmtPeople, pct } from './narrate.js';
import { seedFromString } from './rng.js';

const $ = (s) => document.querySelector(s);
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

const CATCOLOR = {
  astronomical: 'var(--hz-astronomical)', geological: 'var(--hz-geological)',
  biological: 'var(--hz-biological)', 'climate-ecological': 'var(--hz-climate)',
  conflict: 'var(--hz-conflict)', technological: 'var(--hz-technological)',
  systemic: 'var(--hz-systemic)', cosmological: 'var(--hz-cosmological)',
};
const BASIS_BADGE = {
  'observed-frequency': ['obs', 'observed'], 'geological-record': ['geo', 'geological'],
  'physical-model': ['model', 'modelled'], 'expert-elicitation': ['elic', 'elicited'],
  'author-estimate': ['auth', 'estimated'],
};

let HAZ = [], HAZIX = {}, BENCH = null, DEEP = null, HONEST = null;
let cfg = null, lastRes = null, lastRun = null, running = false;

// ── configuration ─────────────────────────────────────────────────────────

function baseConfig() {
  const c = { ...CONST, horizon: 100, keepTrace: false, enabled: {} };
  for (const k of KNOBS) c[k.id] = k.def;
  for (const h of HAZ) c.enabled[h.id] = true;
  return c;
}

function isDirty() {
  return KNOBS.some((k) => Math.abs(cfg[k.id] - k.def) > 1e-9) ||
    HAZ.some((h) => !cfg.enabled[h.id]);
}

// ── URL state, so a run can be handed to somebody else intact ──────────────

function toHash() {
  const p = new URLSearchParams();
  p.set('seed', $('#seed').value);
  p.set('n', $('#runs').value);
  p.set('h', String(cfg.horizon));
  for (const k of KNOBS) if (Math.abs(cfg[k.id] - k.def) > 1e-9) p.set(k.id, String(cfg[k.id]));
  const off = HAZ.filter((h) => !cfg.enabled[h.id]).map((h) => h.id);
  if (off.length) p.set('off', off.join(','));
  return '#' + p.toString();
}

function fromHash() {
  const p = new URLSearchParams(location.hash.slice(1));
  if (!p.toString()) return;
  if (p.has('seed')) $('#seed').value = p.get('seed');
  if (p.has('n')) $('#runs').value = p.get('n');
  if (p.has('h')) { cfg.horizon = +p.get('h'); $('#horizon').value = p.get('h'); }
  for (const k of KNOBS) if (p.has(k.id)) cfg[k.id] = +p.get(k.id);
  if (p.has('off')) for (const id of p.get('off').split(',')) if (id in cfg.enabled) cfg.enabled[id] = false;
}

// ── controls ──────────────────────────────────────────────────────────────

function buildKnobs() {
  const host = $('#knobs');
  host.textContent = '';
  let group = null;
  for (const k of KNOBS) {
    if (k.group !== group) {
      group = k.group;
      host.appendChild(el('h3', null, group));
    }
    const row = el('div', 'row');
    const lab = el('label', null, k.label);
    lab.htmlFor = 'k_' + k.id;
    lab.title = k.anchor;
    const inp = el('input');
    inp.type = 'range'; inp.id = 'k_' + k.id;
    if (k.scale === 'log') {
      inp.min = 0; inp.max = 1000; inp.step = 1;
      inp.value = String(toLog(k, cfg[k.id]));
    } else {
      inp.min = k.min; inp.max = k.max; inp.step = k.step;
      inp.value = String(cfg[k.id]);
    }
    const out = el('output', null, k.fmt(cfg[k.id]));
    inp.addEventListener('input', () => {
      cfg[k.id] = k.scale === 'log' ? fromLog(k, +inp.value) : +inp.value;
      out.textContent = k.fmt(cfg[k.id]);
      markDirty();
    });
    row.append(lab, inp, out);
    const anchor = el('div', 'anchor', k.anchor);
    host.append(row, anchor);
  }
}

// Log sliders: many of these span four orders of magnitude and a linear slider
// would spend 99% of its travel in a range nobody cares about.
const toLog = (k, v) => {
  const lo = Math.log(Math.max(1e-6, k.min || k.step)), hi = Math.log(k.max);
  return Math.round(((Math.log(Math.max(k.min || k.step, v)) - lo) / (hi - lo)) * 1000);
};
const fromLog = (k, s) => {
  const lo = Math.log(Math.max(1e-6, k.min || k.step)), hi = Math.log(k.max);
  const v = Math.exp(lo + (s / 1000) * (hi - lo));
  return k.step >= 1 ? Math.round(v / k.step) * k.step : v;
};

function syncKnobs() {
  for (const k of KNOBS) {
    const inp = document.getElementById('k_' + k.id);
    if (!inp) continue;
    inp.value = String(k.scale === 'log' ? toLog(k, cfg[k.id]) : cfg[k.id]);
    inp.parentElement.querySelector('output').textContent = k.fmt(cfg[k.id]);
  }
}

function buildToggles() {
  const host = $('#toggles');
  host.textContent = '';
  const w = initialWorld(cfg);
  for (const h of [...HAZ].sort((a, b) => hazardRate(b, w, cfg) - hazardRate(a, w, cfg))) {
    const lab = el('label', 'toggle');
    lab.title = h.oneLine;
    const cb = el('input'); cb.type = 'checkbox'; cb.checked = !!cfg.enabled[h.id];
    cb.addEventListener('change', () => { cfg.enabled[h.id] = cb.checked; markDirty(); });
    const sw = el('span', 'sw'); sw.style.background = CATCOLOR[h.cat] || '#888';
    const nm = el('span', 'nm', h.name);
    const pr = el('span', 'pr', fmtRate(hazardRate(h, w, cfg)));
    lab.append(cb, sw, nm, pr);
    host.appendChild(lab);
  }
}

function fmtRate(p) {
  if (p <= 0) return '0';
  if (p >= 0.01) return p.toFixed(3);
  const inv = Math.round(1 / p);
  return '1/' + (inv >= 1e6 ? (inv / 1e6).toFixed(inv >= 1e7 ? 0 : 1) + 'M'
    : inv >= 1000 ? (inv / 1000).toFixed(inv >= 1e4 ? 0 : 1) + 'k' : inv);
}

function buildPresets() {
  const sel = $('#preset');
  for (const p of PRESETS) {
    const o = el('option', null, p.name);
    o.value = p.id;
    sel.appendChild(o);
  }
  sel.addEventListener('change', () => applyPreset(sel.value));
  $('#presetNote').textContent = PRESETS[0].note;
}

function applyPreset(id) {
  const p = PRESETS.find((x) => x.id === id);
  if (!p) return;
  for (const k of KNOBS) cfg[k.id] = k.def;
  Object.assign(cfg, p.over);
  for (const h of HAZ) cfg.enabled[h.id] = p.onlyNatural ? !h.anthropogenic : true;
  $('#presetNote').textContent = p.note;
  syncKnobs(); buildToggles(); markDirty(); run();
}

function markDirty() {
  $('#dirty').textContent = isDirty() ? 'edited' : '';
}

// ── the run ───────────────────────────────────────────────────────────────

let worker = null;
function getWorker() {
  if (worker) return worker;
  try {
    worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
  } catch { worker = null; }
  return worker;
}

function run() {
  if (running) return;
  running = true;
  $('#run').disabled = true;
  $('#busy').classList.add('on');
  $('#busy').textContent = 'RUNNING…';

  const n = +$('#runs').value;
  cfg.horizon = +$('#horizon').value;
  const seedTxt = $('#seed').value.trim() || '1';
  const base = /^-?\d+$/.test(seedTxt) ? (Math.abs(+seedTxt) >>> 0) || 1 : seedFromString(seedTxt);
  const active = HAZ.filter((h) => cfg.enabled[h.id]);

  const finish = (res) => {
    lastRes = res;
    // One run kept in full and traced, to be told as a story. It is seed #0 of
    // the same ensemble, so the narrated history is genuinely a member of the
    // distribution drawn above it rather than a chosen dramatic one.
    lastRun = runOnce(active, { ...cfg, keepTrace: true }, seedFor(base, 0));
    render();
    running = false;
    $('#run').disabled = false;
    $('#busy').classList.remove('on');
    history.replaceState(null, '', toHash());
  };

  const w = getWorker();
  if (w) {
    w.onmessage = (e) => {
      if (e.data.type === 'progress') {
        $('#busy').textContent = `RUNNING… ${Math.round((e.data.done / e.data.n) * 100)}%`;
      } else if (e.data.type === 'done') {
        finish(e.data.result);
      }
    };
    w.onerror = () => { worker = null; finish(runManyLocal(active, n, base)); };
    // cfg carries an onDraw hook in the check harness; it is a function and
    // would not survive structured cloning, so send a clean copy.
    const { onDraw, ...plain } = cfg;
    w.postMessage({ hazards: active, cfg: plain, n, base });
    return;
  }
  // No worker available (very old browser, or a file:// open). Run inline and
  // accept the freeze — it is a few seconds at the largest setting.
  requestAnimationFrame(() => finish(runManyLocal(active, n, base)));
}

function runManyLocal(active, n, base) {
  const ens = makeEnsemble(cfg, n);
  const runCfg = { ...cfg, keepTrace: false };
  for (let i = 0; i < n; i++) ens.push(runOnce(active, runCfg, seedFor(base, i), ens.slot()));
  return ens.finish();
}

// ── rendering ─────────────────────────────────────────────────────────────

function render() {
  const r = lastRes, endYear = cfg.startYear + cfg.horizon;

  $('#stamp').innerHTML =
    `seed <b>${$('#seed').value}</b> · ${r.n.toLocaleString()} worlds · ${cfg.startYear}–${endYear}<br>` +
    `${HAZ.filter((h) => cfg.enabled[h.id]).length}/${HAZ.length} hazards on the board`;

  // verdict
  const v = $('#verdict'); v.textContent = '';
  const cell = (k, val, unit, sub, hot) => {
    const c = el('div', 'vcell' + (hot ? ' hot' : ''));
    c.append(el('span', 'k', k));
    const vv = el('div', 'v', val);
    if (unit) vv.append(el('span', 'u', ' ' + unit));
    c.append(vv);
    if (sub) c.append(el('div', 'sub', sub));
    return c;
  };
  const seTxt = `±${(r.seExtinct * 100 * 1.96).toFixed(3)} at 95%`;
  v.append(
    cell('a catastrophe (>10% dead)', pct(r.pScratch, r.pScratch < 0.05 ? 2 : 1), '', `by ${endYear}`, r.pScratch > 0.05),
    cell('a collapse (>50% dead)', pct(r.pCollapse, 2), '', `by ${endYear}`, r.pCollapse > 0.02),
    cell('the end', pct(r.pExtinct, 3), '', seTxt, r.pExtinct > 0.005),
    cell('median population in ' + endYear, r.popMedian.toFixed(2), 'bn',
      `against ${CONST.popPeak.toFixed(1)} bn if nothing happened`),
    cell('worst 1-in-10 world loses', pct(r.p90Drawdown, 0), '', 'of the people who would have lived'),
  );

  const prose = $('#verdictProse'); prose.textContent = '';
  for (const line of ruleOfThumb(r, cfg, HAZIX)) prose.append(el('p', null, line));
  $('#verdictNote').textContent = `${r.n.toLocaleString()} independent worlds, seeded from “${$('#seed').value}”`;

  // bars
  $('#endsIntro').textContent =
    'The left-hand ranking is what is most likely to hurt you. The right-hand one is what is most ' +
    'likely to finish you. They are usually different lists, and the gap between them is the ' +
    'single most useful thing a model like this produces.';
  drawBars($('#barsFirst'), r.firstCatastrophe, r.n, 'of all worlds');
  drawBars($('#barsEnd'), r.byEnding, Math.max(1, r.extinct), 'of ended worlds');

  const leg = $('#catLegend'); leg.textContent = '';
  for (const [cat, color] of Object.entries(CATCOLOR)) {
    if (!HAZ.some((h) => h.cat === cat && cfg.enabled[h.id])) continue;
    const s = el('span');
    const i = el('i'); i.style.background = color;
    s.append(i, document.createTextNode(cat.replace('-', ' / ')));
    leg.appendChild(s);
  }

  // charts
  drawSurvival($('#cSurvival'), r, cfg, BENCH.marks);
  drawFan($('#cFan'), r, cfg);
  drawRun($('#cRun'), lastRun, cfg);
  $('#survivalNote').textContent = BENCH.survivalNote;
  $('#fanNote').textContent =
    `Half of all worlds finish between ${r.fan.p25[cfg.horizon - 1].toFixed(2)} and ` +
    `${r.fan.p75[cfg.horizon - 1].toFixed(2)} billion people. One in twenty finishes below ` +
    `${r.fan.p05[cfg.horizon - 1].toFixed(2)} billion. The dark line is the median, which — like ` +
    `every median of an ensemble — is a world nobody lives in.`;

  // narrated run
  $('#runSeedNote').textContent = `seed ${$('#seed').value}, run #1 of ${r.n.toLocaleString()} — an ordinary member of the ensemble above, not a chosen one`;
  const tl = $('#timeline'); tl.textContent = '';
  tl.append(el('p', null, summarise(lastRun, cfg, HAZIX)));
  const shown = lastRun.events.filter((e) => e.killedFraction > 0.0005);
  if (!shown.length) {
    tl.append(el('p', 'note', 'Nothing in this world killed even one person in two thousand. Most worlds are like this.'));
  }
  for (const ev of shown.slice(0, 40)) {
    const hz = HAZIX[ev.hazard];
    const { head, detail } = narrateEvent(ev, hz);
    const row = el('div', 'tl' + (ev.year === lastRun.endYear ? ' end' : ''));
    row.append(el('div', 'yr', String(ev.year)));
    const gut = el('div', 'gut');
    const dot = el('div', 'dot');
    dot.style.background = CATCOLOR[hz?.cat] || '#888';
    gut.append(dot); row.append(gut);
    const txt = el('div', 'txt');
    txt.append(el('div', 'hd', head), el('div', 'dd', detail));
    row.append(txt);
    tl.append(row);
  }
  if (!lastRun.survived) {
    const row = el('div', 'tl end');
    row.append(el('div', 'yr', String(lastRun.endYear)));
    const gut = el('div', 'gut'); const dot = el('div', 'dot');
    dot.style.background = 'var(--red)'; gut.append(dot); row.append(gut);
    const txt = el('div', 'txt');
    txt.append(el('div', 'hd', 'No one is left.'));
    txt.append(el('div', 'dd', `Total dead across the run: ${fmtPeople(lastRun.deaths)}.`));
    row.append(txt); tl.append(row);
  }

  buildToggles();
  renderCards();
}

function drawBars(host, entries, denom, unit) {
  host.textContent = '';
  if (!entries.length) {
    host.append(el('p', 'note', 'Nothing in this category happened in any run.'));
    return;
  }
  const top = entries[0][1] / denom;
  for (const [id, count] of entries.slice(0, 14)) {
    const hz = HAZIX[id];
    const share = count / denom;
    const row = el('div', 'bar' + (share < top / 40 ? ' muted' : ''));
    const nm = el('div', 'nm', hz ? hz.name : id);
    if (hz) nm.title = hz.oneLine;
    const track = el('div', 'track');
    const fill = el('div', 'fill');
    fill.style.width = (100 * share / top).toFixed(2) + '%';
    fill.style.background = CATCOLOR[hz?.cat] || '#888';
    track.append(fill);
    row.append(nm, track, el('div', 'val', pct(share, share < 0.01 ? 2 : 1)));
    host.append(row);
  }
  host.append(el('p', 'hint', `Shares are ${unit}. Bars are scaled to the leader, not to 100%.`));
}

function renderCards() {
  const host = $('#cards'); host.textContent = '';
  const w = initialWorld(cfg);
  const sorted = [...HAZ].sort((a, b) => hazardRate(b, w, cfg) - hazardRate(a, w, cfg));
  for (const h of sorted) {
    const d = el('details', 'hz');
    const s = el('summary');
    const sw = el('span', 'cat'); sw.style.background = CATCOLOR[h.cat] || '#888';
    const rate = hazardRate(h, w, cfg);
    const worst = h.tiers.reduce((a, b) => (b.deaths > a.deaths ? b : a));
    s.append(sw, el('span', null, h.name),
      el('span', 'rt', fmtRate(rate) + ' / yr'),
      el('span', 'cy', pct(1 - Math.pow(1 - rate, cfg.horizon), 2) + ' / run'));
    d.append(s);

    const b = el('div', 'body');
    b.append(el('p', null, h.oneLine));
    b.append(el('p', 'note', h.mechanism));

    // rate provenance
    const [cls, word] = BASIS_BADGE[h.rate.basis] || ['auth', h.rate.basis];
    const rp = el('p');
    const bd = el('span', 'badge ' + cls, word);
    rp.append(bd, document.createTextNode(
      ` ${h.rate.eventDefinition}. Published range ${fmtRate(h.rate.high)} to ${fmtRate(h.rate.low)} per year; ` +
      `this model uses ${fmtRate(h.rate.best)}.` + (h.rate.trend ? ' ' + h.rate.trend : '')));
    b.append(rp);

    // the live multiplier chain — why the rate on the toggle differs from the cited one
    const chain = explainRate(h, w, cfg).filter((x) => Math.abs(x.mult - 1) > 0.005);
    if (chain.length) {
      const t = el('table');
      const th = el('tr');
      th.append(el('th', null, 'at your settings'), el('th', 'num', 'value'), el('th', 'num', '×rate'), el('th', null, 'why'));
      const thead = el('thead'); thead.append(th); t.append(thead);
      const tb = el('tbody');
      for (const c of chain) {
        const tr = el('tr');
        tr.append(el('td', null, c.var), el('td', 'num', fmtNum(c.value)),
          el('td', 'num', c.mult.toFixed(2) + '×'), el('td', null, c.why));
        tb.append(tr);
      }
      t.append(tb);
      b.append(el('h3', null, 'Why this rate is not the cited rate'), t);
    }

    // tiers
    const tt = el('table');
    const hr = el('tr');
    hr.append(el('th', null, 'if it happens'), el('th', 'num', 'chance'), el('th', 'num', 'dead'),
      el('th', 'num', 'sunlight'), el('th', 'num', 'recovery'), el('th', null, ''));
    const thead2 = el('thead'); thead2.append(hr); tt.append(thead2);
    const tb2 = el('tbody');
    for (const t of h.tiers) {
      const tr = el('tr');
      tr.append(
        el('td', null, t.label),
        el('td', 'num', pct(t.p, 0)),
        el('td', 'num', pct(t.deaths, t.deaths < 0.01 ? 2 : 0)),
        el('td', 'num', t.sunLoss ? `−${pct(t.sunLoss, 0)} × ${t.winterYears}y` : '—'),
        el('td', 'num', t.recovery ? t.recovery + ' y' : '—'),
        el('td', null, t.terminal ? 'no recovery' : t.absolute ? 'unsurvivable' : ''),
      );
      tb2.append(tr);
      const dr = el('tr');
      const dc = el('td', 'note'); dc.colSpan = 6; dc.textContent = t.desc || '';
      dr.append(dc); tb2.append(dr);
    }
    tt.append(tb2);
    b.append(el('h3', null, 'Severity, given that it happens'), tt);

    // citations
    b.append(el('h3', null, 'Sources'));
    for (const c of h.citations) {
      const p = el('div', 'cite');
      const a = el('a', null, `${c.authors} (${c.year}), ${c.venue}`);
      a.href = c.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      p.append(a, document.createTextNode(' — '), el('span', 'fig', c.figure), document.createTextNode(' ' + (c.claim || '')));
      b.append(p);
    }
    if (h.uncertainty) {
      b.append(el('h3', null, 'Where this is weakest'));
      b.append(el('p', 'note', h.uncertainty));
    }
    d.append(b);
    host.append(d);
  }
}

const fmtNum = (v) => Math.abs(v) >= 1000 ? v.toExponential(2) : Math.abs(v) < 0.01 ? v.toExponential(1) : v.toFixed(2);

function renderStatic() {
  // benchmark table
  const host = $('#bench'); host.textContent = '';
  $('#benchIntro').textContent = BENCH.intro;
  const t = el('table');
  const hr = el('tr');
  hr.append(el('th', null, 'source'), el('th', 'num', 'year'), el('th', null, 'what it estimates'),
    el('th', 'num', 'figure'), el('th', null, 'method'));
  const bhead = el('thead'); bhead.append(hr); t.append(bhead);
  const tb = el('tbody');
  for (const b of BENCH.aggregate) {
    const tr = el('tr');
    const src = el('td');
    if (b.url) { const a = el('a', null, b.source); a.href = b.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; src.append(a); }
    else src.textContent = b.source;
    tr.append(src, el('td', 'num', String(b.year)), el('td', null, b.metric),
      el('td', 'num', b.value), el('td', null, b.method || ''));
    tb.append(tr);
  }
  t.append(tb); host.append(t);
  for (const p of BENCH.commentary || []) host.append(el('p', 'note', p));

  // deep time
  const dh = $('#deeptime'); dh.textContent = '';
  for (const d of DEEP.events) {
    const row = el('div', 'dt');
    const when = el('div', 'when', d.when);
    when.append(el('em', null, d.absolute || ''));
    const what = el('div', 'what');
    what.append(el('div', 'hd', d.name));
    const dd = el('div', 'dd');
    dd.textContent = d.detail + ' ';
    if (d.url) { const a = el('a', null, d.source); a.href = d.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; dd.append(a); }
    else if (d.source) dd.append(document.createTextNode(d.source));
    what.append(dd);
    row.append(when, what);
    dh.append(row);
  }

  // honesty
  const hh = $('#honesty'); hh.textContent = '';
  for (const it of HONEST.items) {
    hh.append(el('h3', null, it.title));
    for (const para of it.body) hh.append(el('p', it.warn ? 'warn' : 'note', para));
  }
  $('#footNote').textContent = HONEST.footer;
}

// ── boot ──────────────────────────────────────────────────────────────────

async function boot() {
  const [h, b, d, o] = await Promise.all([
    fetch('data/hazards.json').then((r) => r.json()),
    fetch('data/benchmarks.json').then((r) => r.json()),
    fetch('data/deeptime.json').then((r) => r.json()),
    fetch('data/honesty.json').then((r) => r.json()),
  ]);
  HAZ = h.hazards; BENCH = b; DEEP = d; HONEST = o;
  for (const x of HAZ) HAZIX[x.id] = x;

  cfg = baseConfig();
  fromHash();
  buildPresets();
  buildKnobs();
  buildToggles();
  renderStatic();
  markDirty();

  $('#run').addEventListener('click', run);
  $('#reroll').addEventListener('click', () => {
    $('#seed').value = String(((+$('#seed').value || 1) * 1103515245 + 12345) % 100000 | 0);
    run();
  });
  $('#horizon').addEventListener('change', () => { cfg.horizon = +$('#horizon').value; run(); });
  $('#runs').addEventListener('change', run);
  $('#seed').addEventListener('change', run);
  $('#reset').addEventListener('click', () => applyPreset('now'));
  $('#allOn').addEventListener('click', () => { for (const x of HAZ) cfg.enabled[x.id] = true; buildToggles(); markDirty(); run(); });
  $('#allOff').addEventListener('click', () => { for (const x of HAZ) cfg.enabled[x.id] = false; buildToggles(); markDirty(); });
  $('#share').addEventListener('click', async () => {
    const url = location.origin + location.pathname + toHash();
    try { await navigator.clipboard.writeText(url); $('#share').textContent = 'copied'; }
    catch { $('#share').textContent = 'copy failed'; }
    setTimeout(() => ($('#share').textContent = 'copy link'), 1400);
  });

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      if (!lastRes) return;
      drawSurvival($('#cSurvival'), lastRes, cfg, BENCH.marks);
      drawFan($('#cFan'), lastRes, cfg);
      drawRun($('#cRun'), lastRun, cfg);
    }, 120);
  });

  run();
}

boot().catch((e) => {
  document.body.prepend(Object.assign(document.createElement('pre'),
    { textContent: 'Failed to start: ' + e.message + '\n\nThis page must be served over HTTP — it loads its data with fetch(). Run: node tools/serve.mjs' }));
  console.error(e);
});
