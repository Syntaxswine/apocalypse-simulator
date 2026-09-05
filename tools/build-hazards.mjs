// docs/research-packets.json  +  data/judgement.json  ->  data/hazards.json
//
// Two inputs, deliberately kept apart:
//
//   The RESEARCH is what twelve parallel researchers found in the literature and
//   what a hostile citation auditor confirmed or corrected. Rates, severity
//   tiers, death fractions, citations. Nobody's opinion, or at least nobody's
//   opinion that is not itself a published one.
//
//   The JUDGEMENT is every modelling call the literature could not make: how a
//   death toll splits between prompt and famine, how much aerosol goes up and
//   for how long, how world state moves a rate, how hard one hazard leans on
//   another. Mine, each with a stated reason.
//
// Merging them mechanically means nothing is retyped, and it means a reader can
// attack either layer without having to disentangle it from the other.
//
//   node tools/build-hazards.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { quietTrajectory } from '../js/model.js';
import { VARS, OPS } from '../js/couplings.js';
import { KNOBS, CONST } from '../js/params.js';

const HERE = new URL('.', import.meta.url);

// The default world, used only to calibrate rising rates. See below.
const CAL_YEARS = 100;
const calCfg = { ...CONST, horizon: CAL_YEARS, enabled: {} };
for (const k of KNOBS) calCfg[k.id] = k.def;
const TRAJ = quietTrajectory(calCfg, CAL_YEARS);

// ---------------------------------------------------------------------------
// Calibrating a rate that is allowed to rise
// ---------------------------------------------------------------------------
//
// Several rates on this board were produced by taking a published BY-2100
// probability and dividing it across the century — Ord's engineered-pandemic
// figure, the XPT's AI numbers, Sandberg & Bostrom's nanotech median, Caplan's
// totalitarianism estimate. That annualised number already contains the whole
// century's worth of capability growth: the forecaster was asked about 2100 and
// answered about 2100.
//
// So giving such a rate a rising capability coupling ON TOP double-counts the
// trend. On the first build that took unaligned AI from a century-cumulative
// near 6% — which is roughly where the domain experts sit — to 74%, which is
// outside every published estimate by an order of magnitude, purely as an
// artefact of the coupling's shape.
//
// The fix is not to flatten the rate. Where the risk sits IN TIME matters, and
// a rising rate is the honest shape. The fix is to preserve the century
// INTEGRAL while letting the shape rise: solve for the modifier's reference
// point so that the sum of the multiplier over the calibration century is
// exactly the number of years, i.e. so the mean multiplier is 1.
//
// For a `pow` term that has a closed form:
//     sum_t q_t * (v_t / ref)^coef = years
//     ref = ( sum_t q_t * v_t^coef / years ) ^ (1/coef)
// where q_t is the product of the hazard's other modifiers at time t.
function calibrate(h, mods) {
  const norm = mods.filter((m) => m.normalise);
  if (!norm.length) return mods;
  if (norm.length > 1) { problems.push(`"${h.id}": more than one normalised rate modifier`); return mods; }
  const m = norm[0];
  if (m.op !== 'pow') { problems.push(`"${h.id}": normalise only supports the pow operator`); return mods; }
  const get = VARS[m.var];
  if (!get) { problems.push(`"${h.id}": normalise references unknown variable "${m.var}"`); return mods; }

  let sum = 0;
  for (const w of TRAJ) {
    let q = 1;
    for (const o of mods) {
      if (o === m) continue;
      const g = VARS[o.var], op = OPS[o.op];
      if (!g || !op) continue;
      q *= op(g(w, calCfg), o.ref, o.coef, o.var2 ? VARS[o.var2]?.(w, calCfg) : undefined);
    }
    sum += q * Math.pow(Math.max(1e-12, get(w, calCfg)), m.coef);
  }
  const ref = Math.pow(sum / TRAJ.length, 1 / m.coef);
  return mods.map((o) => (o === m
    ? { ...o, ref: Number(ref.toPrecision(6)), normalise: undefined,
        why: o.why + ` — reference point solved at build time (${ref.toPrecision(4)}) so that the mean multiplier over ${CAL_YEARS} years is exactly 1: the cited rate was annualised from a by-2100 figure, so its century total must be preserved while the shape is allowed to rise` }
    : o));
}
const research = JSON.parse(readFileSync(new URL('../docs/research-packets.json', HERE), 'utf8'));
const J = JSON.parse(readFileSync(new URL('../data/judgement.json', HERE), 'utf8'));

const problems = [];
const DEEP = /^deep-time-/;

// Audit corrections, keyed by hazard, so the shipped citations carry what the
// auditor actually found rather than what the researcher first wrote.
const corrections = new Map();
for (const a of research.audits || []) {
  for (const v of a.verdicts || []) {
    if (v.status === 'confirmed') continue;
    if (!corrections.has(v.hazard_id)) corrections.set(v.hazard_id, []);
    corrections.get(v.hazard_id).push({
      status: v.status,
      claim: v.citation_claim,
      note: v.note,
      corrected: v.corrected_value || '',
    });
  }
}

