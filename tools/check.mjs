// Verification harness.
//
// Split deliberately into GATES (things that are wrong if they fail, exit 1) and
// INSTRUMENTS (things that are reported and never halt, because their job is to
// tell you what the model is doing, not to have an opinion about it).
//
// The rate-fidelity instrument REFUSES rather than guessing. A hazard with a
// 1-in-a-million-years rate cannot be measured in ten million simulated years —
// you would see a handful of events and the Poisson noise would swamp the
// signal. Reporting a number there would be reporting noise shaped like an
// answer, so instead it reports how many run-years it would actually need.
//
//   node tools/check.mjs            gates + fast instruments
//   node tools/check.mjs --full     everything, including the slow sweeps

import { readFileSync } from 'node:fs';
import { runOnce, runMany, initialWorld, quietTrajectory } from '../js/model.js';
import { VARS, OPS, hazardRate, severityScale } from '../js/couplings.js';
import { KNOBS, CONST, PRESETS } from '../js/params.js';

const HERE = new URL('.', import.meta.url);
const DATA = (process.argv.find((a) => a.startsWith('--data=')) || '').slice(7) || '../data/hazards.json';
const hazards = JSON.parse(readFileSync(new URL(DATA, HERE), 'utf8')).hazards;
const FULL = process.argv.includes('--full');

