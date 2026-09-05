// How the world's state changes each hazard's rate and severity.
//
// Everything here is DATA-DRIVEN on purpose. A hazard in data/hazards.json
// declares its own modifiers as a small list of {var, op, ref, coef} terms, and
// this file only evaluates them. That means the interesting content — "a bigger
// arsenal raises the rate roughly linearly, but raises the SEVERITY superlinearly
// because soot scales with cities burned" — lives next to the citation that
// justifies it, and can be argued with, rather than being buried in a function
// somebody would have to reverse-engineer.
//
// It also means the page can show you the multiplier chain for any hazard, which
// is the difference between a model and an oracle.

// Variables a modifier may reference. Anything not on this list is a data error,
// caught by tools/check.mjs rather than silently evaluating to undefined —
// which would quietly turn a modifier into a no-op and make the hazard look
// better behaved than it is.
export const VARS = {
  // world state
  warheads:   (w) => w.warheads,
  warming:    (w) => w.warming,
  bioCap:     (w) => w.bioCap,
  aiCap:      (w) => w.aiCap,
  industry:   (w) => w.industry,
  pop:        (w) => w.pop,
  reserve:    (w) => w.reserveDays,
  year:       (w) => w.year,
  // configuration
  cityTargeting:      (w, c) => c.cityTargeting,
  crisisRate:         (w, c) => c.crisisRate,
  neoSurvey:          (w, c) => c.neoSurvey,
  deflection:         (w, c) => c.deflection,
  reserveDays:        (w, c) => c.reserveDays,
  tradeOpenness:      (w, c) => c.tradeOpenness,
  resilientFoodShare: (w, c) => c.resilientFoodShare,
  synthScreening:     (w, c) => c.synthScreening,
  spillover:          (w, c) => c.spillover,
  aiPrior:            (w, c) => c.aiPrior,
  shadowFactor:       (w, c) => c.shadowFactor,
  alignmentEffort:    (w, c) => c.alignmentEffort,
  gridHardening:      (w, c) => c.gridHardening,
  sensitivityScale:   (w, c) => c.sensitivityScale,
};

export const OPS = {
  // proportional: doubling the variable multiplies the rate by 2^coef
  pow:  (v, ref, coef) => Math.pow(Math.max(1e-9, v) / Math.max(1e-9, ref), coef),
  // additive around a reference point
  lin:  (v, ref, coef) => Math.max(0, 1 + coef * (v - ref)),
  // the same, but where MORE of the variable means LESS hazard
  inv:  (v, ref, coef) => Math.max(0, 1 + coef * (ref - v)),
  // compounding — for capability indices that grow exponentially
  exp:  (v, ref, coef) => Math.exp(coef * (v - ref)),
  // a threshold that either bites or does not
  gate: (v, ref, coef) => (v >= ref ? coef : 1),
  // saturating: approaches `coef` as v grows, for effects with a ceiling
  sat:  (v, ref, coef) => 1 + (coef - 1) * (v / (v + Math.max(1e-9, ref))),
  // TWO-VARIABLE. The retired fraction of a hazard is the PRODUCT of two
  // capabilities, not either one alone: an asteroid is only removed from the
  // board if it is both catalogued AND deflected, and a screening regime only
  // stops a synthesis order if it both covers that provider AND catches the
  // sequence. Written as separate one-variable terms this comes out badly
  // wrong at the corners — full deflection capability against an empty
  // catalogue would appear to retire the hazard, which is exactly backwards.
  retire: (v, ref, coef, v2) => Math.max(0.02, 1 - coef * v * (v2 ?? 1)),
};

function evalMods(mods, w, cfg) {
  let m = 1;
  if (!mods) return m;
  for (const t of mods) {
    const get = VARS[t.var];
    const op = OPS[t.op];
    if (!get || !op) continue; // validated at load; see tools/check.mjs
    const second = t.var2 ? VARS[t.var2]?.(w, cfg) : undefined;
    m *= op(get(w, cfg), t.ref, t.coef, second);
  }
  return m;
}

// Per-year probability that this hazard fires, given the world as it stands.
export function hazardRate(hz, w, cfg) {
  const base = hz.rate.best;
  const m = evalMods(hz.rateMods, w, cfg);
  // Clamped at both ends. The floor keeps a hazard from being switched off by a
  // modifier chain when the user did not switch it off — if you want it gone,
  // untick it. The ceiling keeps a runaway product from producing a certainty
  // the underlying data never claimed.
  return Math.min(hz.rate.cap ?? 0.5, Math.max(0, base * m));
}

// Multiplier on this tier's tabulated death fraction. Separate from the rate
// because most policy acts on one and not the other: an asteroid survey changes
// how OFTEN you are hit, a grain reserve changes what happens WHEN you are.
export function severityScale(hz, tier, w, cfg) {
  const m = evalMods(hz.sevMods, w, cfg) * evalMods(tier.sevMods, w, cfg);
  return Math.min(4, Math.max(0.05, m));
}

// [targetId, multiplier, years] triples for the cascades this tier sets off.
//
// `when` may be '*', a single tier label, or a list of them. The list matters:
// a cascade from "war" to "nuclear war" should not fire off every conflict that
// kills a million people — most of those involve no nuclear-armed state at all —
// but should fire off the world-war-scale tiers and above. Without per-tier
// gating the only options are "always" and "never", and "always" quietly
// inflated the nuclear hazard by nearly a factor of two.
export function cascadeBoosts(hz, tier) {
  const out = [];
  for (const c of hz.cascades || []) {
    if (c.when && c.when !== '*') {
      const list = Array.isArray(c.when) ? c.when : [c.when];
      if (!list.includes(tier.label)) continue;
    }
    out.push([c.to, c.mult, c.years]);
  }
  return out;
}

// Used by the UI to explain a rate rather than just assert it.
export function explainRate(hz, w, cfg) {
  const rows = [];
  for (const t of hz.rateMods || []) {
    const get = VARS[t.var], op = OPS[t.op];
    if (!get || !op) continue;
    const v = get(w, cfg);
    const second = t.var2 ? VARS[t.var2]?.(w, cfg) : undefined;
    rows.push({
      var: t.var2 ? `${t.var} × ${t.var2}` : t.var,
      value: t.var2 ? v * (second ?? 1) : v,
      mult: op(v, t.ref, t.coef, second),
      why: t.why || '',
    });
  }
  return rows;
}
