// What multiplier on the AI hazard reproduces each published prior?
//
// The `aiPrior` knob claims that at particular settings the model reproduces the
// superforecaster, domain-expert and Ord estimates. That claim has to be
// MEASURED, not asserted — a slider labelled with numbers nobody checked is
// exactly the kind of thing this project exists not to ship.
//
//   node tools/calibrate-prior.mjs
import { readFileSync } from 'node:fs';
import { runMany } from '../js/model.js';
import { KNOBS, CONST } from '../js/params.js';

const hazards = JSON.parse(readFileSync(new URL('../data/hazards.json', import.meta.url), 'utf8')).hazards;
const N = Number(process.argv[2]) || 60000;

function cfgAt(mult, horizon) {
  const c = { ...CONST, horizon, keepTrace: false, fan: false, enabled: {} };
  for (const k of KNOBS) c[k.id] = k.def;
  for (const h of hazards) c.enabled[h.id] = true;
  c.aiPrior = mult;
  return c;
}

console.log(`AI prior sweep — ${N.toLocaleString()} runs per point\n`);
console.log('  mult    P(AI extinction)  P(AI ending incl lock-in)   P(any ending)   horizon');
for (const horizon of [75, 95]) {
  for (const m of [0.4, 0.75, 1, 2, 4, 6, 10, 15, 20, 30]) {
    const r = runMany(hazards, cfgAt(m, horizon), N, 20260904);
    const aiEnd = (r.byEnding.find((e) => e[0] === 'unaligned-ai')?.[1] || 0) / r.n;
    // Extinction-only share: rerun attribution against endKind is not stored per
    // hazard, so report the AI ending share and the global extinction rate, which
    // together bound it.
    console.log(`  ${String(m).padStart(5)}   ${(r.pExtinct * 100).toFixed(3).padStart(14)}%   ` +
      `${(aiEnd * 100).toFixed(3).padStart(20)}%   ${(r.pEnded * 100).toFixed(3).padStart(11)}%   to ${CONST.startYear + horizon}`);
  }
  console.log('');
}