let failures = 0;
const gate = (name, ok, detail) => {
  if (!ok) failures++;
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${name}${detail ? '  — ' + detail : ''}`);
};
const head = (s) => console.log(`\n${s}\n${'─'.repeat(Math.max(20, s.length))}`);
const note = (s) => console.log(`       ${s}`);

function defaults(over = {}) {
  const cfg = { ...CONST, horizon: 100, keepTrace: false, fan: false, enabled: {} };
  for (const k of KNOBS) cfg[k.id] = k.def;
  for (const h of hazards) cfg.enabled[h.id] = true;
  return { ...cfg, ...over };
}

// ═══════════════════════════════════════════════════════════════════════════
head('GATE — data integrity');
// ═══════════════════════════════════════════════════════════════════════════

const ids = new Set(hazards.map((h) => h.id));
gate('hazard ids are unique', ids.size === hazards.length,
  `${hazards.length} hazards, ${ids.size} distinct ids`);

let badField = [], badMod = [], badCascade = [], thinCite = [], badTier = [], noUrl = [];
for (const h of hazards) {
  for (const f of ['id', 'name', 'cat', 'oneLine', 'mechanism', 'rate', 'tiers', 'citations'])
    if (h[f] === undefined) badField.push(`${h.id}.${f}`);
  if (!(h.rate?.best >= 0)) badField.push(`${h.id}.rate.best`);
  for (const key of ['rateMods', 'sevMods'])
    for (const m of h[key] || []) {
      if (!VARS[m.var]) badMod.push(`${h.id}.${key}: unknown var "${m.var}"`);
      if (!OPS[m.op]) badMod.push(`${h.id}.${key}: unknown op "${m.op}"`);
      if (typeof m.ref !== 'number' || typeof m.coef !== 'number')
        badMod.push(`${h.id}.${key}: non-numeric ref/coef`);
    }
  for (const c of h.cascades || []) {
    if (!ids.has(c.to)) badCascade.push(`${h.id} -> ${c.to}`);
    if (c.when && c.when !== '*') {
      for (const label of (Array.isArray(c.when) ? c.when : [c.when])) {
        if (!h.tiers.some((t) => t.label === label))
          badCascade.push(`${h.id}: cascade gated on unknown tier "${label}"`);
      }
    }
  }
  if ((h.citations || []).length < 3) thinCite.push(`${h.id} (${(h.citations || []).length})`);
  for (const c of h.citations || []) if (!/^https?:\/\//.test(c.url || '')) noUrl.push(`${h.id}: ${c.claim?.slice(0, 40)}`);
  const sum = h.tiers.reduce((s, t) => s + t.p, 0);
  if (Math.abs(sum - 1) > 0.02) badTier.push(`${h.id} tiers sum to ${sum.toFixed(3)}`);
  for (const t of h.tiers) {
    if (!(t.deaths >= 0 && t.deaths <= 1)) badTier.push(`${h.id}/${t.label}: deaths ${t.deaths}`);
    if (t.promptDeaths > t.deaths) badTier.push(`${h.id}/${t.label}: prompt > total`);
  }
}
gate('every hazard has the required fields', !badField.length, badField.join(', '));
gate('every modifier references a known variable and operator', !badMod.length, badMod.join(' | '));
gate('every cascade points at a real hazard and tier', !badCascade.length, badCascade.join(' | '));
gate('every hazard carries at least three citations', !thinCite.length, thinCite.join(', '));
gate('every citation has a URL', !noUrl.length, noUrl.slice(0, 6).join(' | '));
gate('severity tiers are a normalised distribution', !badTier.length, badTier.join(' | '));

const knobIds = new Set(KNOBS.map((k) => k.id));
const presetBad = [];
for (const p of PRESETS) for (const k of Object.keys(p.over)) if (!knobIds.has(k)) presetBad.push(`${p.id}.${k}`);
gate('presets only override real knobs', !presetBad.length, presetBad.join(', '));

// ═══════════════════════════════════════════════════════════════════════════
head('GATE — engine invariants');
// ═══════════════════════════════════════════════════════════════════════════

{
  const cfg = defaults({ keepTrace: true });
  const digest = (r) => JSON.stringify([r.survived, r.endYear, r.pop.toFixed(9), r.industry.toFixed(9), r.deaths.toFixed(9), r.events.length]);
  const a = runOnce(hazards, cfg, 12345);
  const b = runOnce(hazards, cfg, 12345);
  gate('a run is reproducible from its seed', digest(a) === digest(b));

  const c = runOnce(hazards, cfg, 12346);
  gate('different seeds give different histories', digest(a) !== digest(c));
}

{
  // Hammer the state space: high hazard rates, low buffers, long horizon.
  const cfg = defaults({ horizon: 400, keepTrace: true, reserveDays: 10, crisisRate: 8, warheadTarget: 60000, resilientFoodShare: 0 });
  const bad = [];
  for (let s = 0; s < 400; s++) {
    const r = runOnce(hazards, cfg, s * 7919 + 1);
    if (!Number.isFinite(r.pop) || r.pop < 0) bad.push(`seed ${s}: pop ${r.pop}`);
    if (!Number.isFinite(r.industry) || r.industry < 0 || r.industry > 1.0000001) bad.push(`seed ${s}: industry ${r.industry}`);
    if (!Number.isFinite(r.deaths) || r.deaths < 0) bad.push(`seed ${s}: deaths ${r.deaths}`);
    if (!Number.isFinite(r.warming)) bad.push(`seed ${s}: warming ${r.warming}`);
    for (const t of r.trace) {
      if (!Number.isFinite(t.pop) || t.pop < 0) bad.push(`seed ${s} y${t.year}: pop ${t.pop}`);
      if (t.sunLoss < 0 || t.sunLoss > 1) bad.push(`seed ${s} y${t.year}: sunLoss ${t.sunLoss}`);
      if (t.reserveDays < 0) bad.push(`seed ${s} y${t.year}: reserve ${t.reserveDays}`);
    }
    if (bad.length > 6) break;
  }
  gate('no NaN, no negative population, no impossible sunlight over 400 stressed runs', !bad.length, bad.slice(0, 4).join(' | '));
}

{
  // A dead world must stay dead, and a run must never report deaths it did not
  // have the people for.
  const cfg = defaults({ horizon: 300 });
  let bad = 0, checked = 0;
  for (let s = 0; s < 600; s++) {
    const r = runOnce(hazards, cfg, s * 104729 + 3);
    if (r.survived) continue;
    checked++;
    if (r.endYear == null || r.ending == null) bad++;
  }
  gate('every ended run names a year and a cause', bad === 0, `${checked} ended runs inspected`);
}

{
  // Switching a hazard off must remove it entirely — the commonest way a
  // toggle silently lies is a code path that still applies its damage.
  const off = defaults();
  const target = hazards.find((h) => h.rate.best > 1e-4) || hazards[0];
  off.enabled = { ...off.enabled, [target.id]: false };
  let leaked = 0;
  for (let s = 0; s < 2000; s++) {
    const r = runOnce(hazards, off, s * 2654435761 + 11);
    if (r.events.some((e) => e.hazard === target.id)) leaked++;
  }
  gate(`disabling "${target.id}" actually removes it`, leaked === 0, `${leaked} leaks in 2000 runs`);
}

// ═══════════════════════════════════════════════════════════════════════════
head('GATE — the engine fires hazards at the rate the data asks for');
// ═══════════════════════════════════════════════════════════════════════════
//
// This compares OBSERVED fires against the sum of the probabilities the engine
// itself used, which tests the Bernoulli machinery and the enable/boost
// plumbing without re-deriving the rate (re-deriving it would just be testing
// the check against itself).

{
  const cfg = defaults({ horizon: 200 });
  const expected = new Map(), observed = new Map();
  cfg.onDraw = (id, p, fired) => {
    expected.set(id, (expected.get(id) || 0) + p);
    if (fired) observed.set(id, (observed.get(id) || 0) + 1);
  };
  const RUNS = FULL ? 40000 : 8000;
  for (let s = 0; s < RUNS; s++) runOnce(hazards, cfg, s * 40503 + 17);

  let tested = 0, refused = 0, off = [];
  for (const h of hazards) {
    const e = expected.get(h.id) || 0;
    const o = observed.get(h.id) || 0;
    // Poisson: to separate signal from noise at 4 sigma we need the expected
    // count to be comfortably above ~25. Below that the instrument refuses.
    if (e < 25) {
      refused++;
      const years = Math.ceil((25 / Math.max(1e-12, h.rate.best)));
      note(`  refuse  ${h.id.padEnd(26)} expected only ${e.toFixed(2)} events in ${(RUNS * cfg.horizon / 1e6).toFixed(1)}M run-years; ` +
        `would need ~${years.toExponential(1)} run-years to resolve`);
      continue;
    }
    tested++;
    const sigma = Math.sqrt(e);
    if (Math.abs(o - e) > 4 * sigma) off.push(`${h.id}: expected ${e.toFixed(0)}±${sigma.toFixed(0)}, saw ${o}`);
  }
  gate(`fire counts match the drawn probabilities (${tested} hazards resolvable, ${refused} refused)`,
    !off.length, off.join(' | '));
  note(`resolvable hazards are the frequent ones; the rare ones are unfalsifiable at any run count`);
  note(`this bench can afford — which is itself the most important fact about this whole model.`);
}

// ═══════════════════════════════════════════════════════════════════════════
head('INSTRUMENT — the multiplier chain at default settings');
// ═══════════════════════════════════════════════════════════════════════════
//
// Reported, never gated. A modifier whose reference point does not sit at the
// default knob value makes the hazard's effective rate differ from its cited
// rate at t=0. Sometimes that is intended; it should always be visible.

{
  const cfg = defaults();
  const w = initialWorld(cfg);
  console.log('       hazard                      cited/yr     at defaults      ratio');
  for (const h of hazards) {
    const eff = hazardRate(h, w, cfg);
    const ratio = eff / Math.max(1e-30, h.rate.best);
    const flag = Math.abs(ratio - 1) > 0.05 ? '  <-' : '';
    console.log(`       ${h.id.padEnd(26)} ${h.rate.best.toExponential(2).padStart(10)} ` +
      `${eff.toExponential(2).padStart(14)} ${ratio.toFixed(3).padStart(10)}${flag}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
head('INSTRUMENT — does any hazard rate run away over the horizon?');
// ═══════════════════════════════════════════════════════════════════════════
//
// The two hazards driven by an exponential capability index are the ones that
// can quietly turn into certainties. A rate coupled to a compounding index by a
// power law reaches the clamp within decades and the model then says "this
// happens", which is not a finding — it is the shape of the coupling being read
// back. Anything growing by more than ~30x across the horizon wants a saturating
// coupling or an explicit per-hazard cap instead.

{
  const cfg = defaults({ horizon: 100 });
  const w0 = initialWorld(cfg);
  const wEnd = initialWorld(cfg);
  for (let y = 0; y < cfg.horizon; y++) {
    wEnd.bioCap *= 1 + cfg.bioGrowth;
    wEnd.aiCap *= 1 + cfg.aiGrowth;
    wEnd.warming += cfg.warmingRate * cfg.sensitivityScale;
    wEnd.warheads += (cfg.warheadTarget - wEnd.warheads) * 0.03;
  }
  console.log('       hazard                        at 2026        at end       growth   cumulative');
  for (const h of hazards) {
    const a = hazardRate(h, w0, cfg), b = hazardRate(h, wEnd, cfg);
    const g = b / Math.max(1e-30, a);
    // Cumulative probability over the horizon under the drifting rate.
    let surv = 1; const wk = initialWorld(cfg);
    for (let y = 0; y < cfg.horizon; y++) {
      surv *= 1 - Math.min(0.95, hazardRate(h, wk, cfg));
      wk.bioCap *= 1 + cfg.bioGrowth; wk.aiCap *= 1 + cfg.aiGrowth;
      wk.warming += cfg.warmingRate * cfg.sensitivityScale;
      wk.warheads += (cfg.warheadTarget - wk.warheads) * 0.03;
    }
    // A rate whose century integral was solved at build time is ALLOWED to
    // have a steep shape — that is the point of calibrating it. Flagging it as
    // a runaway would be flagging the intended behaviour, so the column says
    // which is which.
    const cal = (h.rateMods || []).some((m) => /solved at build time/.test(m.why || ''));
    const flag = cal ? '  (integral calibrated)' : g > 30 ? '  <- RUNAWAY' : g > 5 ? '  <- steep' : '';
    console.log(`       ${h.id.padEnd(28)} ${a.toExponential(2).padStart(10)} ${b.toExponential(2).padStart(12)} ` +
      `${g.toFixed(1).padStart(11)}x ${((1 - surv) * 100).toFixed(2).padStart(10)}%${flag}`);
  }
  note('cumulative = P(at least once over the horizon) with the rate drifting as shown.');
  note('"integral calibrated" = the cited rate was annualised from a by-2100 figure, so the');
  note('shape is free to rise but the century total is pinned to what was published.');
}

// ═══════════════════════════════════════════════════════════════════════════
head('INSTRUMENT — does each knob move the world in the direction claimed?');
// ═══════════════════════════════════════════════════════════════════════════
//
// A knob that does nothing is a lie told to the user, and a knob that does the
// opposite of what its label says is a worse one. Both show up here. Trade
// openness is expected to be non-monotone by construction and says so.

{
  const N = FULL ? 6000 : 1500;
  const SWEEPS = [
    { id: 'reserveDays',        dir: -1, why: 'more grain in store must lower deaths' },
    { id: 'resilientFoodShare', dir: -1, why: 'sunless calories must lower deaths' },
    { id: 'warheadTarget',      dir: +1, why: 'more warheads must raise deaths',            probe: 'full-scale-strategic-exchange' },
    { id: 'crisisRate',         dir: +1, why: 'more crises must raise deaths',              probe: 'full-scale-strategic-exchange' },
    { id: 'cityTargeting',      dir: +1, why: 'soot comes from burning cities',             probe: 'full-scale-strategic-exchange' },
    { id: 'synthScreening',     dir: -1, why: 'screening must lower engineered-pathogen risk', probe: 'engineered-pandemic-deliberate-release' },
    { id: 'neoSurvey',          dir: -1, why: 'a completer catalogue must lower impact risk',   probe: 'large-asteroid-impact' },
    { id: 'deflection',         dir: -1, why: 'deflection must lower impact risk',              probe: 'large-asteroid-impact' },
    { id: 'gridHardening',      dir: -1, why: 'hardened transformers must lower space-weather risk', probe: 'carrington-class-geomagnetic-superstorm' },
    { id: 'spillover',          dir: +1, why: 'more spillover pressure must raise pandemic risk',    probe: 'natural-pandemic' },
    { id: 'aiGrowth',           dir: +1, why: 'faster capability growth must raise AI risk',         probe: 'unaligned-ai' },
    { id: 'alignmentEffort',    dir: -1, why: 'safety work must lower AI severity',                  probe: 'unaligned-ai' },
    { id: 'warmingRate',        dir: +1, why: 'a hotter pathway must raise climate risk',            probe: 'tipping-cascade-high-sensitivity-tail' },
    { id: 'tradeOpenness',      dir: 0,  why: 'deliberately non-monotone: openness feeds and it propagates bans' },
  ];
  // A knob acting on a genuinely rare hazard cannot move an aggregate like
  // P(collapse) at any run count this bench can afford — the asteroid survey is
  // the clean example, at 1.3e-6 per year. Reporting that as "this knob does
  // nothing" would be false: the knob works, on something too rare to see.
  // So each sweep also probes the hazard it is supposed to act on directly,
  // through that hazard's own century-cumulative probability and mean severity,
  // which resolve exactly and need no Monte Carlo at all.
  for (const s of SWEEPS) {
    const k = KNOBS.find((x) => x.id === s.id);
    const pts = [0, 0.25, 0.5, 0.75, 1].map((f) => k.min + f * (k.max - k.min));
    const ys = pts.map((v) => runMany(hazards, defaults({ [s.id]: v, horizon: 100 }), N, 999).pCollapse);
    // The tolerance has to come from the run count, not from a number somebody
    // liked the look of. Two independent binomial proportions at N runs have a
    // standard error of sqrt(2 p (1-p) / N); anything inside two of those is
    // noise, and calling it a bent response would be reporting the Monte
    // Carlo's own variance as a finding about the model.
    const pbar = ys.reduce((a, b) => a + b, 0) / ys.length;
    const tol = 2 * Math.sqrt(2 * Math.max(1e-6, pbar * (1 - pbar)) / N);
    let mono = true;
    for (let i = 1; i < ys.length; i++) {
      const d = ys[i] - ys[i - 1];
      if (s.dir > 0 && d < -tol) mono = false;
      if (s.dir < 0 && d > tol) mono = false;
    }
    // Range, not endpoints. A deliberately non-monotone knob has equal ends and
    // a real dip in the middle; comparing only the ends would call it dead.
    const flat = (Math.max(...ys) - Math.min(...ys)) < tol;

    let probeTxt = '', probeMoves = false;
    if (s.probe) {
      const hz = hazards.find((h) => h.id === s.probe);
      const vals = pts.map((v) => {
        const cfg = defaults({ [s.id]: v, horizon: 100 });
        const traj = quietTrajectory(cfg, cfg.horizon);
        let surv = 1, sev = 0;
        for (const w of traj) surv *= 1 - Math.min(0.95, hazardRate(hz, w, cfg));
        const w0 = traj[Math.floor(traj.length / 2)];
        for (const t of hz.tiers) sev += t.p * t.deaths * severityScale(hz, t, w0, cfg);
        return { p: 1 - surv, sev };
      });
      probeMoves = Math.abs(vals[4].p - vals[0].p) > 1e-9 || Math.abs(vals[4].sev - vals[0].sev) > 1e-9;
      probeTxt = `
         ${s.probe}: P ${vals.map((v) => (v.p * 100).toFixed(2)).join(' ')} | severity ${vals.map((v) => (v.sev * 100).toFixed(2)).join(' ')}`;
    }

    // FLAT is only a defect if the knob fails to move its OWN hazard too.
    const tag = flat && !probeMoves ? 'FLAT' : s.dir === 0 ? 'n/a ' : mono ? ' ok ' : 'BENT';
    console.log(`  ${tag}  ${s.id.padEnd(20)} P(collapse): ${ys.map((y) => (y * 100).toFixed(2).padStart(6)).join(' ')}  +/-${(tol * 100).toFixed(2)}${probeTxt}`);
    if (flat && probeMoves) note(`        moves its own hazard cleanly; its share of P(collapse) is below what ${N} runs resolve`);
    else if (flat || (s.dir !== 0 && !mono)) note(`        expected: ${s.why}`);
  }
  note('P(collapse) = share of runs losing over half the population at some point.');
}

// ═══════════════════════════════════════════════════════════════════════════
head('INSTRUMENT — against the published aggregates');
// ═══════════════════════════════════════════════════════════════════════════
//
// Never a gate. The model is not required to agree with any of these — the
// disagreement between them is larger than the disagreement with the model —
// but a reader deserves to see where it lands among them.

{
  const N = FULL ? 40000 : 12000;
  const cfg = defaults({ horizon: 75 }); // to 2100, the horizon most figures use
  const r = runMany(hazards, cfg, N, 4242);
  const bench = JSON.parse(readFileSync(new URL('../data/benchmarks.json', HERE), 'utf8'));
  console.log(`       this model, to 2100, ${N.toLocaleString()} runs:`);
  console.log(`         P(one event killing >10%)  ${(r.pScratch * 100).toFixed(2)}%`);
  console.log(`         P(one event killing >50%)  ${(r.pCollapse * 100).toFixed(2)}%`);
  console.log(`         P(extinction)              ${(r.pExtinct * 100).toFixed(3)}%  +/-${(r.seExtinct * 196).toFixed(3)}`);
  console.log(`         P(lock-in)                 ${(r.pLockIn * 100).toFixed(3)}%`);
  console.log(`         P(either ending)           ${(r.pEnded * 100).toFixed(3)}%  +/-${(r.seEnded * 196).toFixed(3)}`);
  console.log('');
  for (const b of bench.aggregate) {
    console.log(`       ${(b.source + ' ' + b.year).padEnd(42)} ${b.metric.padEnd(30)} ${b.value}`);
  }
  note('');
  note('If this model sits outside all of these, that is a finding about the model.');
  note('If it sits inside all of them, that is only weak evidence: they disagree with');
  note('each other by more than an order of magnitude on several risks.');
}

// ═══════════════════════════════════════════════════════════════════════════
head(failures ? `${failures} GATE FAILURE${failures === 1 ? '' : 'S'}` : 'all gates green');
process.exit(failures ? 1 : 0);