const kept = research.hazards.filter((h) => !DEEP.test(h.id) && !J.drop[h.id]);
const ids = new Set(kept.map((h) => h.id));

const out = kept.map((h) => {
  const j = J.hazards[h.id];
  if (!j) { problems.push(`no judgement entry for "${h.id}"`); return null; }
  if (j.tiers.length !== h.severity_tiers.length) {
    problems.push(`"${h.id}": ${h.severity_tiers.length} researched tiers but ${j.tiers.length} judged`);
    return null;
  }

  const total = h.severity_tiers.reduce((s, t) => s + t.p_given_event, 0) || 1;

  const tiers = h.severity_tiers.map((t, i) => {
    const jt = j.tiers[i];
    if (jt.promptDeaths > t.deaths_fraction + 1e-9) {
      problems.push(`"${h.id}"/${t.label}: prompt ${jt.promptDeaths} exceeds total ${t.deaths_fraction}`);
    }
    return {
      label: t.label,
      desc: t.description,
      // Normalised so that editing the severity mix cannot silently move the
      // event rate.
      p: t.p_given_event / total,
      deaths: t.deaths_fraction,
      promptDeaths: jt.promptDeaths,
      infra: jt.infra,
      sunLoss: jt.sunLoss,
      winterYears: jt.winterYears,
      recovery: t.recovery_years,
      terminal: !!t.terminal,
      absolute: !!jt.absolute,
      lockIn: !!jt.lockIn,
      split: jt.why,
    };
  });

  // Cascades: the researchers named targets in prose, using whatever id came to
  // hand. The map turns those into real hazard ids or drops them; anything
  // unmapped and unknown is a build error rather than a silent no-op, because a
  // cascade that quietly points at nothing is a coupling the model claims to
  // have and does not.
  const cascades = [];
  for (const c of j.cascades || []) {
    const to = J.cascadeMap[c.to] ?? c.to;
    if (to === null) continue;
    if (!ids.has(to)) { problems.push(`"${h.id}": cascade target "${c.to}" -> "${to}" is not a hazard`); continue; }
    cascades.push({ to, mult: c.mult, years: c.years, when: c.when || '*', why: c.why });
  }
  for (const c of cascades) {
    if (c.when === '*') continue;
    for (const label of (Array.isArray(c.when) ? c.when : [c.when])) {
      if (!tiers.some((t) => t.label === label)) {
        problems.push(`"${h.id}": cascade gated on tier "${label}", which does not exist`);
      }
    }
  }

  return {
    id: h.id,
    name: h.name,
    cat: h.category,
    anthropogenic: j.anthropogenic,
    oneLine: h.one_line,
    mechanism: h.mechanism,
    chronic: j.chronic || 0,
    baseline: j.baseline || 0,
    rate: {
      best: h.annual_probability.best,
      low: h.annual_probability.low,
      high: h.annual_probability.high,
      basis: h.annual_probability.basis,
      eventDefinition: h.annual_probability.event_definition,
      trend: h.annual_probability.trend,
      cap: j.rate?.cap ?? null,
    },
    rateMods: calibrate(h, j.rateMods || []),
    sevMods: j.sevMods || [],
    tiers,
    cascades,
    citations: h.citations.map((c) => ({
      claim: c.claim,
      authors: c.authors,
      year: c.year,
      venue: c.venue,
      figure: c.exact_figure,
      url: c.url,
    })),
    audit: corrections.get(h.id) || [],
    uncertainty: h.uncertainty_notes,
  };
}).filter(Boolean);

// Every judgement entry must correspond to a real researched hazard — a stale
// entry left behind after a rename would otherwise sit there doing nothing.
for (const id of Object.keys(J.hazards)) {
  if (!ids.has(id)) problems.push(`judgement entry "${id}" matches no researched hazard`);
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n`);
  for (const p of problems) console.error('  - ' + p);
  process.exit(1);
}

writeFileSync(new URL('../data/hazards.json', HERE), JSON.stringify({
  _generated: 'tools/build-hazards.mjs from docs/research-packets.json + data/judgement.json — edit those, not this',
  hazards: out,
}, null, 1));

const nCites = out.reduce((s, h) => s + h.citations.length, 0);
const nCorr = out.reduce((s, h) => s + h.audit.length, 0);
console.log(`wrote data/hazards.json — ${out.length} hazards, ${nCites} citations, ${nCorr} audit corrections carried`);
console.log(`dropped ${Object.keys(J.drop).length} multipliers and ${research.hazards.filter((h) => DEEP.test(h.id)).length} deep-time entries`);
