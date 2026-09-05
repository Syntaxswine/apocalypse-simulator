// THE DIRECTION AUDIT.
//
// Straight out of the epistemics brief, and the single most useful idea in it:
//
//   "Instrument the direction of every methodological choice. Log, for each
//    correction and each modelling decision, whether it raised or lowered
//    estimated risk. If the log shows every discretionary choice pushing one
//    way, the model is a doom-generator regardless of how well-sourced its
//    individual parameters are."
//
// Every hazard rate on this board came from the literature. But the couplings
// between them — every rate modifier, every severity modifier, every cascade —
// are MY calls, and a model can be built entirely out of honest numbers and
// still be dishonest if the joins between them all lean the same way. Nobody
// notices, because each individual choice looks defensible.
//
// So: turn each discretionary coupling off, one at a time, and measure the
// signed change in P(any ending). A healthy model has choices pointing both
// ways. A model where every single one raises risk is telling you about its
// author, not about the world.
//
//   node tools/direction-audit.mjs [runs]

import { readFileSync } from 'node:fs';
import { runMany } from '../js/model.js';
import { KNOBS, CONST } from '../js/params.js';

const hazards = JSON.parse(readFileSync(new URL('../data/hazards.json', import.meta.url), 'utf8')).hazards;
const N = Number(process.argv[2]) || 20000;
const SEED = 20260904;

function baseCfg() {
  const c = { ...CONST, horizon: 75, keepTrace: false, enabled: {} };
  for (const k of KNOBS) c[k.id] = k.def;
  for (const h of hazards) c.enabled[h.id] = true;
  return c;
}

// Deep clone so a mutation cannot leak between trials.
const clone = (x) => JSON.parse(JSON.stringify(x));

const base = runMany(hazards, baseCfg(), N, SEED);
const P0 = base.pEnded;
const S0 = base.pScratch;
console.log(`baseline, ${N.toLocaleString()} runs to 2100: P(any ending) ${(P0 * 100).toFixed(3)}%, ` +
  `P(one event >10%) ${(S0 * 100).toFixed(2)}%\n`);

// Each entry removes ONE discretionary choice and re-measures.
const trials = [];

for (const h of hazards) {
  for (const m of h.rateMods || []) {
    trials.push({
      kind: 'rate modifier',
      what: `${h.id} <- ${m.var}${m.var2 ? ' x ' + m.var2 : ''}`,
      apply: (hs) => { const t = hs.find((x) => x.id === h.id); t.rateMods = t.rateMods.filter((y) => y.var !== m.var); },
    });
  }
  for (const m of h.sevMods || []) {
    trials.push({
      kind: 'severity modifier',
      what: `${h.id} <- ${m.var}`,
      apply: (hs) => { const t = hs.find((x) => x.id === h.id); t.sevMods = t.sevMods.filter((y) => y.var !== m.var); },
    });
  }
  for (const c of h.cascades || []) {
    trials.push({
      kind: 'cascade',
      what: `${h.id} -> ${c.to} (x${c.mult})`,
      apply: (hs) => { const t = hs.find((x) => x.id === h.id); t.cascades = t.cascades.filter((y) => y.to !== c.to); },
    });
  }
}
// The two engine-level corrections that are also judgement calls.
trials.push({
  kind: 'engine',
  what: 'chronic baseline subtraction (AMR + climate already in the UN projection)',
  apply: (hs) => { for (const h of hs) h.baseline = 0; },
});
trials.push({
  kind: 'engine',
  what: 'prompt/famine split (all deaths treated as famine, i.e. fully buffered)',
  apply: (hs) => { for (const h of hs) for (const t of h.tiers) t.promptDeaths = 0; },
});

const rows = [];
for (const t of trials) {
  const hs = clone(hazards);
  t.apply(hs);
  const r = runMany(hs, baseCfg(), N, SEED);
  // Removing the choice moves risk to r. So the CHOICE ITSELF contributes the
  // opposite sign: if removing it lowers risk, the choice raises risk.
  rows.push({ ...t, delta: (P0 - r.pEnded) * 100, deltaS: (S0 - r.pScratch) * 100 });
}

rows.sort((a, b) => b.delta - a.delta);

// Each metric gets its OWN noise floor. They have very different variances —
// P(any ending) is a fraction of a percent, P(one event >10%) is tens of
// percent — so one shared tolerance either buries the signal in one column or
// invents it in the other. Sharing it was exactly that bug, and it made the
// audit report 1 resolvable choice out of 92 while claiming to have measured
// them all.
const tolOf = (p) => 2 * Math.SQRT2 * Math.sqrt(p * (1 - p) / N) * 100;
const tol = tolOf(P0);
const tolS = tolOf(S0);
console.log(`  effect in percentage points. Noise floor: +/-${tol.toFixed(3)} on P(any ending), ` +
  `+/-${tolS.toFixed(3)} on P(one event >10%).`);
if (tol > 0.05) {
  console.log(`  NOTE: at ${N.toLocaleString()} runs the ending column resolves only couplings worth more`);
  console.log(`  than ${tol.toFixed(3)} points, and most are worth less. Read the >10% column, or raise the count.`);
}
console.log('');
console.log('   dP(end)   dP(>10%)  kind               choice');
for (const r of rows) {
  const sig = Math.abs(r.delta) > tol || Math.abs(r.deltaS) > tolS;
  console.log(
    `  ${r.delta >= 0 ? '+' : ''}${r.delta.toFixed(3).padStart(7)}  ` +
    `${r.deltaS >= 0 ? '+' : ''}${r.deltaS.toFixed(3).padStart(8)}  ` +
    `${r.kind.padEnd(18)} ${r.what}${sig ? '' : '   (noise)'}`
  );
}

const sig = rows.filter((r) => Math.abs(r.delta) > tol);
const up = sig.filter((r) => r.delta > 0).length;
const down = sig.filter((r) => r.delta < 0).length;
const sigS = rows.filter((r) => Math.abs(r.deltaS) > tolS);
const upS = sigS.filter((r) => r.deltaS > 0).length;
const downS = sigS.filter((r) => r.deltaS < 0).length;

console.log(`\n  ${rows.length} discretionary choices audited.`);
console.log(`  On P(any ending): ${sig.length} resolve above noise — ${up} raise risk, ${down} lower it.`);
console.log(`  On P(one event >10%): ${sigS.length} resolve — ${upS} raise risk, ${downS} lower it.`);
console.log('');
const totalUp = up + upS, totalDown = down + downS;
if (totalDown === 0 && totalUp > 3) {
  console.log('  VERDICT: every resolvable choice raises risk. That is the doom-generator');
  console.log('  signature and it should be treated as a finding about the model, not the world.');
} else {
  console.log('  VERDICT: choices point both ways, which is what an honestly-built coupling');
  console.log('  layer looks like. It does not make the couplings right — only unbiased in sign.');
}
